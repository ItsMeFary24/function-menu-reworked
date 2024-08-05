import Command from "../command"
import * as mc from "@minecraft/server"

Command.register({
    name: "menu",
    description: "Gives you the menu's item"
  }, (player, args) => {
    const inv = player.getComponent("inventory").container
    const item = new mc.ItemStack("item:menu", 1)
    item.setLore(["§r§eRight Click or Hold", "§r§eTo open menu"])
    if (inv.emptySlotSize < 1) return player.sendMessage("§cYour inventory full!!")
    inv.addItem(item)
  }
)