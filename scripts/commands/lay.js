import Command from "../command"

Command.register({
    name: "lay",
    description: "Make your character lay to ground"
  }, (player, args) => {
    if (!player.hasTag("lay")) return player.addTag("lay")
    player.removeTag("lay")
  }
)

Command.register({
    name: "sit",
    description: "Make your character sit"
  }, (player, args) => {
    if (!player.hasTag("sit")) return player.addTag("sit")
    player.removeTag("sit")
  }
)

