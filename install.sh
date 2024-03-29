#!/usr/bin/env bash

command_exists() {
    type "$1" > /dev/null 2>&1
}

echo "Installing dotfiles."


echo "Soft linking zsch.symlink to root"
ln -s ~/.dotfiles/zsh/zshrc.symlink ~/.zshrc

echo "Installing stuff, make sure brew is installed"
brew install zsh
brew install tmux
brew install neovim
brew install zplug
brew install fzf
brew install borkdude/brew/babashka



# To install useful key bindings and fuzzy completion:
$(brew --prefix)/opt/fzf/install


echo "Initializing submodule(s)"
git submodule update --init --recursive

source install/link.sh
source install/neovim.sh
source install/karabiner.sh
source install/intellij.sh
source install/hammerspoon.sh
source install/vscode.sh

if ! command_exists zsh; then
    echo "zsh not found. Please install and then re-run installation scripts"
    exit 1
elif ! [[ $SHELL =~ .*zsh.* ]]; then
    echo "Configuring zsh as default shell"
    chsh -s "$(command -v zsh)"
fi

echo "Done. Reload your terminal."
