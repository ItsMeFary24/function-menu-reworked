import Command from "../command"
import * as quest from" ../system/quest"

Command.register({
    name: "quest",
    description: "Check your quest"
  }, (player, args) => {
    quest.checkQuest(player)
  }
)

