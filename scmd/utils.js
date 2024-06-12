function init(program, callback, allowedEnvs) {
  var stdin = "";
  program.parse(process.argv);

  const suggestedEnv = program.opts().environment;

  const environmentObj = getEnvironment(suggestedEnv)

  if (environmentObj == null) {
    throw `'${suggestedEnv} does not match any known environment`
  }

  const allowed = ((allowedEnvs || environments).find(
      e => e.shortName == environmentObj.shortName) != null)
  if (!allowed) {
    throw `Can't use this tool in ${environmentObj.shortName}. Allowed environments are ${allowedEnvs.map(
        e => e.shortName)}`
  }

  const environment = environmentObj.shortName;

  if (process.stdin.isTTY) {
    try {
      callback(environment, program.args);
    } catch (e) {
      console.log(`An error occurred: ${e}`);
    }
  } else {
    process.stdin.on("readable", function () {
      var chunk = this.read();
      if (chunk !== null) {
        stdin += chunk;
        const pipedArgs = [stdin.trim()];
        const allArgs = [...program.args, ...pipedArgs];
        try {
          callback(environment, allArgs);
        } catch (e) {
          console.log(`An error occurred: ${e}`);
        }
      }
    });
  }
}

function url(service, path, environment) {
  const selectedEnv = getEnvironment(environment)

  if (selectedEnv == null) {
    throw `Can't find environment "${environment}"`;
  }

  if (selectedEnv.shortName == 'localhost') {

    const localPort = getLocalPort(service)
    return `${selectedEnv.host}:${localPort}${path != null ? `/${path}` : ""}`
  } else {
    return `${selectedEnv.host}/${service}${path != null ? `/${path}` : ""}`
  }
}

function getLocalPort(service) {

  const ports = {
    "confirmation": 8104,
    "mom-engine": 8087,
    "checkout": 8085
  }

  return ports[service]
}

const environments = [
  {
    variants: ["local", "localhost", "l"],
    host: `http://localhost`,
    shortName: "localhost",
    niceName: "Localhost"
  },
  {
    variants: ["bt1", "bt", "b"],
    host: "https://sales-k8s.bt1.tre.se",
    shortName: "bt1",
    niceName: "Bt1"

  },
  {
    variants: ["nextrel", "nr", "n"],
    host: "https://sales-k8s.nextrel.tre.se",
    shortName: "nr",
    niceName: "Nextrel"

  },
  {
    variants: ["prod", "prd", "p"],
    host: "https://sales-k8s.tre.se",
    shortName: "prd",
    niceName: "Prod"

  },
  {
    variants: ["support", "sup", "s"],
    host: "https://sales-k8s-support.tre.se",
    shortName: "sup",
    niceName: "Support"
  },
  {
    variants: ["3dev"],
    host: "https://sales-cloud.bt1.tre.se",
    shortName: "3dev",
    niceName: "3dev"
  },
];

const specialEnvs =   {
    kibana: {
      url: {
        bt1: "https://kibana.bt1.tre.se",
        nr: "https://kibana.nextrel.tre.se",
        prd: "https://kibana.tre.se"
      },
      index: {
        bt1: "e7af6120-9688-11e9-bdc8-f77299de3273",
        nr: "cf9d1180-c28f-11e9-ad12-05b207cf0f2e",
        prd: "f80148e0-c80b-11e9-b06c-3f468566035a"
      }
    }
  }

function getEnvOptionDesc(allowedEnvironments) {

  const envs = allowedEnvironments != null ? allowedEnvironments : environments
  const header = `\n\tOption values per env:`

  return envs.reduce((prev, current) => {
    return `${prev}\n\t\t${current.niceName}: ${current.variants}`
  }, header)
}

function getEnvironment(envKey) {

  return environments.find((environment) =>
      environment.variants.includes(envKey)
  );
}

function createRandomOrderReference() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
  }
  return result;
}

module.exports.url = url;
module.exports.init = init;
module.exports.getEnvironment = getEnvironment;
module.exports.createRandomOrderReference = createRandomOrderReference;
module.exports.environments = environments;
module.exports.getEnvOptionDesc = getEnvOptionDesc;
module.exports.specialEnvs = specialEnvs;
