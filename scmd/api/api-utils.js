const axios = require("axios");
const {url} = require("../utils");

function fetchMoMGraphQl(query, environment, variables) {
  return axios({
    method: "post",
    url: url("mom-engine", "graphql", environment),
    headers: { "content-type": "application/json" },
    data: { query, variables },
    timeout: 5000,
  }).then(function (response) {
    return response.data;
  });
}
module.exports.fetchMoMGraphQl = fetchMoMGraphQl;
