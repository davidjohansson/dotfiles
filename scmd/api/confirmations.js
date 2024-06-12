const axios = require("axios");
const {createRandomOrderReference, url} = require("../utils.js");

function createConfirmation(environment) {

  const externalId = createRandomOrderReference();


  const payload = 
    {
      externalIdentifier: {
        externalId,
        namespace: "salesNet.Checkout"
      },
      callbackUrl: "http://checkout:8080/api/v1/customer-decision",
      confirmingParty: {
        firstName: "Nils-Johan",
        emailAddress: "kalle.karlsson@tre.se",
        consumer: true,
        country: "DK",
        taxpayerId: "1711819297",
      },
      duration: "PT48H",
      sellerId: "sales_agent_test",
      journey: {
        name: "DKC_API_EVENT_TRIGGER_scmd"
      },
      payload: {
        version: "AcceptedCheckoutDto",
        jsonPayload: `{\"orderRef\":\"${externalId}\",\"firstName\":\"Nils-Johan\",\"emailAddress\":\"kalle.karlsson@tre.se\",\"careOf\":\"\",\"street\":\"Rikshospitalet\",\"streetNumber\":\"1\",\"floor\":\"\",\"door\":\"\",\"postalCode\":\"1699\",\"city\":\"K¬öbenhavn\",\"country\":\"DK\",\"offers\":[{\"productId\":\"A23515\",\"name\":\"BeoPlay P6 Natural\",\"itemType\":\"ACCESSORY\",\"paymentMethod\":\"INVOICE\",\"prices\":{\"originalPrice\":{\"inclVat\":3000.00,\"exclVat\":2400.00,\"vatPercentage\":25,\"vatAmount\":600.00,\"currency\":\"DKK\"},\"sellingPrice\":{\"inclVat\":3000.00,\"exclVat\":2400.00,\"vatPercentage\":25,\"vatAmount\":600.00,\"currency\":\"DKK\"},\"standardPrice\":{\"inclVat\":3000.00,\"exclVat\":2400,\"vatPercentage\":25,\"vatAmount\":600.00,\"currency\":\"DKK\"}},\"installment\":{\"paymentPlan\":{\"period\":\"P10M\",\"periodicAmount\":300.00}}}],\"summarizedOfferPrices\":{\"total\":{\"priceInclVat\":3000.00,\"priceExclVat\":2400.00,\"vatAmount\":600.00,\"currency\":\"DKK\"},\"installment\":{\"priceInclVat\":3000.00,\"priceExclVat\":2400.00,\"vatAmount\":600.00,\"currency\":\"DKK\",\"periodPrices\":[{\"period\":\"M1-10\",\"value\":300.00}]},\"upfront\":{\"priceInclVat\":0,\"priceExclVat\":0,\"vatAmount\":0,\"currency\":\"DKK\"}}}`
      }

    }

  const serviceUrl = url('confirmation', 'api/v2/confirmations', environment);

  return axios({
    method: "post",
    url: serviceUrl,
    headers: { "content-type": "application/json" },
    data: payload,
  })
    .then(function (spec) {
      return spec.data;
    })
}

function acceptConfirmation(externalIdentifier, environment) {

  return axios({
    method: "post",
    url: url('confirmation', 'api/v2/confirmations/accept', environment),
    headers: { "content-type": "application/json" },
    data: externalIdentifier,
  })
    .then(function (spec) {
      return spec.data;
    })
}

function rejectConfirmation(externalIdentifier, environment) {

  return axios({
    method: "post",
    url: url('confirmation', 'api/v2/confirmations/reject', environment),
    headers: { "content-type": "application/json" },
    data: externalIdentifier,
  })
    .then(function (spec) {
      return spec.data;
    })
}


module.exports.createConfirmation = createConfirmation;
module.exports.acceptConfirmation = acceptConfirmation;
module.exports.rejectConfirmation = rejectConfirmation;
