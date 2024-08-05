import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import * as game from "../lib/gane"

export const blocks = [
  { name: 'dirt', reward: 100, target: 100 },
  { name: 'coal_ore', reward: 500, target: 50 },
  { name: 'iron_ore', reward: 1000, target: 50 },
  { name: 'stone', reward: 250, target: 200 },
  { name: 'log', reward: 180, target: 50 }
]

mc.world.afterEvents.playerSpawn.subscribe(v => {if (v.initialSpawn) randomizeQuest(v.player)})

mc.system.runInterval(() => {
  for (let player of mc.world.getPlayers()) {
  if (player.hasTag("newQuest")) player.removeTag("newQuest") && randomizeQuest(player)
  if (player.hasTag("quest")) player.removeTag("quest") && checkQuest(player)
  }
});

function randomizeQuest(player) {
  if (player.hasTag('adaquest')) return
  const randomIndex = Math.floor(Math.random() * blocks.length)
  const selectedBlock = blocks[randomIndex]
  player.addTag("quest:" + selectedBlock)
  player.addTag('adaquest')
  player.sendMessage(`§l§gNEW OBJECTIVE!§r Break ${selectedBlock.target}x ${selectedBlock.name}`)
}

export function checkQuest(player) {
  const form = new ui.ActionFormData();
  let playerQuest = player.getTags().find((tag) => tag.startsWith('quest:')).substring(6)

  let progressObj = playerQuest.toLowerCase() ?? '§cBelum ada quest'
  let progressQuest = game.getScore(player, progressObj) , questMessage =  `§7Hai §g${player.name}\n\n§rQuest anda saat ini adalah:\n`, targetAmount
  
  if (playerQuest) {
    questMessage += ` Break ${blocks[playerQuest].target}x ${playerQuest}§r`
    targetAmount = blocks[playerQuest].target
   
  } else {
    questMessage += ' Tidak ada quest saat ini';
    targetAmount = 0;
  }

  form.title('Your quest Now')
  form.body(`${questMessage}\n\nProgress: ${game.getProgress(progressQuest, targetAmount)}`)
  form.button('Close')
  form.show(player).then(result => {
    if (result.selection === 0) {
     player.playSound('note.pling')
    }
  }); 
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function reward(player, name, reward = 0) {
  const money = game.getScore(player, "money")
  const dim = player.dimension
  const dis = player.onScreenDisplay
  game.setScore(player, "money", money + reward)
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
  game.setScore(player, name, 0)
  player.removeTag("quest:" + name)
  player.removeTag("adaquest")
  player.addTag("newquest")
}

mc.world.afterEvents.playerBreakBlock.subscribe(v => {
  const player = v.player
  const block = v.brokenBlockPermutation
  if (blocks.find(f => f.name.includes(block.typeId))) {
    const selBlock = blocks.find(f => f.name.includes(block.typeId))
    let progress = game.getScore(player, selBlock)
    game.setScore(player, selBlock, progress + 1)
    player.onScreenDisplay.setActionBar(`§eQuest §7Progress §8: ${game.getProgress(progress, 50)}`)
    
    if (progress >= selBlock.target) reward(player, selBlock.name, selBlock.reward)
  }
})