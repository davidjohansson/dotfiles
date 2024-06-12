var program = require("commander");
const {getDeployments} = require('./api/deployments')
const chalk = require('chalk');
const { init, getEnvironment, getEnvOptionDesc } = require("./utils.js");
const allowedEnvs = [ getEnvironment('bt1'), getEnvironment('nr'),getEnvironment('support'),]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs), "bt1")
program.option("-v, --verbose", "Verbose output")

init(program, (environment, args) => {


  getDeployments(environment, args).then((results) => {

    const namePaddingSize = findLongestImageName(results, 'shortName') 
    const bt1PaddingSize = findLongestImageName(results, 'imageInBt1') 
    const nrPaddingSize = findLongestImageName(results, 'imageInNR') 
    const prodPaddingSize = findLongestImageName(results, 'imageInProd') 

    results.forEach((item) => {

      if(program.opts().verbose){
        console.log(item)
      } else {

        const colorize =  item.imageInNR != item.imageInProd 
          ? chalk.red 
          : item.imageInBt1 != item.imageInProd 
          ? chalk.yellow  
          : chalk.green

        console.log(colorize(`${pad(item.shortName, namePaddingSize)}\t${pad( item.imageInBt1, bt1PaddingSize)}\t${pad( item.imageInNR, nrPaddingSize)}\t${pad( item.imageInProd, prodPaddingSize )}`))

      }
    })

  }).then(() => {
    console.log("")
    console.log(chalk.green("Green: Same tag in BT1, NR and PRD"))
    console.log(chalk.red("Red: Diff between NR and PRD"))
    console.log(chalk.yellow("Yellow: Diff between BT1 and PRD"))
  })

}, allowedEnvs);

function findLongestImageName(results, imageNameProp){
  return results.reduce((accum, current) =>   current[imageNameProp].length > accum ? current[imageNameProp].length : accum, 0);
}

function pad(toPad, l){

  const length = toPad != null ? toPad.length : 0;
  const padding =l - length

  return [...Array(padding).keys()].reduce((previous) => `${previous} ` , toPad)
}
