import { world } from "@minecraft/server"
import { setScore, getScore } from "../lib/game"
import { config } from "./config"

import { Land } from "./function/land"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"

const landPos = {}

export function showLandMenu(player) {

  new ActionFormData()
  .title("Land Management Menu")
  .body("Land Management, CreatorUI : NakataTzy")
  .button("Set Start Position", "textures/ui/color_plus.png")
  .button("Set End Position", "textures/ui/saleribbon.png")
  .button("Buy Land", "textures/ui/MCoin.png")
  .button("List Lands", "textures/ui/subscription_glyph_color.png")
  .button("Invite Player", "textures/ui/switch_accounts.png")
  .button("Kick Player", "textures/ui/trash.png")
  .button("View Members", "textures/ui/icon_steve.png")
  .button("Sell Land", "textures/ui/MCoin.png")
  .button("Info", "textures/ui/Caution.png")
  .show(player).then((res) => {
    if (res.canceled) return
    
    if (res.selection == 0) setStartPosition(player)
    if (res.selection == 1) setEndPosition(player)
    if (res.selection == 1) buyLand(player)
    if (res.selection == 3) listLands(player)
    if (res.selection == 4) invitePlayer(player)
    if (res.selection == 5) kickPlayer(player)
    if (res.selection == 6) viewMembers(player)
    if (res.selection == 7) sellLand(player)
    if (res.selection == 8) showInfo(player)
    
  })
}

function setStartPosition(player) {
  landPos[player.name] = { ...landPos[player.name],
    start: {
      x: Math.floor(player.location.x),
      z: Math.floor(player.location.z)
    }
  }
  player.sendMessage(`§aSet start pos on coordinate §ex: ${Math.floor(player.location.x)} z: ${Math.floor(player.location.z)}`)
}

function setEndPosition(player) {
  landPos[player.name] = {
    ...landPos[player.name],
    end: {
      x: Math.floor(player.location.x),
      z: Math.floor(player.location.z)
    }
  }
  player.sendMessage(`§aSet end pos on coordinate §ex: ${Math.floor(player.location.x)} z: ${Math.floor(player.location.z)}`)
}

function buyLand(player) {
  if (!landPos[player.name]) return player.sendMessage("§cWrong format, maybe you haven't set the start or end position")

  const { start, end } = landPos[player.name]
  const calculatedSize = Land.calculateLandSize([start.x, start.z], [end.x, end.z])
  const Money = getScore(player, config.ecoScoreboard)

  if (calculatedSize > config.landSizeMax) return player.sendMessage(`§cThe land is too big, limit size is §e${config.landSizeMax}`)

  if (Money < calculatedSize * config.perBlockPrice) {
    const neededMoney = calculatedSize * config.perBlockPrice - Money
    player.sendMessage(`§cYour money is not enough, need ${neededMoney} more money, land price: ${calculatedSize * config.perBlockPrice}`)
    return
  }

    const landResult = Land.createLand(player, [start.x, start.z], [end.x, end.z], Land.generateUUID())

    if (!landResult.created) return player.sendMessage(`§cYour land is overlapping with others land`)
  
  setScore(player, config.ecoScoreboard, Money - calculatedSize * config.perBlockPrice)
  delete landPos[player.name]

  player.sendMessage(`§aSuccess creating new land with id: §e${landResult.landID} §awith price: §e${calculatedSize * config.perBlockPrice}`)
}

function listLands(player) {
  const playerLands = Land.getLands(player)
  if (playerLands.length === 0) returnplayer.sendMessage("§e----- Your lands -----\nNo lands found.")
  const lands = playerLands
  .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
  .map(land => `§f# §7ID: §e${land.landID}\n §e> §7Dimension: §e${land.landDimension.split(":")[1]}\n §e> §7Members: §e${land.invites.join(", ") || "none."}\n §e> §7Created at: §b${land.creationDate || 0}`)
  .join("\n\n")
  player.sendMessage(`§e----- Your lands -----\n${lands}`)
}

