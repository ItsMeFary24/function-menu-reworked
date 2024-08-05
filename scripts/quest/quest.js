import { world, system, Player } from "@minecraft/server"
import { setScore, getScore, getProgress } from "../lib/game.js";
import { blocks } from "./index"

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function reward(player, name, reward = 0) {
  const money = getScore(player, "money")
  const dim = player.dimension
  const dis = player.onScreenDisplay
  setScore(player, "money", money + reward)
  dim.spawnEntity("fireworks_rocket", player.location)
  dim.spawnParticle("minecraft:knockback_roar_particle", player.location)
  player.playSound("random.explode")
  player.addEffect("blindness", 120, { amplifier: 3, showParticle: false })
  player.addEffect("slowness", 60, { amplifier: 2, showParticle: false })
  dis.setTitle({
    text: "e§lCONGRATS",
    subtitle: "§7Kamu telah menyelesaikan quest"
  })
  dis.setActionBar(`§e+${reward} Money`)
  player.sendMessage("§8[§e Quest§8 ] §fKamu berhasil §emenyelsaikan §fquest !")
  setScore(player, name, 0)
  player.removeTag("quest:" + name)
  player.removeTag("adaquest")
  player.addTag("newquest")
}

world.afterEvents.playerBreakBlock.subscribe(v => {
  const player = v.player
  const block = v.brokenBlockPermutation
  if (blocks.find(f => f.name.includes(block.typeId))) {
    const selBlock = blocks.find(f => f.name.includes(block.typeId))
    let progress = getScore(player, selBlock)
    setScore(player, selBlock, progress + 1)
    player.onScreenDisplay.setActionBar(`§eQuest §7Progress §8: ${getProgress(progress, 50)}`)
    
    if (progress >= selBlock.target) reward(player, selBlock.name, selBlock.reward)
  }
})