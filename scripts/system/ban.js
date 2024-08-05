import * as ui from "@minecraft/server-ui"
import DB from "../lib/Database"

export function ban(player) {
  const players = world.getAllPlayers()
  const operations = players.map(f => f.name)
  new ui.ModalFormData()
  .title("Banned Form")
  .dropdown('Input player name', operations)
  .textField("§cFill Temporary", "Ex: 24 (in hours)")
  .textField("Reason", "Ex: Cheating")
  .show(player).then((res) => {
    let banPlayers = DB.get("bannedPlayer") ?? []
    let target = players.find(f => f.name == operations[res.formValues[0]])
    if (!target) return player.sendMessage('§cTarget tidak ditemukan!')
    banPlayers.push({
      id: target.id,
      name: target.name,
      time: Date.now() + (res.formValues[1] * 1000),
      reason: res.formValues[0]
    })
    DB.set("bannedPlayer", banPlayers)
    player.sendMessage(`§aSuccefully banned ${target.name}!`)
  })
}

export function unBan(player) {
  let banPlayers = DB.get("bannedPlayer")
  if (banPlayers.length < 1) return player.sendMessage("§cCurrently there is no banned player")
  const operations = banPlayers.map(f => f.name)
  const ids = banPlayers.map(f => f.id)
  new ui.ModalFormData()
  .title("Banned Form")
  .dropdown('Input player name', operations)
  .show(player).then((res) => {
    let target = operations[res.formValues[0]]
    let targetId = ids[res.formValues[0]]
    if (!target) return player.sendMessage('§cTarget tidak ditemukan!')
    banPlayers = banPlayers.filter(f => f.id !== targetId)
    DB.set("bannedPlayer", banPlayers)
    player.sendMessage(`§aSuccefully unanned ${target}!`)
  })
}

export function banned(player) {
  const banPlayer = DB.get("bannedPlayer")?.find(f => f.id == player.id) ?? {}
  const cooldown = banPlayer.time ?? 0
  const reason = banPlayer.reason ?? "No reason provided"
  const secondsRemaining = Math.ceil((cooldown - Date.now()) / 1000)
  const hours = Math.floor(secondsRemaining / 3600)
  const minutes = Math.floor((secondsRemaining % 3600) / 60)
  const seconds = secondsRemaining % 60
  const ui = new ActionFormData()
  ui.title('§cYou Are Banned!')
  ui.body(`§cOuhhh, it seems you are already banned with reason: §g${reason}\n\n§cPlease wait until §f${hours}§ch§f ${minutes}§cm§f ${seconds}§cs§f`)
  ui.button('§l§cExit\n§r§0Click')
  ui.show(player).then((res) => {
    if (res.selection === 0) {
      world.getDimension("overworld").runCommandAsync(`kick ${player.name} ${reason}`)
    }
  })
}