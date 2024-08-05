import { world } from '@minecraft/server'
import * as ui from '@minecraft/server-ui'

function TpaSystem(player) {
  let form = new ui.ModalFormData()
  let players = world.getPlayers()
  form.title("TPA")
  form.dropdown("Choose who you want to visit", players.map(f => f.name))
  form.toggle("Toggle: off to TPA to the person, on to ask the person to come to you")
  form.show(player).then(res => {
    if (!res) return
    let brick = new ui.MessageFormData()
    let target = players[res.formValues[0]]
    let tpaHere = res.formValues[1]
    if (tpaHere) {
      brick.body("§e§l                              TPA\n§r§e" + player.name + " §fwants you to TPA to them")
    } else {
      brick.body('§e' + player.name + " §fwants to TPA to you")
    }
    brick.button1("Agree")
    brick.button2("Don't Agree")
    player.sendMessage("§e§l➥ §r You sent a message to §e" + target.name)
    brick.show(target).then(r => {
      if (!r || r.selection != 0) {
        player.sendMessage("§c§l➥§r Failed for §cTPA")
        return
      }
      player.sendMessage("§l§a➥ §fYou managed to do the §aTPA")
      if (tpaHere) {
        target.teleport(player.location, {
          'dimension': player.dimension
        })
        target.playSound('random.orb')
        player.playSound("random.orb")
        player.sendMessage("§l§2➜§r §aYou have been teleported!...")
      } else {
        player.teleport(target.location, {
          'dimension': target.dimension
        })
        player.playSound("random.orb")
        target.playSound("random.orb")
        player.sendMessage("§l§2➜§r §aYou have been teleported!...")
      }
    })
  })
}
export { TpaSystem }