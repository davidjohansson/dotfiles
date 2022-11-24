DOTFILES=$HOME/.dotfiles

echo -e "\\nLinking karabiner files to ~/.config/karabiner"
echo "=============================="


if [ ! -d "$HOME/.config" ]; then
    echo "Creating ~/.config"
    mkdir -p "$HOME/.config"
fi

target="$HOME/.config/karabiner"
if [ -e "$target" ]; then
  echo "~${target#$HOME} already exists... Skipping."
else
  echo "Creating symlink for $config"
  ln -s "$DOTFILES/karabiner" "$target"
fi

