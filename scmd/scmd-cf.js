const { program } = require("commander");
const {init, getEnvironment, getEnvOptionDesc} = require("./utils");
const {createConfirmation, acceptConfirmation, rejectConfirmation} = require("./api/confirmations.js");

const allowedEnvs = [getEnvironment('local'), getEnvironment('bt1'), getEnvironment('nr')]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")
program.option("-c, --create", "Create a new confirmation with a random externalId")
program.option("-a, --accept", "Create and accept a new confirmation with a random externalId")
program.option("-r, --reject", "Create and reject a new confirmation with a random externalId")

init(program, (environment, args) => {
  if(program.opts().create){
    createConfirmation(environment)
      .then(created => console.log(created.externalIdentifier.externalId))
  } else  if(program.opts().accept) {
    createConfirmation(environment)
      .then(created => created.externalIdentifier)
      .then(externalIdentifier => {
        console.log(externalIdentifier.externalId)
        return acceptConfirmation(externalIdentifier, environment) 
      }).catch(e => console.log(e))
  } else  if(program.opts().reject) {
    createConfirmation(environment)
      .then(created => created.externalIdentifier)
      .then(externalIdentifier => {
        console.log(externalIdentifier.externalId)
        return rejectConfirmation(externalIdentifier, environment) 
      })
  }

  else {
    //TODO
    console.log("READ")
  }

}, allowedEnvs);
