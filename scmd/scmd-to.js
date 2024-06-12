const { program} = require("commander");
const axios = require("axios");
const crypto = require('crypto');
const restify = require('restify');
const opn = require('opn');
const fs = require("fs");
const homedir = require('os').homedir();
const {init, getEnvironment, getEnvOptionDesc} = require("./utils.js");
const allowedEnvs = [getEnvironment('bt1'), getEnvironment('nr')]

/*
scmd command to retrieve an access token from an id provider.

Based on this article:
https://developer.okta.com/blog/2018/12/13/oauth-2-for-native-and-mobile-apps

Requires a configuration file with settings for the id provider, the client connecting to it and some urls needed to access it.
The default location of this file is $HOME/.scmd/oidc-config.json, but can be overridden with the --oidcconfig option.
You need to provide the following information:

 {
  "id_provider_url": "<base url of the id_provider, e g https://login.microsoftonline.com/>",
  "authentication_endpoint": "<authentication endpoint at the id provider, e g <tenant>/oauth2/v2.0/authorize>",
  "token_endpoint": "<token endpoint at the id provider, e g <tenant>/oauth2/v2.0/token>",

  "scopes": "<space separated list of claims, e g openid <tenantId>/.default email profile offline_access>",

  "client_id": "<client id>",
  "client_secret": "<client secret>", //TODO: base64 encode this value in the file, then decode it in the script
  "local_redirect_uri": "<The local url where the authentication code will be redirected to, e g /login/oauth2/code/oidc>"
  }

Use 'sample-azure-oidc-config.json' in this repo as a start.

LIMITATIONS AND TODOs:
- Use node 15, node 18 does not seem to work at all, node 14 and 16 prints deprecation warnings.
- The client_secret in the config file should be base64 encoded
 */

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")
.option('-v, --verbose', 'Verbose logging and step-by-step execution of the authorization code flow',
    false)
.option('-h, --header', 'Print as auth header, practical i curl e g',
    false)
.option('-c, --oidcconfig <oidcconfig>', 'File containing oidc config',
    `${homedir}/.scmd/oidc-config.json`)

init(program, (environment, args) => {

  const verbose = program.opts().verbose;

  const config = readConfig()


  if (
      !config.client_id
      || !config.id_provider_url
      || !config.scopes
      || !config.local_redirect_uri
      || !config.client_secret
  ) {
    program.opts().help();
    process.exit(1);
  }

  const localRedirect = `http://localhost:3000${config.local_redirect_uri}`

//Setup local http server to receive authorization code and call token endpoint
  startOauthClient();

  const {codeVerifier, codeChallenge} = createPKCEVerifierAndChallenge();

// Step 1: call authorize endpoint where user will authenticate to the Id provider
  const authorizeUrl = buildAuthorizeUrl(codeChallenge);
  verbose && console.log(
      `About to call Authorize URL: ${authorizeUrl}\npress any key to continue...`);

  if (verbose) {
    keypress().then(() => {
      opn(authorizeUrl);
    });
  } else {
    opn(authorizeUrl);
  }

// Step 2: The Id provider redirects back to this app with an auth code
  async function authenticationCodeRedirectHandler(req, res, next) {
    const body = '<html><body><h4>OAuth2 authorize complete. '
        + 'You can close this tab.</h4></body></html>';
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body), 'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
    next();

    if (verbose) {
      console.log('\nGot authorization code: ' + req.query.code + '\n');
      console.log('press any key to continue...');
      await keypress();
    }

    // Step 3: call token endpoint where Okta will exchange code for tokens
    const formParams = new URLSearchParams();
    formParams.append("grant_type", 'authorization_code');
    formParams.append("redirect_uri", localRedirect);
    formParams.append("client_id", config.client_id);
    formParams.append("client_secret", config.client_secret);
    formParams.append("code", req.query.code);
    formParams.append("code_verifier", codeVerifier);

    if (verbose) {
      console.log(
          `Here is the complete form post that will be sent to the ${config.token_endpoint} endpoint:`);
      console.log({...Object.fromEntries(formParams), client_secret: '***'});

      console.log('press any key to continue...');
      await keypress();
    }

    await axios.post(config.id_provider_url + config.token_endpoint, formParams)
    .then(response => {
      if (program.opts().header) {
        console.log(`Authorization: Bearer ${response.data.access_token}`);
      } else {
        console.log(response.data.access_token);
      }
    }).catch(error => {
      console.log(error)
    })

    process.exit(0);
  }

  function readConfig() {
    try {

      const config = JSON.parse(fs.readFileSync(program.opts().oidcconfig));
      verbose && console.log(`Using config\n ${JSON.stringify({...config, client_secret: '***'}, null, 2)}`)
      return config

    } catch (e) {
      console.log(
          `The file specified as '${program.opts().oidcconfig}' either does not exists or can't be parsed as JSON.`)

      process.exit(1);
    }
  }

  function startOauthClient() {
    var server = restify.createServer({
      name: 'myapp', version: '1.0.0'
    });
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());
    server.listen(3000);
    server.get(config.local_redirect_uri, authenticationCodeRedirectHandler);
    verbose && console.log(`Started web server on port 3000, listening for calls on ${localRedirect}\n`)
  }

  function createPKCEVerifierAndChallenge() {
    const codeVerifier = uuid();
    const codeChallenge = base64url(
        crypto.createHash('sha256').update(codeVerifier).digest('base64'));

    verbose && console.log(
        `Created Code Verifier (v): ${codeVerifier} and code challenge ${codeChallenge}\n`);

    return {codeVerifier, codeChallenge};
  }

  function uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }

    return s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' + s4()
        + '_' + s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' + s4()
  }

  function base64url(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

  function buildAuthorizeUrl(codeChallenge) {
    const authorizeUrl = config.id_provider_url + config.authentication_endpoint
        + '?'
        + 'response_type=code&'
        + 'client_id=' + config.client_id + '&'
        + 'scope=' + config.scopes.replaceAll(' ', '%20') + '&'
        + 'state=' + uuid() + '&'
        + 'redirect_uri=' + localRedirect + '&'
        + 'code_challenge_method=S256&'
        + 'code_challenge=' + codeChallenge;
    return authorizeUrl;
  }

  async function keypress() {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
      process.stdin.setRawMode(false)
      resolve()
    }))
  }

}, allowedEnvs);
