# matches case insensitive for lowercase
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

# pasting with tabs doesn't perform completion
zstyle ':completion:*' insert-tab pending

# default to file completion
zstyle ':completion:*' completer _expand _complete _files _correct _approximate


array=(
bff-elgiganten-se
bff-elgiganten-se-service
bff-treshop-dk-hazelcast-service
bff-treshop-dk-service
bif-logistics-partner
carts
cashier-order-service
checkout
cia-client
confirmation
contract-service
cops-admin-ui
cpc
delivery-options
deploy-assistant
document-upload-service
gom
hazelcast-management-center
inventory-backlog-service
minimum-cost
mom-admin
mom-engine
mom-intake
order-info
orderstatus
product-content-treshop-dk
product-definition
product-offering-qualification
product-offering-qualification-hazelcast
product-search
product-search-ingester
retail-checkout
returns
returns-bff
returns-frontend
sales-bff-treshop-dk
sales-order-checkout
salesdb-service
salesengine
salesweb
secure-cluster-proxy
sosdb-service
spring-admin-svc
store-inventory-backend
store-inventory-frontend
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

_fzf_complete_kports() {
  _fzf_complete --multi --reverse --prompt="kports> " -- "$@" < <(
    

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

