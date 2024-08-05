import { ModalFormData } from "@minecraft/server-ui"

const npcData = [
  "npc:warp",
  "npc:csn",
  "npc:quest",
  "npc:review",
  "npc:report",
  "npc:code",
  "npc:shop",
  "npc:rules",
  "npc:bank",
]

export function spawn(player) {
  new ModalFormData()
  .title('NPC Spawn')
  .dropdown('Choose NPC', npcData)
  .show(player).then(result => {
    if (result.canceled) return player.sendMessage("§7Spawn NPC canceled.")

    const chosenNpc = npcData[result.formValues[0]]

    if (!chosenNpc) return player.sendMessage("§cInvalid NPC selection.")

    try {
      player.runCommandAsync(`summon ${chosenNpc} ${player.location.x} ${player.location.y} ${player.location.z}`)
      player.sendMessage(`§aSummoned ${chosenNpc} successfully.`)
    } catch (error) {
      player.sendMessage(`§cFailed to summon NPC: ${error}`)
    }
  })
}

export function kill(player) {
  new ModalFormData()
  .title('Kill NPC')
  .dropdown('Choose NPC to Kill', npcData)
  .show(player).then(result => {
    if (result.canceled) return player.sendMessage("§7Kill NPC canceled.")

    const chosenNpc = npcData[result.formValues[0]]

    if (!chosenNpc) return player.sendMessage("§cInvalid NPC selection.")

    try {
      player.runCommandAsync(`kill @e[type=${chosenNpc},r=10]`)
      player.sendMessage(`§aKilled ${chosenNpc} successfully.`)
    } catch (error) {
      player.sendMessage(`§cFailed to kill NPC: ${error}`)
    }
  })
}