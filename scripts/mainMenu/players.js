import { system, world } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"
import * as game from "../lib/game"
import { adminMenu } from "./admin"

world.beforeEvents.itemUse.subscribe(eventData => {
  let item = eventData.itemStack
  let player = eventData.source
  let callback = player.isSneaking && player.hasTag("admin") ? adminMenu: playerMenu
  if (item.typeId == "item:menu") system.run(() => callback(player))
})

export function playerMenu(player) {
  let fm = new ActionFormData()
  .title("Function menu")
  .body('Function Menu, By: NakataArdnta')
  buttons.forEach((data) => {
    let button = game.getFeature(data.id)
    let buttonText = button ? `§r${color}${data.display}`: `§r${color}${data.display}\n§r${disableColor}${disableText}`
    let icon = button ? data.icon: disableIcon
    fm.button(buttonText, icon)
  })
  fm.show(player).then(response => {
    if (response.canceled) return
    buttons[response.selection].handler(player)
    
    if (!game.getFeature(buttons[response.selection].id)) return player.sendMessage("§cFitur Dinonaktifkan oleh administrator!")
  })
}