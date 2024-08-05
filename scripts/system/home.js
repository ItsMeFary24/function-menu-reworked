import * as ui from '@minecraft/server-ui'
import { posToString, tp } from "../lib/game"
import { DB } from "../lib/Database"

export function HomeSystem(player) {
  const homes = getHomes(player)
  const form = new ui.ActionFormData()
  .title("Home System")
  .body("Home Settings, Rumah mu sekarang ada: " + homes.length)
  .button('Create Home', 'textures/ui/color_plus.png')
  .button('Remove Home', 'textures/ui/icon_trash.png')
  homes.forEach(v => form.button(`§1${v.name}§r§9${posToString(v.pos, true)}`))
  form.show(player).then(async res => {
    if (res.canceled) return
    if (res.selection == 0) return addHome(player)
    if (res.selection == 1) return removeHome(player)
    
    const selHome = homes[res.selection]
    await tp(player, selHome.pos, selHome.name, selHome.dimension)
  })
}

function addHome(player) {
  let homes = getHomes(player)
  new ui.ModalFormData()
  .title("Create Home")
  .textField("Enter the name home:", "Ex: My Home")
  .show(player).then(res => {
    if (res.canceled || !res.formValues[0]) return
    
    if (res.formValues[0].trim() == "") return player.sendMessage("§cYou need to fill up the name section")
    
    homes.push({
      name: res.formValues[0],
      dimension: player.dimension.id.slice(10),
      pos: posToCenter(player.location)
    })
    
    DB.set("home:" + player.id, homes)
    player.sendMessage(`§aSuccesfully creating new home with mame ${res.formValues[0]}`)
  })
}

function removeHome(player) {
  let homes = getHomes(player)
  if (homes.length < 1) return player.sendMessage("§cYou haven't create any home yet")
  let form = new ui.ActionFormData()
  .title("Remove Home")
  homes.forEach(v => fm.button(`§1${v.name}§r§9${posToString(v.pos)}`))
  form.show(player).then(res => {
    if (res.canceled) return
    
    const selHome = homes[res.selection]
    homes = homes.filter(f => f.name !== selHome.name)
    DB.set("home:" + player.id, homes)
  })
}

function getHomes(player) {
  return DB.get("home:" + player.id)
}