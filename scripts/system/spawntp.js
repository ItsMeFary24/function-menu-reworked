import { tp, posToCenter } from "./lib/game"
import { DB } from "../lib/Database"

export function spawn(player) {
  if (!lobby.has("lobby")) return player.sendMessage("§cAdmin belum set kordinat ke lobby!")
  const data = DB.get("lobby")
  tp(player, data.pos, data.name, data.dimension)
}

export function setSpawn(player) {
  const data = {
    name: "Lobby",
    dimension: player.dimension.id.slice(10),
    pos: posToCenter(player.location)
  }
  DB.set("lobby", data)
  player.sendMessage('§aSuccesfully set lobby teleport')
  player.playSound('note.pling')
}