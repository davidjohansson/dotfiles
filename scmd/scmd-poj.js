const { program } = require("commander");
const {fetchProductOrderJson} = require("./api/productorder");
const {init, url, getEnvironment, getEnvOptionDesc} = require("./utils");

const allowedEnvs = [ getEnvironment('localhost'), getEnvironment('bt1'), getEnvironment('nr')]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")

init(program, (environment, args) => {
  fetchProductOrderJson(environment, args[0])
  .then(productOrder => console.log(JSON.stringify(productOrder)))
  .catch(error => console.log("An error occurred: " + error))
}, allowedEnvs);
