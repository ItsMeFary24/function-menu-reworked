import { system } from "@minecraft/server" 
import { ActionFormData, ModalFormData, MessageFormData } from '@minecraft/server-ui'
import { tagback, tp } from "../lib/game"
import { DB } from "../lib/Database"

system.runInterval(() => tagback('warp', Warp))
export function warp(player){
  let warps = DB.get("warps")

  let form = new ActionFormData()
  .title("§l§bWarp§fUI")
  .body(`§l§a➜ §bSilahkan pilih tujuan anda!`)
  warps.forEch((v) => form.button(`§b§l${v.name}\n§rClick to teleport`, "textures/ui/sidebar_icons/realms"))

  form.button("§l§cEXIT","textures/ui/cancel")
  form.show(player).then(res => {
    if (res.canceled) return
    
    const selWarp = warps[res.selection]
    tp(player, selWarp.pos, selWarp.name, selWarp.dimension)
  })
}

export function warpSetting(player) {
  new ActionFormData()
  .title("§lWarp Settings")
  .body("Select Warp")
  .button("§lADD WARP\n§rClick To Add", "textures/ui/color_plus")
  .button("§lREMOVE WARP\n§rClick To Remove", "textures/ui/trash.png")
  .show(player).then(res => {
    if (res.canceled) return
    if (res.selection == 0) addWarp(player)
    if (res.selection == 1) removeWarp(player)
  })
}

function addWarp(player) {
  let warps = DB.get("warps") ?? []
  let dimensions = [ "overworld", "nether", "the_end" ]
  new ModalFormData()
  .title("§lADD WARP")
  .textField("Name", "(Required, String)")
  .dropdown("Dimension", dimensions)
  .show(player).then(res => {
    if (res.isCanceled || !res.formValues[0]) return

    if (!dimensions.includes(player.dimension.id.slice(10))) return player.sendMessage(`§7The Dimension must be one of these: "overworld", "nether", "the_end"!§r`)

    warps.push({
      name: res.formValues[0],
      dimension: dimensions[res.formValues[1]],
      pos: { x: player.location.x.toFixed(0) + 0.5, y: player.location.y.toFixed(0), z: player.location.z.toFixed(0) + 0.5 }
    })

    DB.set("warps", warps)
    player.sendMessage(`§l§2➜ §r§a§lSUCCESS!\n§r§7added to warp list!`)
  })
}

function removeWarp(player) {
  let warps = DB.get("warps") ?? []
  if (warps.length < 1) return player.sendMessage("§cThere is no warps")
  let form = new ActionFormData().title("§lDELETED WARP")
  warps.forEach((v) => form.button(`§r${v.name}§r\n §c${v.pos.x} §a${v.pos.y} §b${v.pos.z}§r | §r§2${v.dimension?.replace(/_/g, " ")}`))
  form.show(player).then(res => {
    if (res.canceled) return
    let selWarp = warps[res.selection]
    new MessageFormData()
    .title(`§lREMOVE WARP`)
    .body(`§r§cAre you sure that you want to delete this Warp for ever?§r\n§8Name: §7${selWarp.name}\n§8X: §7${selWarp.pos.x}\n§8Y: §7${selWarp.pos.y}\n§8Z: §7${selWarp.pos.z}\n§8Dimension: §7${selWarp.dimension}`)
    .button1("§aYES")
    .button2("§cNO")
    .show(player).then(re => {
      if (re.selection == 0) {
      warps.filter(f => f.name !== selWarp.name)
      DB.set("warps", warps)
      return player.sendMessage(`§l§4➜ §r§c§lDELETED!\n§r§7Go has been deleted!`)
      } else {
        return player.sendMessage(`§cNot deleted warp "${warps.name}"!§r`)
      }
    })
  })
}