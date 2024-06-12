const axios = require("axios");
const { program } = require("commander");
const {init,url, getEnvironment, getEnvOptionDesc} = require("./utils");

const allowedEnvs = [ getEnvironment('bt1'), getEnvironment('nr'), getEnvironment('prod')]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")
program.option("-v, --verbose", "Display detailed endpoint info");
program.option("-c, --curl", "Print a curl command");

init(program, (environment, args) => {
  const service = args[0];
  const pathParameterReplacement = args[1];

  const verbose = program.opts().verbose;

  const urlToService = url(service, "", environment);
  const version = "v3";

  axios({
    method: "get",
    url: `${urlToService}/${version}/api-docs`,
    headers: { "content-type": "application/json" },
  })
    .then(function (spec) {
      Object.entries(spec.data.paths).forEach((entry) => {

        let regex = /\{[a-zA-Z]+\}/g;
        const endpoint = pathParameterReplacement ?  entry[0].replaceAll(regex, pathParameterReplacement) : entry[0];

        if (verbose) {
          console.log(JSON.stringify(entry));
        } else if(program.opts().curl){

          Object.keys(entry[1])
          .map(key => key.toUpperCase())
          .forEach(verb => {

            const urlToEndpoint = url(service, endpoint, environment)
            console.log(`curl -X ${verb} "${urlToEndpoint}"`);
          })

        } else if(program.opts().curl){

        } else {
           console.log(`${Object.keys(entry[1]).map(key => key.toUpperCase())}\t${endpoint}`);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}, allowedEnvs);
