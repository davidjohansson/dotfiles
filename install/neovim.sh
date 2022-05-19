DOTFILES=$HOME/.dotfiles

echo -e "\\nLinking neovim files to ~/.config/nvim"
echo "=============================="


if [ ! -d "$HOME/.config" ]; then
    echo "Creating ~/.config"
    mkdir -p "$HOME/.config"
fi

target="$HOME/.config/nvim"
if [ -e "$target" ]; then
  echo "~${target#$HOME} already exists... Skipping."
else
  echo "Creating symlink for $config"
  ln -s "$DOTFILES/neovim" "$target"
fi