function invitePlayer(player) {
  new ModalFormData()
  .title("Invite Player")
  .textField("Land ID", "Enter the land ID")
  .textField("Player Name", "Enter the player name")
  .show(player).then(result => {
    if (result.canceled) return

    const landID = result.formValues[0]
    const playerName = result.formValues[1]

    if (!landID || !playerName) return player.sendMessage("§cYou must enter a valid land ID and player name")

   const targetPlayer = world.getPlayers().find(p => p.name === playerName)
  
    //--------  Invalid Checker --------/
    if (!targetPlayer) return player.sendMessage(`§cPlayer with name ${playerName} not found`)
    if (playerName === player.name) return player.sendMessage("§cYou can't invite yourself")
    if (Land.getLands(player).length === 0) return player.sendMessage("§cYou don't have any claimed lands")
    if (Land.findLand(landID) === undefined) return player.sendMessage(`§cThere is no land with landID §e${landID}`)
    if (Land.checkInvite(landID).includes(playerName)) return player.sendMessage(`§ePlayer with name ${playerName} already has access to your land`)

    const inv = Land.invitePlayer(landID, player.name, playerName)
    if (!inv.status) return player.sendMessage(`§c${inv.error}`)
    targetPlayer.sendMessage(`§a${player.name} has given you access to land ID: §e${landID}`)
    player.sendMessage(`§a${playerName} now has access to your land`)
  })
}

function kickPlayer(player) {
  new ModalFormData()
  .title("Kick Player")
  .textField("Land ID", "Enter the land ID")
  .textField("Player Name", "Enter the player name")

  .show(player).then(result => {
    if (result.canceled) return

    const landID = result.formValues[0]
    const playerName = result.formValues[1]

    if (!landID || !playerName) returnplayer.sendMessage("§cYou must enter a valid land ID and player name")

    const targetPlayer = world.getPlayers().find(p => p.name === playerName)
    //-------- Invalid Checker --------//
    if (!targetPlayer) return player.sendMessage(`§cPlayer with name ${playerName} not found`)
    if (playerName === player.name) return player.sendMessage("§cYou can't kick yourself")
    if (Land.getLands(player).length === 0) return player.sendMessage("§cYou don't have any claimed lands")
    if (Land.findLand(landID) === undefined) return player.sendMessage(`§cThere is no land with landID §e${landID}`)
    if (!Land.checkInvite(landID).includes(playerName)) return player.sendMessage(`§cPlayer with name ${playerName} does not have access to your land`)

    const rem = Land.removeInvite(landID, player.name, playerName)
    if (!rem.status) return player.sendMessage(`§c${rem.error}`)
    targetPlayer.sendMessage(`§e${player.name} §ckicked you from land ID: ${landID}`)
    player.sendMessage(`§e${playerName} has been kicked from your land`)
  })
}

function viewMembers(player) {
  new ModalFormData()
  .title("View Members")
  .textField("Land ID", "Enter the land ID")
  .show(player).then(result => {
    if (result.canceled) return
    const landID = result.formValues[0]

    if (!landID) return player.sendMessage("§cYou must enter a valid land ID")
    if (Land.getLands(player).length === 0) return player.sendMessage("§cYou don't have any claimed lands")
    if (Land.findLand(landID) === undefined) return player.sendMessage(`§cThere is no land with landID §e${landID}`)

    const lands = Land.findLand(landID)
    player.sendMessage(`§7Member: §a${lands.invites.join(", ") || "No player found"}`)
    })
}

function sellLand(player) {
  new ModalFormData()
  .title("Sell Land")
  .textField("Land ID", "Enter the land ID")
  .show(player).then(result => {
    if (result.canceled) return
    const landID = result.formValues[0]

    if (!landID) return player.sendMessage("§cYou must enter a valid land ID")
    if (Land.getLands(player).length === 0) return player.sendMessage("§cYou don't have any claimed lands")
    if (Land.findLand(landID) === undefined) return player.sendMessage(`§cThere is no land with landID §e${landID}`)

    const { land } = Land.findLand(landID)
    const getPrice = (Land.calculateLandSize([land.start[0], land.start[1]], [land.end[0], land.end[1]]) * config.perBlockPrice) / config.landSellTax
    const Money = getScore(player, config.ecoScoreboard)

    setScore(player, config.ecoScoreboard, Money + getPrice)

    const del = Land.deleteLand(landID, player.name)
    if (!del.deleted) return player.sendMessage(`§c${del.error}`)
    player.sendMessage(`§aSuccessfully sold land with ID: §e${landID} §aand sold for §e${getPrice}§a, tax: §e${config.landSellTax} percent`)
  })
}

function showInfo(player) {
  player.sendMessage(`§7+==================•>\n§6• §2Credit:\n§6• §aCreator: §b§lJustSkyDev\n§6• §aRemake by §bNperma\n§6• §aUI by §aNakata`)
}

export { Land }
