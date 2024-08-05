import { world, system } from "@minecraft/server"
import * as ban from "./system/ban"
import * as game from "./lib/game"
import DB from "./lib/Database"
import config from "./config"
import "./mainMenu/admin.js"
import "./mainMenu/players.js"
import "./mainMenu/buttons.js"
import "./command"

//Sys-tem Import\\
import "./system/lag.js"
import "./land/system.js"
import "./system/sit.js"
import "./lb.js"

//systemNPC import\\
import "./system/csn.js"
import "./system/rules.js"
import "./system/review.js"


//@ Set NameTag ke custom\\
system.runInterval(() => {
    for (let player of world.getPlayers()) {
        const banned = ban.isBanned(player.id) ? "§4§lBANNED!" + '\n' : '';
        const recentMessage = (DB.get("rm:" + player.name) ?? '');
        const ping = game.getScore(player, 'ping');
        const playerHealth = player.getComponent("minecraft:health").currentValue.toFixed(0);

        player.nameTag = `${banned} ${recentMessage} §7[ §r${getRank(player)}§7 ]§r §f${player.name}\n§c${playerHealth}/20`;
    }
});

world.beforeEvents.chatSend.subscribe(data => {
    const { message, sender } = data;
    data.cancel = true;
    if (bubbleChat) {
    const truncatedMessage = message.substring(0, 50);
    DB.set("rm:" + sender.name, truncatedMessage + '\n');
    system.runTimeout(() => {
        DB.set("rm:" + sender.name);
    }, 100);
   } else return;
});


// @ Class CooldownCommand untuk menghindari spam
class CommandCooldown {
  constructor() {
    this.cooldowns = new Map();
    this.defaultCooldown = config.chatCD * 1000;
  }

  setCooldown(playerId, cooldownTime = this.defaultCooldown) {
    const expireTime = Date.now() + cooldownTime;
    this.cooldowns.set(playerId, expireTime);
  }

  isOnCooldown(playerId) {
    const expireTime = this.cooldowns.get(playerId);
    if (!expireTime) return false;
    if (Date.now() > expireTime) {
      this.cooldowns.delete(playerId);
      return false;
    }
    return true;
  }

  getCooldownTime(playerId) {
    const expireTime = this.cooldowns.get(playerId);
    if (!expireTime) return 0;
    return expireTime - Date.now();
  }

  clearCooldown(playerId) {
    this.cooldowns.delete(playerId);
  }
}

const commandCooldown = new CommandCooldown()


// @ Chat Event untuk trigger command dan chat rank \\
world.beforeEvents.chatSend.subscribe(data => {
    const playerId = data.sender.id;
    if (commandCooldown.isOnCooldown(playerId)) {
      data.cancel = true;
      const remainingTime = commandCooldown.getCooldownTime(playerId);
      data.sender.sendMessage(`§cPlease wait §g${remainingTime / 1000} §cseconds before sending another message.`);
      return;
    }

    data.cancel = true;

    let clan =
        data.sender
          .getTags()
          .find((tag) => tag.startsWith('clan:'))
          ?.substring(5) ?? ``;
    
    const format = chatFormat
        .replace("%level%", getLevel(data.sender))
        .replace("%title%", getRank(data.sender))
        .replace("%player%", data.sender.name)
        .replace("%msg%", data.message)
        .replace("%clan%", clan);

  commandCooldown.setCooldown(playerId);
  world.sendMessage(format);
})

export function getLevel(player) {
  const level = player.level
  const colors = {
    0: "§f",
    5: "§7",
    10: "§8",
    15: "§e",
    20: "§6",
    30: "§b",
    40: "§d",
    50: "§5",
    60: "§a",
    70: "§2",
    80: "§c",
    90: "§9",
    100: "§1",
    120: "§4",
    140: "§3",
    160: "§0",
    180: "§l§f",
    200: "§l§7",
    220: "§l§8",
    240: "§l§e",
    260: "§l§6",
    280: "§l§b",
    300: "§l§d",
    325: "§l§5",
    350: "§l§a",
    400: "§l§2",
    450: "§l§c",
    500: "§l§9",
    550: "§l§1",
    600: "§l§4",
    750: "§l§3",
    800: "§l§0",
    850: "§o§f",
    900: "§o§7",
    950: "§o§8",
    1000: "§o§e",
    1050: "§o§6",
    1125: "§o§b",
    1200: "§o§d",
    1275: "§o§5",
    1350: "§o§a",
    1425: "§o§2",
    1500: "§o§c",
    1600: "§o§9",
    1700: "§o§1",
    1800: "§o§4",
    1900: "§o§3",
    2000: "§o§0"
  }

  return `${colors[level] ?? "§o§0"}${level}`;
}
