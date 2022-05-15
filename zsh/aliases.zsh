# Davids own stuff
alias git='LANG=en_US git'
alias cl="clear"
alias msr="mvn spring-boot:run"
alias xopen="xargs -I {} open {}"
alias xcurl="xargs -I {} curl -X 'GET' {} -H 'accept: application/json'"
alias xnmd="xargs nvim '+set nospell'"
alias typora="open -a typora"
alias s="scmd"

alias xtyp="xargs open -a typora"
alias zx="zx --quite"
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ......="cd ../../../../.."
alias pd="pushd ~/.dotfiles"

alias k="kubectl --kubeconfig ~/.kube/config-bt1 -n sales"
alias kbt1="kubectl --kubeconfig ~/.kube/config-bt1 -n sales"
alias knr="kubectl --kubeconfig ~/.kube/config-nr -n sales"
alias kpr="kubectl --kubeconfig ~/.kube/config-prd -n sales"
alias ksu="kubectl --kubeconfig ~/.kube/config-support -n sales"
alias kos="kubectl --kubeconfig ~/.kube/config-os -n sales-poc"
alias ocos="oc --config=~/.kube/config-os -n sales-poc"

alias k9sbt1="k9s --kubeconfig ~/.kube/config-bt1 -n sales"
alias k9snr="k9s --kubeconfig ~/.kube/config-nr -n sales"
alias k9spr="k9s --kubeconfig ~/.kube/config-prd -n sales"
alias k9ssu="k9s --kubeconfig ~/.kube/config-support -n delivery"
alias k9sos="k9s --kubeconfig ~/.kube/config-os -n sales-poc"

alias eg="exa --long --header --inode --git"
alias b="buku --suggest"
alias bm="buku -p -f 40 | fzf | cut -f1"
alias bmo="buku -p -f 40 | fzf | cut -f1 | xopen"
alias bmp="buku -p -f 40 | fzf | cut -f1 | tee >(pbcopy)"
alias bms="buku -p -f 40 | fzf | cut -f1  | swagger | xopen"

alias disp1="/usr/local/bin/display_manager.py res 2560 1490 60"

alias disp2="/usr/local/bin/display_manager.py res 3360 1890 60"

# reload zsh config
alias reload!='RELOAD=1 source ~/.zshrc'

# Detect which `ls` flavor is in use
if ls --color > /dev/null 2>&1; then # GNU `ls`
    colorflag="--color"
else # macOS `ls`
    colorflag="-G"
fi

# use nvim, but don't make me think about it
alias vim="nvim"

# Filesystem aliases
alias ..='cd ..'
alias ...='cd ../..'
alias ....="cd ../../.."
alias .....="cd ../../../.."

alias l="ls -lah ${colorflag}"
alias la="ls -AF ${colorflag}"
alias ll="ls -lFh ${colorflag}"
alias lld="ls -l | grep ^d"
alias rmf="rm -rf"

# Helpers
alias grep='grep --color=auto'
alias df='df -h' # disk free, in Gigabytes, not bytes
alias du='du -h -c' # calculate disk usage for a folder


# IP addresses
alias ip="dig +short myip.opendns.com @resolver1.opendns.com"
alias localip="ipconfig getifaddr en1"
alias ips="ifconfig -a | perl -nle'/(\d+\.\d+\.\d+\.\d+)/ && print $1'"

# Flush Directory Service cache
alias flush="dscacheutil -flushcache"

# View HTTP traffic
alias sniff="sudo ngrep -d 'en1' -t '^(GET|POST) ' 'tcp and port 80'"
alias httpdump="sudo tcpdump -i en1 -n -s 0 -w - | grep -a -o -E \"Host\: .*|GET \/.*\""

# Trim new lines and copy to clipboard
alias trimcopy="tr -d '\n' | pbcopy"

# Recursively delete `.DS_Store` files
alias cleanup="find . -name '*.DS_Store' -type f -ls -delete"
# remove broken symlinks
alias clsym="find -L . -name . -o -type d -prune -o -type l -exec rm {} +"

# File size
alias fs="stat -f \"%z bytes\""

# ROT13-encode text. Works for decoding, too! ;)
alias rot13='tr a-zA-Z n-za-mN-ZA-M'

# Hide/show all desktop icons (useful when presenting)
alias hidedesktop="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias showdesktop="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"

# One of @janmoesen’s ProTip™s
for method in GET HEAD POST PUT DELETE TRACE OPTIONS; do
    alias "$method"="lwp-request -m '$method'"
done

# Kill all the tabs in Chrome to free up memory
# [C] explained: http://www.commandlinefu.com/commands/view/402/exclude-grep-from-your-grepped-output-of-ps-alias-included-in-description
alias chromekill="ps ux | grep '[C]hrome Helper --type=renderer' | grep -v extension-process | tr -s ' ' | cut -d ' ' -f2 | xargs kill"

alias chrome="/Applications/Google\\ \\Chrome.app/Contents/MacOS/Google\\ \\Chrome"
alias canary="/Applications/Google\\ Chrome\\ Canary.app/Contents/MacOS/Google\\ Chrome\\ Canary"

alias pcat='pygmentize -f terminal256 -O style=native -g'
