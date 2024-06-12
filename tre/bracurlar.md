

# Producks

## Hämta alla offerings i variants i accessories som har en reduction amount
curl -X 'GET' 'https://sales-k8s.bt1.tre.se/bff-treshop-dk/api/v4/accessories?categories&offset=0&limit=100' -H 'accept: application/json' -H 'X-Requesting-System: swagger-ui' | jq '.accessories[].variants[].offering | {offeringId: .id, reductionAmount: .price.reductionAmount, paymentPlanOptions: .paymentPlanOptions} | select(.reductionAmount > 0) '
