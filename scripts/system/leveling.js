import { system, world } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"
import config from "../config"

export function mainLevel(player) {
  const ui = new ActionFormData()
  const level = player.level
  const max = player.totalXpNeededForNextLevel
  const exp = player.xpEarnedAtCurrentLevel
  
  ui.title('Leveling System')
  ui.body(`Level anda saat ini adalah:\n§aLv.${level} (${exp}/${max})\n\n`)
  ui.button('Leaderboard', 'textures/ui/icon_best3')
  ui.button('Close', 'textures/blocks/barrier')
  ui.show(player).then((response) => { 
 if (response.selection === 0) leaderboard(player)
 })
}

function leaderboard(player) {
  const lb = new ActionFormData()
  let players = world.getPlayers()
  lb.title('Level Leaderboard')
  for (let i = 0;i < Math.min(players.length, 10); i++) {
    const playerName = players[i].name
    const playerLevel = players[i].level
    lb.body(`${i + 1}. ${playerName}: §aLv.${playerLevel}\n`)
  }
  lb.button('Back', 'textures/blocks/barrier')
  lb.show(player).then((result) => {
    if (result.cancelled) return leaderboard(player)
    mainLevel(player)
  })
}

export function addXp(player) {
  const randomChance = Math.round(Math.random() * 100) + 1
  if (randomChance <= config.chanceXp) player.addExperience(1)
}

system.runInterval(() => {
  for (let player of world.getPlayers()) {
    const level = player.level
    const max = player.totalXpNeededForNextLevel
    const exp = player.xpEarnedAtCurrentLevel
  
    if (exp >= (max - 2)) {
      player.runCommandAsync(`scoreboard players set @s level ${level+1}`)
      player.sendMessage(config.levelUpMsg.replace("%level%", player.level+1))
      player.playSound('random.levelup')
      player.addExperience(max - exp + 1)

      const specialLevelData = specialLevelMappings[player.level]
      if (!config.specialLevelData) return

      if (specialLevelData) {
        const item = new ItemStack(spesialLevelData, 1)
        player.getComponent("inventory").container.addItem(item)
        player.sendMessage(`>> §aDapat hadiah spesial dari level ${player.level} ${config.spesialLevelData.replace(/_/g, " ")}`)
      }
    }
  }
})

world.afterEvents.playerBreakBlock.subscribe(v => addXp(v.player))

world.afterEvents.playerPlaceBlock.subscribe(v => addXp(v.player))

world.afterEvents.chatSend.subscribe(v => addXp(v.sender))