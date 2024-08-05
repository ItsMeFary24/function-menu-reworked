import * as ui from "@minecraft/server-ui"
import config from "../config"

export function set(player) {
  const players = world.getAllPlayers()
  new ui.ModalFormData()
  .title('Change Rank')
  .textField('Input Rank Name', 'Ex: VIP, blank for reset')
  .dropdown('Target', players.map(f => f.name))  
  .show(player).then(res => {
    if (res.canceled) return
    const rank = config.rankPrefix + (res.formValues[0].trim() == "" ? config.defaultRank: res.formValues[0])
    const targetIndex = res.formValues[1]
    const targetPlayer = players[targetIndex]

    targetPlayer.getTags().filter(f => f.startsWith(rank_prefix)).forEach((v) => targetPlayer.removeTag(v))

    targetPlayer.addTag(rank)
    player.sendMessage(`Rank for ${targetPlayer.name} has been updated to ${rank.substring(rankPrefix.length)}`)
  })
}

export function getRank(player) {
  return player.getTags().find(f => f.startsWith(config.rankPrefix).slice(config.rankPrefix.length))
}