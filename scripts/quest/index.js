import { world, system, Player } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { MessageFormData } from "@minecraft/server-ui"
import "./quest";  
import { prefix } from "../config.js";
import { getProgress, getScore } from "../lib/game"

export const blocks = [
  { name: 'dirt', reward: 100, target: 100 },
  { name: 'coal_ore', reward: 500, target: 50 },
  { name: 'iron_ore', reward: 1000, target: 50 },
  { name: 'stone', reward: 250, target: 200 },
  { name: 'log', reward: 180, target: 50 }
]

world.afterEvents.playerSpawn.subscribe(v => {if (v.initialSpawn) randomizeQuest(v.player)})

system.runInterval(() => {
  for (let player of world.getPlayers()) {
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
  const ui = new ActionFormData();
  let playerQuest = player.getTags().find((tag) => tag.startsWith('quest:')).substring(6)

  let progressObj = playerQuest.toLowerCase() ?? '§cBelum ada quest'
  let progressQuest = getScore(player, progressObj) , questMessage =  `§7Hai §g${player.name}\n\n§rQuest anda saat ini adalah:\n`, targetAmount
  
  if (playerQuest) {
    questMessage += ` Break ${blocks[playerQuest].target}x ${playerQuest}§r`
    targetAmount = blocks[playerQuest].target
   
  } else {
    questMessage += ' Tidak ada quest saat ini';
    targetAmount = 0;
  }

  ui.title('Your quest Now')
  ui.body(`${questMessage}\n\nProgress: ${getProgress(progressQuest, targetAmount)}`)
  ui.button('Close')
  ui.show(player).then(result => {
    if (result.selection === 0) {
     player.playSound('note.pling')
    }
  }); 
}