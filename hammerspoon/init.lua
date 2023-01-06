hs.loadSpoon("SpoonInstall")

meh = {"ctrl", "alt" ,"shift" }
hyper = {"ctrl", "alt" ,"shift" ,"cmd"}

-- Hotkeys to open apps
spoon.SpoonInstall:andUse("AppLauncher", {

  config = { modifiers = meh} ,
  hotkeys = {
    c = "Google Chrome",
    p = "1Password",
    s = "Microsoft Teams",
    t = "iTerm",
    i = "intellij IDEA",
    v = "Visual Studio Code",
    d = "dash",
    m = "mail",
    f = "Firefox",
  }
})

-- Cycle currently focused window between available srceens
hs.hotkey.bind(hyper, 'g', function()
  -- get the focused window
  local win = hs.window.focusedWindow()
  -- get the screen where the focused window is displayed, a.k.a. current screen
  local screen = win:screen()
  -- compute the unitRect of the focused window relative to the current screen
  -- and move the window to the next screen setting the same unitRect 
  win:move(win:frame():toUnitRect(screen:frame()), screen:next(), true, 0)
end)
