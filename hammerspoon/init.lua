hs.loadSpoon("SpoonInstall")

meh = {"ctrl", "alt" ,"shift" }
hyper = {"ctrl", "alt" ,"shift" ,"cmd"}

-- Hotkeys to open apps
spoon.SpoonInstall:andUse("AppLauncher", {

  config = { modifiers = hyper} ,
  hotkeys = {
    c = "Google Chrome",
    p = "1Password",
    s = "Microsoft Teams (work or school)",
--    s = "Microsoft Teams classic",
    t = "iTerm",
    i = "intellij IDEA",
    v = "visual Studio Code",
   --  = "dash",
    d = "discord",
    m = "mail",
    f = "Firefox",
    k = "keymapp",
    x = "dbVisualizer",
    h = "things",
    o = "obsidian",
    k = "Anki",
    g = "figma",
    w = "Warp",
    n = "Nebo",
    b = "Burp Suite Professional",

  }
})

hs.hotkey.bind(hyper, 'z', function()
  local pos = hs.mouse.absolutePosition()
  print(pos.x)
  print('eeeo')

  print(pos.y)

  local newPos = hs.geometry.point(-1000, pos.y)
  hs.mouse.setAbsolutePosition(newPos)

end )

-- Cycle currently focoused window between available srceens
hs.hotkey.bind(meh, 'g', function()
  -- get the focused window
  local win = hs.window.focusedWindow()
  -- get the screen where the focusesss window is displayed, a.k.a. current screen
  local screen = win:screen()
  -- compute the unitRect of the focused window relative to the current screen
  -- and move the window to the next screen setting the same unitRect 
  win:move(win:frame():toUnitRect(screen:frame()), screen:next(), true, 0)
end)
