var program = require("commander");
const axios = require("axios");
const { init, url, getEnvironment, getEnvOptionDesc } = require("./utils.js");
const allowedEnvs = [ getEnvironment('bt1'), getEnvironment('nr'),getEnvironment('support'),]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")
program.option("-v, --verbose", "Verbose output")

init(program, (environment, args) => {
  const service = "deployassistant";

  const deploymentsUrl = url(service, "api/v1/scheduled-deploys", environment);
 
  axios({
    method: "get",
    url: deploymentsUrl,
    headers: { "content-type": "application/json" },
  })
    .then(function (spec) {
      console.log(JSON.stringify(spec.data, null, 4));
    })
    .catch((error) => {
      console.log(error);
    });
}, allowedEnvs);
