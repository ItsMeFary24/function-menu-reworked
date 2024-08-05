import { system } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"
import { tagback } from "../lib/game"

system.runInterval(() => tagback("rules", rules))

export function rules(player) {
  const form = new ActionFormData()
  .title(" Rules ")
  .body('§c [  ] Dilarang Toxic!\n [  ] Dilarang Bermain Keras\n [  ] Dilarang Toolbox\n [  ] Dilarang Mencuri\n [  ] Dilarang Grief\n [  ] Dilarang Bullying\n [  ] Dilarang merusak Lobby\n [  ] Dilarang Hack §lNBT§r§c\n [  ] Dilarang membahas 18+ Secara berlebihan\n [  ] Dilarang Membandingkan Server dg server lain\n [  ] Dilarang Bermain Menggunakan Hack Client\n\n [  ] §l§6DILARANG MELAKUKAN SEMUA ITU JIKA ANDA TIDAK INGIN DI BANNED DARI SERVER!!\n §r§7§oJika Anda Di Ketahui Oleh Admin Anda Akan Di Banned Permanen Tanpa Terkecuali!  §r')
  .button('§l§cCLOSE', 'textures/ui/cancel')
  form.show(player).then(result => {
    if (result.selection === 0) {
      player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§aJangan Lupa Patuhi Rules ya ^^, agar owner senang"}]}`)
    }
  })
}
