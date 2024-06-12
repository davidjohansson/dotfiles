const { program } = require("commander");
const {fetchProductOrderReferences} = require("./api/productorder");
const {init, url, getEnvironment, getEnvOptionDesc} = require("./utils");

const allowedEnvs = [getEnvironment('localhost'), getEnvironment('bt1'), getEnvironment('nr'), getEnvironment('prod'), getEnvironment('3dev')]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")

init(program, (environment, args) => {

  fetchProductOrderReferences(environment)
  .then(poRefs => poRefs.forEach(ref => console.log(ref)))
  .catch(error => console.log("An error occurred: " + error))
}, allowedEnvs);
