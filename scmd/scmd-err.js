const co = require("co");
const prompt = require("co-prompt");
var _ = require("lodash");
const {program} = require("commander");
const axios = require("axios");

program.option("-d, --daysback <daysback>", "Number of days back to search.", 1);

program.parse();

co(function* () {
  const username = yield prompt("username: ");
  const password = yield prompt.password("password: ");
  return { username, password };
}).then((e) => {
  var requestBody = require("./kibana-search-request.json");

  const { from, to } = getFromAndTo(program.opts().daysback);

  requestBody.query.bool.filter[0].range["@timestamp"].gte = from;
  requestBody.query.bool.filter[0].range["@timestamp"].lte = to;


  const options = {
    url: "https://elasticsearch.tre.se:9200/k8s_prod-sales-*/_search", //Spring Boot Admin SVC
    method: "POST",
    data: requestBody,
    // headers: {
    //   'Authorization': 'Basic hardcodedbase64authheaderhere'
    // },
    auth: {
      username: e.username,
      password: e.password,
    },
  };

  axios(options)
  .then(function (response) {

    const data = response.data

    if (program.args.length === 0) {
      const result = _.countBy(
          data.hits.hits,
          (hit) => hit.fields["kubernetes.labels.app"]
      );

      console.log(`From: ${from} `);
      console.log(`To: ${to} `);
      console.log(JSON.stringify(result, null, 4));
      } else {
      const results = _.filter(data.hits.hits, (hit) =>
          hit.fields["kubernetes.labels.app"].includes(program.args[0])
      );
      const groupedErrors = _.countBy(
          results,
          (hit) => hit.fields["logevent.message"]
      );

        console.log(`From: ${from} `);
        console.log(`To: ${to} `);
        console.log(groupedErrors);
      }
    })
    .catch(function (err) {
      const error = {
        statusCode: err.response.data.status,
        reason: err.response.data.error.reason,
      };
      console.error(`Error fetching from Elastic:`);
      console.error(JSON.stringify(error, null, 4));
    });
});

function getFromAndTo(daysback) {
  const to = new Date();
  to.setHours(10, 0, 0, 0);

  const from = new Date();
  from.setDate(to.getDate() - daysback);
  from.setHours(10, 0, 0, 0);
  return { from: from.toISOString(), to: to.toISOString() };
}
