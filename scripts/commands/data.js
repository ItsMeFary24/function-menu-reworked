import Command from "../command"
import DB from "../lib/Database"

Command.register({
    name: "entries",
    admin: true,
  }, (player, args) => {
    let text = ""
    for (let [key, value] of DB.entries()) {
      text += `${key}: ${value}\n`
    }
    player.sendMessage(text)
  }
)

Command.register({
    name: "get",
    admin: true
  }, (player, args) => {
    player.sendMessage(`${DB.get(args[1])}`)
  }
)

Command.register({
    name: "set",
  }, (player, args) => {
    DB.set(args[1], args[2])
    player.sendMessage(`${DB.get(args[1])}`)
  }
)

Command.register({
    name: "reset",
    admin: true
  }, (player, args) => {
    let text = ""
    for (let [key, value] of DB.entries()) text += `${key}: ${value}\n`
    player.sendMessage(text)
    DB.clear()
  }
)