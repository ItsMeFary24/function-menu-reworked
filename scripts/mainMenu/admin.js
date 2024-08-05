import { world, system } from "@minecraft/server"
import { ModalFormData, ActionFormData } from "@minecraft/server-ui"
import { buttons } from "./buttons"
import * as code from "../system/code"
import * as report from "../system/report"
import * as npc from "../system/npc"
import { textEditor } from "../functions/floating/index"
import DB from "../lib/Database"
import * as util from "../lib/game"
import * as spawn from "../system/spawn"
import * as warp from "../system/warp"
import * as ban from "../system/ban"

export function adminMenu(player) {
  new ActionFormData()   
  .title('Simple | Admin menu')
  .button('Set Lobby', 'textures/ui/icon_deals')
  .button('Enable Disable', 'textures/ui/toggle_on')
  .button('Set Ranks', 'textures/ui/mashup_world')
  .button('Ban Players', 'textures/ui/hammer_r')
  .button('UnBan Players', 'textures/ui/hammer_r')
  .button('Warp Settings', 'textures/ui/world_glyph_color_2x_black_outline')
  .button('Redeem Code', 'textures/ui/icon_book_writable')
  .button('Get Reports', 'textures/ui/Feedback')
  .button('Spawn Npc', 'textures/ui/icon_deals')
  .button('Edit Leaderboard', 'textures/items/diamond_sword')
  .show(player).then(res => {  
    if (res.selection === 0) spawn.setSpawn(player)
    if (res.selection === 1) enable(player)
    if (res.selection === 2) ChangeRank(player)    
    if (res.selection === 3) ban.ban(player)
    if (res.selection === 4) ban.unBan(player)
    if (res.selection === 5) warp.warpSetting(player)  
    if (res.selection === 6) code.redeem(player)
    if (res.selection === 7) report.get(player)    
    if (res.selection === 8) npc.spawn(player)
    if (res.selection === 9) textEditor(player)
  })
}

//Settings ajh
function enable(player) {
  let features = util.getFeatures()
  const ui = new ModalFormData()
  .title("Enabled")
  buttons.forEach((v) => ui.toggle(v.display, features[v.id] ?? true))
  ui.show(player).then(res => {
    if (res.canceled) return
    res.formValues.forEach((v, i) => features[buttons[i].id] = v)
    DB.set("features", features)
  })
}


system.runInterval(() => {
  for (let player of world.getPlayers()) {
    const banPlayer = DB.get("bannedPlayer")?.find(f => f.id == player.id) ?? {}
    const cooldown = banPlayer.time ?? 0

    if (cooldown > Date.now()) {
      const secondsRemaining = Math.ceil((cooldown - Date.now()) / 1000)
      system.run(a => ban.banned(player))
      player.runCommandAsync('ability @s mute true')
      const opt = { amplifier: 255, showParticles: false }
      player.addEffect('blindness', secondsRemaining, opt)
      player.addEffect('slowness', secondsRemaining, opt)
      player.addEffect('resistance', secondsRemaining, opt)
    } else {
      let banPlayers = DB.get("bannedPlayer")?.filter(f => f.id !== player.id)
      player.runCommandAsync('ability @s mute false')
      DB.set("bannedPlayer", banPlayers)
    }
  }
}, 10)
