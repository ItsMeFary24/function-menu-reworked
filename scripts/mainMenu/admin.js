import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import * as util from "../util"
import data from "./data"
const playerRanks = database.get("playerRanks")
  if (!playerRanks) return database.set("playerRanks", [])
export function main(player) {
  new ActionFormData()
  .title("Simple | Admin menu")
  .button("Set Spawn", "textures/ui/icon_deals")
  .button("Toggle Feature", "textures/ui/toggle_on")
  .button("Set Rank", "textures/ui/mashup_world")
  .button("Ban Players", "textures/ui/hammer_r")
  .button("Warp Settings", "textures/ui/world_glyph_color_2x_black_outline")
  .button("Redeem Code", "textures/ui/icon_book_writable")
  .button("Get Reports", "textures/ui/Feedback")
  .show(player).then(res => {
    if (res.cancelled) return
    
    if (res.selection == 0) setSpawn(player)
    if (res.selection == 1) toggleFeature(player)
    if (res.selection == 2) setRank(player)
    if (res.selection == 3) banPlayer(player)
    if (res.selection == 4) warpMenu(player)
    if (res.selection == 5) redeemCode(player)
    if (res.selection == 6) reports(player)
  })
}

function setSpawn(player) {
  util.lobby.set("spawn", player.location)
  util.succes(player, `Succesfully set the spawn position to your position`)
}

function toggleFeature(player) {
  const features = util.getFeatures()
  const form = new ActionFormData()
  .title("Features")
  data.buttons.forEach((v) => {
    if (features[v.id])
      form.button(`${data.enabledColor}${v.name}\n§r§eTap to Toggle`, v.icon)
    else
      from.button(`${data.disabledColor}${v.name}\n§r§eTap to Toggle`, data.disabledIcon)
  })
  form.show(player).then(res => {
    if (res.cancelled) return
    
    util.succes(player, `Set ${data.buttons[res.selection]} to ${!getFeature(data.buttons[res.selection].id)}}`)
    util.setFeature(data.buttons[res.selection].id, !util.getFeature(data.buttons[res.selection].id))
  })
}

function setRank(player) {
  const players = mc.world.getAllPlayers()
  let form = new ui.ActionFormData()
  .title("Set Rank")
  .body("Select one of the player that you want to set their rank")
  players.forEach((v) => form.button(`${v.name}\nTap to Select}`))
  form.show(player).then(res => {
    if (res.cancelled) return
    
    const selPlayer = players[res.selection]
    form = new ui.ModalFormData()
    .title("Enter the rank name")
    .textField("Name", "the rank name", util.getRank(selPlayer) ?? "")
    .show(player).then(r => {
      if (r.cancelled || !r.formValues[0]) return
      
      if (r.formValues[0] == "") return util.failed(player, "Rank not set because the name is blank")
      util.succes(player, `Set §b${selPlayer.name}'s §arank to §e${res.formValues[0]}`)
      util.setRank(selPlayer, r.formValues[0])
    })
  })
}

function banPlayer(player) {
  const form = ui.ActionFormData()
  .title("Select player")
  
}