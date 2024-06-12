var program = require("commander");
const axios = require("axios");
const { init, url, getEnvironment, getEnvOptionDesc } = require("./utils.js");
const allowedEnvs = [ getEnvironment('local'), getEnvironment('bt1'), getEnvironment('nr')]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")
program.option("-v, --verbose", "Verbose output")
program.option("-b, --bff", "Fetch through sales-bff rather than directly towards checkout")

init(program, (environment, args) => {
  const useBff = program.opts().bff;
  const checkoutUrl =   useBff
      ? url("bff-treshop-dk", `/api/v4/checkouts/accepted/${args[0]}`, environment)
      : url("checkout", `api/v4/checkouts/${args[0]}`, environment)

  if(program.opts().verbose){
    console.log(`Using url ${checkoutUrl}`)
  }

  axios({
    method: "get",
    url: checkoutUrl,
    headers: { "content-type": "application/json", "X-Requesting-System": "scmd" },
  })
    .then(function (spec) {
      console.log(JSON.stringify(spec.data, null, 4));
    })
    .catch((error) => {
      console.log("An error occurred:");
      console.log(error.response.data);
    });
}, allowedEnvs);
