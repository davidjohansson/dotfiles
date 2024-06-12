var program = require("commander");
const axios = require("axios");
const { init, url, getEnvironment, getEnvOptionDesc } = require("./utils.js");
const allowedEnvs = [ getEnvironment('local'), getEnvironment('bt1'), getEnvironment('nr')]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")
program.option("-c, --categories <categories>",
    "Comma separated list of categories")
program.option("-v, --verbose", "Use verbose logging")

init(program, (environment, args) => {

 const categoriesQs = ( program.opts().categories || "")
  .split(",")
  .map(c => "categories=" + c )
  .reduce((acc, curr) =>   `${acc}&${curr}`, "")
  
  const accUrl =  url("bff-treshop-dk", `/api/v4/accessories?offset=0&limit=199${categoriesQs}`, environment)

  program.opts().verbose && console.log(accUrl)
  
  axios({
    method: "get",
    url: accUrl,
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
