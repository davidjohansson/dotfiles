const co = require("co");
const prompt = require("co-prompt");
var keychain = require('keychain');
const program = require("commander");
const axios = require("axios");
const k8s = require('@kubernetes/client-node');
const asciichart = require('asciichart')
const _ = require("lodash");
const chalk = require('chalk');
const util = require('util')
const {init, url, getEnvironment, getEnvOptionDesc} = require("./utils.js");
const allowedEnvs = [getEnvironment('local'), getEnvironment('bt1'),
  getEnvironment('nr')]

function getLatestConditionMessage(conditions) {
  if (conditions === undefined) {
    return "";
  }

  let condition = conditions.reduce(
      (a, b) => (a.lastTransitionTime > b.lastTransitionTime ? a : b));
  return condition.message;
}

async function fetchK8sAppIssues() {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
  let stringList = [];
  try {
    let deploymentResponse = await k8sApi.listNamespacedDeployment("sales");
    deploymentResponse.body.items.filter(
        item => item.status.readyReplicas < item.status.replicas)
    .map(item => stringList.push(
        (item.metadata.name + " " + item.status.readyReplicas + "/"
            + item.status.replicas + " " + getLatestConditionMessage(
                item.status.conditions))))

    let statefulSetResponse = await k8sApi.listNamespacedStatefulSet("sales");
    statefulSetResponse.body.items.filter(
        item => item.status.readyReplicas < item.status.replicas)
    .map(item => stringList.push(
        item.metadata.name + " " + item.status.readyReplicas + "/"
        + item.status.replicas + " " + getLatestConditionMessage(
            item.status.conditions)));
  } catch (e) {
    throw new Error(e)
  }

  return stringList
}

function getFromAndTo(daysback) {
  const to = new Date();
  to.setHours(10, 0, 0, 0);

  const from = new Date();
  from.setDate(to.getDate() - daysback);
  from.setHours(10, 0, 0, 0);
  return {from: from.toISOString(), to: to.toISOString()};
}

function fetchKibanaErrors(e) {
  var requestBody = require("./kibana-search-request-with-time.json");

  const {from, to} = getFromAndTo(1);

  requestBody.query.bool.filter[0].range["@timestamp"].gte = from;
  requestBody.query.bool.filter[0].range["@timestamp"].lte = to;

  const options = {
    url: "https://elasticsearch.tre.se:9200/k8s_prod-sales-*/_search", //Spring Boot Admin SVC
    method: "POST",
    data: requestBody,
    // headers: {
    //     'Authorization': 'Basic ***REMOVED***'
    // }
    auth: {
      username: e.username,
      password: e.password,
    },
  };

  let errorChunk = axios(options)
  .then(function (response) {
    const data = response.data
    const byApp = _.countBy(
        data.hits.hits,
        (hit) => hit.fields["kubernetes.labels.app"]
    );

    const byHour = _.countBy(
        data.hits.hits,
        (hit) => new Date(hit.fields["@timestamp"]).toISOString()
        .replace(/T/, ' ')
        .replace(/\:.+/, '')
    );

    return {from: from, to: to, errByApp: byApp, errByHour: byHour};
  })
  .catch(function (err) {
    const error = {
      origin: "Kibana",
      statusCode: err.response.data.status,
      reason: err.response.data.error.reason,
    };
    throw new Error(error)
  });
  return errorChunk;
}

function formatDate(date) {
  return new Date(date).toISOString()
  .replace(/T/, ' ')
  .replace(/\..+/, '')
}

async function fetchDeployments() {
  const service = "deployassistant";
  const deploymentsUrl = url(service, "api/v1/scheduled-deploy/", "support");

  return await axios({
    method: "get",
    url: deploymentsUrl,
    headers: {"content-type": "application/json"},
  })
  .then(function (spec) {
    return spec.data;
  })
  .catch((err) => {
    const error = {
      origin: "Deployments",
      statusCode: err.response.data.status,
      reason: err.response.data.error.reason,
    };
    throw new Error(error)
  });

}

function getErrorLevelEmoji(value) {
  switch (true) {
    case (value > 40):
      return "🔴";
    case (value > 20):
      return "🟠";
    case (value > 5):
      return "🟡";
    default:
      return "🔵"
  }
}

