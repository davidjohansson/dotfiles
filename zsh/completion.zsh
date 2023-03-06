# matches case insensitive for lowercase
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

# pasting with tabs doesn't perform completion
zstyle ':completion:*' insert-tab pending

# default to file completion
zstyle ':completion:*' completer _expand _complete _files _correct _approximate


array=(
api-mock-server
bff-elgiganten-se-service
bff-treshop-dk-hazelcast-service
bff-treshop-dk
bif-logistics-partner
cart-service
cartrjmx-service
checkout
cia-client
confirmation
contract-hazelcast-service
contract-service
cops-admin-ui
cpc
cpc-admin-ui
delivery-options
deploy-assistant
document-upload-service
gom
hazelcast
hazelcast-management-center
imdg
inventory-backlog-service
minimum-cost
mom-admin
mom-engine
mom-intake
mom-service
nginx
order-info
orderstatus
postfix
price-service
product-content-treshop-dk
product-definition
product-offering-qualification
product-search
product-search-ingester
rabbitmq
rabbitmq-nodes
rabbitmq-service
retail-checkout
returns
returns-bff
returns-frontend
sales-order-checkout
salesdb-api
salesdb-api-service
salesdb-service
salesengine
salesweb
spring-admin-svc
store-inventory-backend
store-inventory-cia-client
store-inventory-frontend
test2240
)

# Custom fuzzy completion for "scmd" command
_fzf_complete_scmd() {
  _fzf_complete --multi --reverse --prompt="scmd> " -- "$@" < <(
    

   for i in "${array[@]}"
    do
      echo "$i"
    done

  )

}

_fzf_complete_s() {
  _fzf_complete --multi --reverse --prompt="s> " -- "$@" < <(
    

   for i in "${array[@]}"
    do
      echo "$i"
    done

  )

}


_fzf_complete_timew() {
  _fzf_complete --multi --reverse --prompt="timew> " -- "$@" < <(
  listDates.clj 
  )

}


_fzf_complete_kbt1() {
  _fzf_complete --multi --reverse --prompt="kbt1> " -- "$@" < <(
    

   for i in "${array[@]}"
    do
      echo "$i"
    done

  )

}


_fzf_complete_bookmarks() {
  _fzf_complete --multi --reverse --prompt="b> " -- "$@" < <(
    

 # buku -p -f 40 | fzf | cut -f1 | xopen
  buku -p -f 40 

  )

}

