DOTFILES=$HOME/.dotfiles

echo -e "\\nLinking hammerspoon files to ~/.config/hammerspoon"
echo "=============================="


if [ ! -d "$HOME/.config" ]; then
    echo "Creating ~/.config"
    mkdir -p "$HOME/.config"
fi

target="$HOME/.hammerspoon"
if [ -e "$target" ]; then
  echo "~${target#$HOME} already exists... Skipping."
else
  echo "Creating symlink for $config"
  ln -s "$DOTFILES/hammerspoon" "$target"
fi

# Hammerspoon requires config file to be in .hammerspoon, this fixes that
# see https://github.com/Hammerspoon/hammerspoon/issues/1734
defaults write org.hammerspoon.Hammerspoon MJConfigFile "~/.config/hammerspoon/init.lua"