async function fetchJenkinsStatus(e) {
  let endToEnd = await axios({
    method: "get",
    url: "https://jenkins-sales.tre.se/job/end-to-end-tests/job/master/lastBuild/api/json",
    headers: {
      // 'Authorization': 'Basic ***REMOVED***',
      "content-type": "application/json"
    },
    auth: {
      username: e.username,
      password: e.password,
    },
  })
  .then(function (spec) {
    return spec.data;
  })
  .catch((error) => {
    throw new Error("Call to Jenkins failed with " + error.message)
  });

  let cdKubernetes = await axios({
        method: "get",
        url: "https://jenkins-sales.tre.se/job/cd-kubernetes/job/master/lastBuild/api/json",
        headers: {
          // 'Authorization': 'Basic ***REMOVED***',
          "content-type": "application/json"
        },
        auth: {
          username: e.username,
          password: e.password,
        },
      })
      .then(function (spec) {
        return spec.data;
      })
      .catch((error) => {
        throw new Error("Call to Jenkins failed with " + error.message)
      })
  ;

  return {endToEnd: endToEnd, cdKubernetes: cdKubernetes}
}

function getBuildStatusEmoji(buildStatus) {
  return buildStatus === "FAILURE" ? "🆘" : "✅";
}

function getPasswordAsync(param) {
  return new Promise(function (resolve, reject) {
    keychain.getPassword(param, function (err, data) {
      if (err !== null) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

co(function* () {
  const username = yield prompt("username: ");
  return username;
})
.then(username => {
  return getPasswordAsync({account: username, service: 'scmd'})
  .then(password => ({username, password}))
  .catch(
      err => {
        console.log('Unable to fetch password, set password with scmd pass -s')
        process.exit();
      })
})
.then((e) => {
  console.log(e.username);
  // console.log(e.password);
  console.log(`
-------------------------------------------
     ██████   █████  ███████ ██   ██ 
     ██   ██ ██   ██ ██      ██   ██ 
     ██   ██ ███████ ███████ ███████ 
     ██   ██ ██   ██      ██ ██   ██ 
scmd.██████  ██   ██ ███████ ██   ██ 
-------------------------------------------`)

  fetchK8sAppIssues().then(appIssues => {
    console.log(chalk.bold("\tK8s deployment issues"));
    appIssues.forEach(issue => console.log("\t\t❌  - " + issue));
    console.log(`-------------------------------------------`);
  })
  .catch(e => {
    console.log(chalk.bold("\tK8s deployment issues"));
    console.log("Failed to load K8s deployment issues: " + e.message)
  })

  fetchKibanaErrors(e).then(errorChunk => {
    console.log(chalk.bold("\tKibana errors"));
    console.log("\tFrom: " + formatDate(errorChunk.from));
    console.log("\tTo: " + formatDate(errorChunk.to));
    for (const [key, value] of Object.entries(errorChunk.errByApp)) {
      console.log("\t\t[" + getErrorLevelEmoji(value) + "] " + key, value);
    }
    console.log("")
    let plotdata = [];
    let counter = 0;
    for (const [key, value] of Object.entries(errorChunk.errByHour)) {
      plotdata[counter] = value;
      counter++;
    }
    console.log(asciichart.plot(plotdata, {height: 6}));
    console.log(`-------------------------------------------`);
  })
  .catch(e => {
    console.log(chalk.bold("\tKibana errors"));
    console.log("Failed to load Kibana errors: " + e.message)
  })

  fetchDeployments().then(deployments => {
    console.log(chalk.bold("\tScheduled deployments"));
    deployments.forEach(deploy => console.log(
        "\t\t🔄 " + deploy.artifact.replace("nexus3.tre.se:8082/sales/", "")
        + " - " + formatDate(deploy.deployTime) + " - " + deploy.initiator));
    console.log(`-------------------------------------------`);
  })
  .catch(e => {
    console.log(chalk.bold("\tScheduled deployments"));
    console.log("Failed to load deployment status: " + e.message)
  })

  fetchJenkinsStatus(e).then(builds => {
    console.log(chalk.bold("\tJenkins build status"));
    console.log(
        "\tCD-Kubernetes - " + getBuildStatusEmoji(builds.cdKubernetes.result));
    console.log("\t\t" + builds.cdKubernetes.fullDisplayName);
    console.log("\tE2E-Tests - " + getBuildStatusEmoji(builds.endToEnd.result));
    console.log(
        "\t\t" + builds.endToEnd.fullDisplayName.replaceAll("\n", "\n\t\t"));
    console.log(`-------------------------------------------`);
  })
  .catch(e => {
    console.log(chalk.bold("\tJenkins build status"));
    console.log("Failed to load build status: " + e.message)
  })

}, allowedEnvs)
.catch(e => {
  console.log(JSON.stringify(e.message))
  process.exit();
})
