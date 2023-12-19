DOTFILES=$HOME/.dotfiles

echo -e "\\nLinking vscode files to  ~/Library/Application\ Support/Code/User"
echo "=============================="


ln -s "$DOTFILES/vscode/keybindings.json" ~/Library/Application\ Support/Code/User/keybindings.json

ln -s "$DOTFILES/vscode/settings.json" ~/Library/Application\ Support/Code/User/settings.json

