
const { init, url, getEnvironment } = require("./utils.js");
var program = require("commander");
const {getEnvOptionDesc} = require("./utils");
const allowedEnvs = [ getEnvironment('localhost'), getEnvironment('bt1'), getEnvironment('nr'), getEnvironment('prod')]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")

init(program, (environment, args) => {

  const service = args[0]
  const stats = {
    url : url(service, null, environment),
    environment: getEnvironment(environment)
  }

  console.log(JSON.stringify(stats))

});
