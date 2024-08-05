import { world, system } from "@minecraft/server"
import { rank_prefix, default_rank } from "../config.js";
import { ServerSetDB } from "../databaseSave"
import { DB } from "./Database"
import { buttons } from "../mainMenu/buttons"

let settingData = {
  prefix: ServerSetDB.get("keyset")?.prefix ?? ",",
};

export async function tp(player, pos, name, dimension = "overworld") {
  const dis = player.onScreenDisplay
  const cam = player.camera
  cam.clear()
  dis.serHudVisibility(0)
  dis.setTitle("§aTeleporting...", { stayDuration: 100, fadeInDuration: 2, fadeOutDuration: 4, subtitle: `§eTo ${name}`})
  cam.fade({ fadeInTime: 0.5, holdTime: 2.5, fadeOutTime: 0.5, color: { r: 0, g: 0, b: 0}})
  await sleep(30)
  player.teleport(pos, { dimension: world.getDimension(dimension) })
  await sleep(30)
  dis.setTitle("§aTeleported", { subtitle: `§eTo ${v.name}`})
  dis.setHudVisibility(1)
  player.playSound("random.levelup")
}

export function posToString(pos, colored = false) {
  if (colored) return `§c${pos.x} §a${pos.y} §b${pos.z}`
  return `${pos.x} ${pos.y} ${pos.z}`
}

export function posToCenter(pos) {
  return { x: pos.x.toFixed(0) + 0.5, y: pos.y.toFixed(0), z: pos.z.toFixed(0) + 0.5, }
}

export const getFeature = (name) => {
  return getFeatures()[name]
}

export function getFeatures() {
  let defaultFeature = {}
  buttons.forEach((v) => {
    defaultFeature[v.id] = true
  })
  let features = DB.get("features")
  if (!features) {
    features = defaultFeature
    DB.set("features", features)
  }
  return features
}

export function getPrefix() {
  return settingData.prefix;
}

export function setPrefix(newPrefix) {
  settingData.prefix = newPrefix;
  return ServerSetDB.set("keyset", settingData);
}

export async function sleep(tick) {
  try {
  return new Promise((resolve, reject) => {
    system.runTimeout(resolve, tick);
  });
  } catch (err) {
  console.warn(err, err.stack);
  }
}

export function getScore(target, objective) {
  return world.scoreboard.getObjective(objective)?.getScore(target.scoreboardIdentity)
}

export function setScore(participant, objectiveId, score) {
  world.scoreboard.getObjective(objectiveId)?.setScore(participant.scoreboardIdentity, score)
}

export async function ForceOpen(player, form) {
	while (true) {
		const response = await form.show(player);
		if (response.cancelationReason !== "UserBusy") return response;
	}
}

export function metricNumbers(value) {
  const types = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
  const selectType = (Math.log10(value) / 3) | 0;

  if (selectType == 0) return value;
  let scaled = value / Math.pow(10, selectType * 3);

  return scaled.toFixed(1) + types[selectType];
}

export function thousandsSeparator(value) {
  if (typeof value !== "number") return
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getRank(player) {
  for (let tag of player.getTags()) {
    if (tag.startsWith(rank_prefix)) {
      return tag.substring(rank_prefix.length);
    }
  }
  return default_rank;
}

export function getProgress(progress, size) {
  const fixedSize = 20;
  let percentage = ((progress / size) * 100).toFixed(2);

  percentage = Math.min(percentage, 100);

  const progressChars = Math.min(Math.ceil((percentage / 100) * fixedSize), fixedSize);

  return `§7[${"§a|".repeat(progressChars)}${"§7|".repeat(fixedSize - progressChars)}] §b${percentage} %`;
}

export function callback(tag, callback) {
  for (let player of world.getPlayers()) {
    player.addTag(tag)
    if (player.hasTag(tag)) {
      callback(player);
      player.removeTag(tag);
    }
  }
}

export function tagback(tag, callback) {
  for (let player of world.getPlayers()) {
    if (player.hasTag(tag)) {
      callback(player);
      player.removeTag(tag);
    }
  }
}

export function commasNumbers(number) {
try {
const selectType = (Math.log10(number) / 3) | 0;
if (selectType == 0) return number;
return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
} catch {
return number
}
}