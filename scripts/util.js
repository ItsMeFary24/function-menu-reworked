import * as mc from "@minecraft/server"
import * as config from "./config"
import Database from "./database"

const database = new Database("database")

async function sleep(ms) {
  return new Promise((resolve, reject) => mc.system.runTimeout(resolve, tick)).catch(err => console.log(err, err.stack))
}

function success(player, msg) {
  player.sendMessage(`${config.msgPrefix}§a ${msg}`)
}

function failed(player, msg) {
  player.sendMessage(`${config.msgPrefix}§c ${msg}`)
}

function bc(msg) {
  mc.world.sendMessage(`${config.msgBroadcast}§b ${msg}`)
}

function getFeatures() {
  const features = database.get("features") 
  const defaultFeatures = { spawn: true, warp: true, home: true, tpa: true, shop: true, level: true, code: true, report: true, land: true } 
  if (!feature) {
    database.set("features", defaultFeatures)
    return defaultFeatures
  }
  return features
}

function getFeature(name) {
  let features = getFeatures()
  if (features[name] !== null) return features[name]
  return true
}

function setFeature(name, state = true) {
  let features = getFeatures()
  if (features[name]) features[name] = state
  database.set("features", features)
}

function getScore(player, obj) {
  return mc.world.scoreboard.getObjective(obj)?.getScore(player.scoreboarsIdentity) ?? 0
}

function setScore(player, obj, amount) {
  const objective = mc.world.scoreboard.getObjetive(obj)
  if (objective) {
    return objective.setScore(player.scoreboardIdentity, amount)
  }
  return false
}

function getDate(isNumber = false) {
  const date = new Date()
  const days = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][date.getDay()]
  const month = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"][date.getMonth()]
  const numDate = date.getDate()
  
  if (isNumber)
    return `${(numDate < 10 ? "0": "") + numDate}/${(date.getMonth() + 1 < 10 ? "0": 0) + date.getMonth()}/${date.getFullYear()}`
  else
    return `${days} ${month} ${date.getFullYear()}`
}

function getTime(value) {
  let regDM = "ID";
  let date = new Date()
  let utc = date.getTimezoneOffset()
  date.setMinutes(date.getMinutes() + utc)
  let indTime = 7 * 60
  if (regDM === "ID") date.setMinutes(date.getMinutes() + indTime)
  if (value == "s") return date.getSeconds()
  if (value == "m") return date.getMinutes()
  if (value == "h") return date.getHours()
}

function metricNum(value) {
  const types = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
  const selectType = (Math.log10(value) / 3) | 0;
  let scaled = value / Math.pow(10, selectType * 3);
  return (selectType == 0 ? "" : scaled.toFixed(1)) + types[selectType];
}

function posToCenter(pos) {
  return { x: pos.x.toFixed(0) + 0.5, y: pos.y.toFixed(0) + 0.5, z: pos.z.toFixed(0) + 0.5 }
}

function posRounded(pos) {
  return { x: pos.x.toFixed(0), y: pos.y.toFixed(0), z: pos.z.toFixed(0) }
}

function setRank(player, rank) {
  let playerRanks = database.get("playerRanks")
  if (!playerRanks) return database.set("playerRanks", [])
  playerRanks[player.id] = rank
  return database.set("playerRanks", playerRanks)
}

function getRank(player) {
  const playerRanks = database.get("playerRanks")
  if (!playerRanks) return database.set("playerRanks", [])
  return playerRanks[player.id] ?? ""
}

function getBans() {
  const bannedPlayers = database.get("bannedPlayer")

  if (!bannedPlayers) return JSON.parse("[]") && database.set("bannedPlayer", [])
  return bannedPlayers
}

function isBanned(player) {
  const bannedPlayers = database.get("bannedPlayer")
  if (bannedPlayers.includes(player.id))
}

export {
  sleep,
  success,
  failed,
  bc,
  database,
  getFeatures,
  getFeature,
  setFeature,
  getScore,
  setScore,
  getTime,
  metricNum,
  posToCenter,
  posRounded,
  setRank,
  getRank
}