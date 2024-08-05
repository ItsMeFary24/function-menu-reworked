import { system } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"
import { tagback } from "../lib/game"
import { DB } from "../lib/Database"

system.runInterval(() => tagback('code', redeemCode))

export function redeem(player) {
   new ActionFormData()
  .title('RedeemCode')
  .button('Set Code', 'textures/ui/icon_book_writable')
  .button('Log of Codes', 'textures/ui/Feedback')
  .show(player).then(res => {
    if (res.selection === 0) cmdAmountMenu(player)
    if (res.selection === 1) logCode(player)
  })
}

function cmdAmountMenu(player) {
  new ModalFormData()
    .title("Command Amount UI")
    .slider("Amount of commands to run when player inputs the code: ", 1, 20, 1)
    .show(player).then(res => {
      if (!res.canceled) setCode(player, res.formValues[0])
    })
}

function setCode(player, amount) {
  const form = new ModalFormData()
  .title("§cSetCode - §bAdmin")
  .textField("3 - 12 characters", "Example: nakata")
  for (let i = 0; i < amount; i++) form.textField("Command:", `command ke ${amount}`)
  form.textField("User Can Entry", "Example: 50")
  form.show(player).then(res => {
    const code = res.formValues[0]
    const commands = res.formValues.slice(1, -1)
    const maxClaims = parseInt(res.formValues[res.formValues.length - 1])

    if (code.length > 12 || code.length < 3) return player.sendMessage(`§cCode can't be less than 3 or more than 12 character`)
    
    if (isNaN(maxPlayers) || maxClaims < 1) return player.sendMessage("§cPlease enter valid positive number")

    const redeemData = {
      name: code,
      commands,
      maxClaims,
      claimers: []
    }

    DB.set("redeem:" + code, redeemData)
    player.sendMessage("§aSet redeem code to " + code)
  })
}

export function redeemCode(player) {
  new ModalFormData()
  .title("§eRedeemCode")
  .textField('Code', "Enter Code")
  .show(player).then(res => {
    const code = res.formValues[0]
    let data = DB.get("redeem:" + code)
    if (data && data.name == code) {
      const playerId = player.id
      if (!data.claimers.includes(playerId)) {
        if (data.claimers.length >= data.maxClaims) return player.sendMessage("§cMaximum number of players have already redeemed the code.")

        data.claimers.push(playerId)
        DB.set("redeem:" + code, data)
        data.commands.forEach(v => player.runCommandAsync(v))
        player.sendMessage("§aSuccess claim code!")
      } else {
        player.sendMessage("§cYou have already redeemed the code")
        player.playSound("note.pling")
      }
    } else {
      player.sendMessage('§cInvalid Code! Maybe it has expired')
      player.playSound("note.pling")
    }
  })
}

function logCode(player) {
  const codes = DB.keys().filter(f => f.startsWith("redeem:"))
  if (codes.length < 1) return player.sendMessage("§cThere is no code")
  let text = "§a//===§eList of Used Codes §a===//\n\n"
  for (let code of codes) {
    let data = DB.get(code)
    text += `§b# §eCode:§7 ${data.name}\n§b# §eMax Used: §7${data.maxClaims}\n§b# §eUsed for: §7${data.claimers.length}times\n\n`
  }
  player.sendMessage(text)
}
