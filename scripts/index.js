import { world, system } from "@minecraft/server"
import { getScore, getRank } from "./lib/game.js";
import "./mainMenu/admin.js";
import "./mainMenu/players.js";
import "./mainMenu/buttons.js";
import { prefix } from "./config.js";

//System Import\\
import "./system/lag.js";
import "./JUSTSKYLAND_NPERMA/system.js";

system.runInterval(v => {
  world.getAllPlayers().forEach((player) => {
    const nickname = player.getTags().find(f => f.startsWith("nick:")).slice(5)[0] ?? player.name
    const health = player.getComponent("health").currentValue.toFixed(0)
    const banned = player.getTags().find(f => f.startsWith("ban:")) ? "§4§lBANNED\n" : ""
    
    player.nameTag = `${banned} §7[ §r${getRank(player)}§7 ]§r §f${nickname}\n§c${playerHealth}`
  })
})

system.run()