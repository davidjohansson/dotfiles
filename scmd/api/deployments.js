
const {getEnvironment} = require('../utils.js')
const axios = require('axios')

function getDeployments(environment, args){

  const cluster = getEnvironment(environment).shortName.toUpperCase();

  const options = {
    url: "https://sales-k8s-support.tre.se/sas/api/v1/deployments", //Spring Boot Admin SVC
    params: {
      namespace: "sales",
    },
  };

  return axios(options)
    .then(function (response) {

      var results = [];

      const deps = response.data

      const imagesInBT1 = deps
        .filter((item) => {
          return item.cluster == "BT1"

        })
        .reduce((previous, current) => {

          return {...previous, [current.name] : current.currentImage.tag}

        }, {})

      const imagesInNR = deps
        .filter((item) => {
          return item.cluster == "NR"

        })
        .reduce((previous, current) => {

          return {...previous, [current.name] : current.currentImage.tag}

        }, {})

      const imagesInProd = deps
        .filter((item) => {
          return item.cluster == "PRD"

        })
        .reduce((previous, current) => {

          return {...previous, [current.name] : current.currentImage.tag}

        }, {})

      if (args.length === 0) {
        deps
          .filter((entry) => entry.cluster === 'BT1')
          .forEach((entry) => {
            results.push(toResultEntry(entry, imagesInBT1, imagesInNR, imagesInProd));
          });
      } else {

        args.forEach((service) => {
          const serviceInfo = deps.filter(
            (entry) => entry.name === service && entry.cluster === cluster
          );

          if (serviceInfo != null && serviceInfo.length > 0) {
            results.push(toResultEntry(serviceInfo[0], imagesInBT1))
          } else {
            results.push(`No deployment info found for service '${service}' in environment '${environment}'`)
          }
        });
      }

      return results.sort();

    })
    .catch(function (err) {
      console.error(err);
    });

}

function toResultEntry(entry, imagesInBT1, imagesInNR, imagesInProd){
  const shortName = entry.currentImage.shortName
  const upcomingTag = entry.upcomingImage?.tag || "N/A"
  const imageInBt1 = imagesInBT1[entry.name] || "N/A"
  const imageInNR = imagesInNR[entry.name] || "N/A"
  const imageInProd = imagesInProd[entry.name] || "N/A"

  return  {shortName, upcomingTag, imageInBt1, imageInNR, imageInProd}
}

module.exports.getDeployments = getDeployments
