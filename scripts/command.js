import { world } from "@minecraft/world"
import config from "./config"

export default class Command {
  static commands = []

  static register(info, callback) {
    this.command = {
      name: info.name,
      description: info.description || "Default description",
      permission: info.permission || false,
      admin: info.admin || false,
      callback
    }
    
    commands.push(command)
  }
}

Command.register({
  name: "help",
  description: "This is the command that give you list of command you can use"
}, (player, args) => {
  let text = `§a//==== §eList of Commands §a====//`
  for (let command of Command.commands) {
    if ((!command.permission || player.hasTag("perm:" + command.permission)) || (!command.admin && !player.hasTag("admin"))) text += `§b# §e${config.prefix}${command.name} §a|§7 ${command.description}`
  }
  player.sendMessage(text)
  player.playSound("note.pling")
})

world.beforeEvents.chatSend.subscribe(v => {
  const commands = Command.commands
  if (v.message.startsWith(config.prefix)) {
    v.cancel = true
    const args = v.message.split(" ")
    const cmd = args.shift()
    const command = commands.find(f => f.name == cmd)
    if (!command) return v.sender.sendMessage("§cInvalid command!")
    if ((command.permission && !v.sender.hasTag("perm:" + command.permission)) || (command.admin && !v.sender.hasTag("admin"))) return v.sender.sendMessage(`§cYou don't have permission to use: ${cmd}`)
    command.callback(v.sender, args)
  }
})