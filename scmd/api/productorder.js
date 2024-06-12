const {fetchMoMGraphQl} = require("./api-utils.js");
const fs = require('fs');

function fetchProductOrderReferences(environment) {
  const query = `
    query searchProductFulfillments {
        searchProductFulfillments {
          orderHead {
            orderReference
          }
        }
    }
  `;
  return fetchMoMGraphQl(query, environment)
  .then(({data, errors}) => {
    if (errors != null) {
      throw "Errors occurred querying graphql: " + JSON.stringify(errors, null,
          4)
    }
    if (data != null) {
      return data.searchProductFulfillments.map(spo => spo.orderHead.orderReference);
    }
  })
}

function searchProductFulfillments(environment, orderReference) {
  const query = `query searchProductFulfillments($orderReference: String!) {
    searchProductFulfillments(orderReference: $orderReference) {
        orderHead {
            csp {
                cspName
                country
            }
            acceptedDate
            seller {
                id
                name
                channelId
                costCenter
            }
        }
        id
        status
        crmId
        erpId
        created
        trackingId
        shippingDate
        contractUrl
        isCancellable

        productFulfillmentItems{
            id
            name
            productId
            itemType
            itemCategory
        }

        statusTransitions {
            id
            status
            message
            timestamp
            initiator
        }

        installmentPlans{
            id
            status
            installmentPlanType
            period
            sellerId
            hardwareInstallmentPlanId
            hardwareInstallmentPlanPeriodId
            crmOrderId
            crmServiceId
            customerAccountId
            workerId
            taxpayerId
            installmentPlanItems{
                periodicAmount
                productFulfillmentItemId
                productFulfillmentItem{
                    id
                    name
                    productId
                    itemType
                    itemCategory
                }
            }
            statusTransitions{
                id
                status
                message
                timestamp
                initiator
            }
        }
        upfrontPlan {
            paymentRef {
                value
            }

            upfrontPlanItems {
                productFulfillmentItem{
                    id
                    name
                    productId
                    itemType
                    itemCategory
                }
            }
            status
            statusTransitions{
                id
                status
                message
                timestamp
                initiator
            }
        }
        subscriptions {
            id
            status
            subscriptionType
            bindingPeriod
            noticePeriod
            sellerId
            crmOrderId
            msisdn
            customerAccountId
            workerId
            taxpayerId
            productFulfillmentItem {
                id
                name
                identificationNumber
                productId
                itemType
                itemCategory
            }
            statusTransitions{
                id
                status
                message
                timestamp
                initiator
            }
        }
    }
    searchReturnOrders(productOrderRef: $orderReference){
        returnRef
    }
}
`

  return fetchMoMGraphQl(query, environment, {orderReference})
  .then(({data, errors}) => {
    if (errors != null) {
      throw "Errors occurred querying graphql: " + JSON.stringify(errors, null,
          4)
    }
    if (data != null) {
      return data.searchProductFulfillments;
    }
  })
}

function fetchProductOrderJson(environment, orderReference) {
  const query = `query fetchProductOrderJson($orderReference: String!) {
    fetchProductOrderJson(orderReference: $orderReference) 
}
`

  return fetchMoMGraphQl(query, environment, {orderReference})
  .then(({data, errors}) => {
    if (errors != null) {
      throw "Errors occurred querying graphql: " + JSON.stringify(errors, null,
          4)
    }
    if (data != null) {
      return JSON.parse(data.fetchProductOrderJson);
    }
  })
}


module.exports.fetchProductOrderReferences = fetchProductOrderReferences
module.exports.searchProductFulfillments = searchProductFulfillments
module.exports.fetchProductOrderJson = fetchProductOrderJson
