import { world, system } from '@minecraft/server'
import { ModalFormData, ActionFormData } from '@minecraft/server-ui'
import { Banned } from '../mainMenu/admin'
import { tagback } from '../lib/game'
import { DB } from "../lib/Database"

system.runInterval(() => tagback("report", report))

export function set(player) {
  const reasons = ["Griefing", "Xray", 'Cheating', "Fly", "Toolbox", 'Bullying', "Toxic"]
  const form = new ModalFormData().title("§eReport Player").dropdown("§ePlayer Name", players.map(f => f.name)).dropdown('§cReason', reasons)
  form.show(player).then(res => {
    if (res.canceled) return
    const target = players[res.formValues[0]]
    const reason = res.formValues[1]

    const reportData = {
      reporter: player.name,
      reportedPlayer: target.name,
      reason: reasons[reason],
      timestamp: Date.now()
    }
    let data = DB.get('report') || []
    data.push(reportData)
    DB.set("report", data)
    player.sendMessage("§aSuccessfully reported player " + target.name + " for reason: " + reasons[reason])
  })
}
export function get(player) {
  const data = DB.get('report') || []
  if (data.length === 0) return player.sendMessage("§cUps, there are no reports at the moment.")

  const form = new ActionFormData().title("Report List")
  .body("§cMungkin ada beberapa orang yang bermasalah, mau kamu apakan dia?")
  .button("Clear All Logs")
  data.forEach(v => form.button(v.reportedPlayer + "\n§c" + v.reason, 'textures/ui/icon_steve'))
  form.show(player).then(res => {
    if (res.selection === 0) {
      DB["delete"]("report")
      player.sendMessage("§cAll reports have been cleared.")
    } else {
      const selData = data[res.selection - 1]
      if (selData) {
        new ActionFormData()
        .title("Actions for " + selData.reportedPlayer)
        .button("§c§lBanned", "textures/ui/hammer_r")
        .show(player).then(r => {
          if (r.selection == 0) Banned(player)
        })
      }
    }
  })
}
world.afterEvents.playerSpawn.subscribe(v => {
  const data = DB.get("report") || []
  if (v.initialSpawn) {
    if (v.player.hasTag("admin")) {
      v.player.sendMessage("Hello §f" + v.player.name + ", today §c" + data.length + " §freports available!")
    }
  }
})