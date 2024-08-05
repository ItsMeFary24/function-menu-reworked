/**
 * Created By ZackMans
 * https://youtube.com/@BuildTheCraft
 * FLOATING TEXT
 * */
import { world, system } from "@minecraft/server";
import { getScore, commasNumbers, getRank } from "./lib/game.js";
import { textEditor } from "./functions/floating/index.js";


world.afterEvents.itemUse.subscribe(({
  itemStack: item,
  source: player
}) => {
  if (item.typeId == "text:editor") {
    if (player.isOp() || player.hasTag("admin")) return textEditor(player) && player.playSound("random.pop", { pitch: 0.4 })
    player.sendMessage(`§cYou are not an operator`)
    player.playSound(`note.bass`)
  }
})

world.afterEvents.entityHitEntity.subscribe(async ({
  hitEntity: entity, damagingEntity: player
}) => {

  if (!entity) return;
  if (entity.typeId.includes("floating_text")) {
    try {
      let hasId = entity.getTags().find(v => v.includes("id:"));
      let datScore = entity.getTags().find(v => v.includes('{"score":{'));
      let hasScore = datScore ? JSON.parse(datScore).score.key : false;
      if (player.isOp() && player.hasTag('admin')) {
        if (hasId) {
          player.sendMessage(`§bid: §7${hasId ? hasId.slice(3) : "§cnot found"}\n§bscore: §7${hasScore ?? "§cnot found"}`);
          player.runCommandAsync(`playsound random.pop @s`);
        } else {
          let getid = "7" + Math.random().toString(36).substr(2, 6);
          entity.addTag(`id:${getid}`);
          player.sendMessage(`§aSuccessfully added ID to FLOATING_TEXT "${getid}"`);
          player.playSound(`random.orb`);
        }
      } else return player.sendMessage('§cMaaf kamu ga ada akses bua edit :(');


    } catch { }
  }

})

let objScore = []
/* LEADERBOARD */
system.runInterval(async() => {
  world.getDimension("overworld").getEntities().forEach(async(entity) => {
    if (entity.typeId.includes("floating_text")) {
      let tagScore = entity.getTags().find(v => v.startsWith('{"score":{'))
      if (tagScore) {
        let data = JSON.parse(tagScore)
        for (let player of world.getPlayers()) {
          let objetKey = objScore.find(v => v.object == data.score.key)
          if (objetKey) {
            let objectKey = objetKey.result
            let isPlayer = objectKey.find(v => v.name.includes(player.name))
            if (isPlayer) {
              let dedf = objectKey.find(i => i.name == player.name)
              let chn = objectKey.indexOf(dedf)
              let Score = getScore(player, data.score.key)
              let sortedLb = objectKey.sort((a, b) => b.score - a.score)
              entity.nameTag = `${data.score.name}\n${
                                sortedLb.slice(0, 10).map((i, eje) => `\n §f${(eje + 1)}. ${i.rank} §e${i.name} §f${commasNumbers(i.score)} `)
                            }`
              if (dedf.score === Score && dedf.rank === getRank(player)) return
              objectKey[chn].score = Score
              objectKey[chn].rank = getRank(player)
            } else {
              let dataNye = {
                name: player.name,
                score: getScore(player, data.score.key),
                rank: getRank(player)
              }
              objectKey.push(dataNye)
            }
          } else {
            let dataNye = {
              object: data.score.key,
              result: [{
                name: player.name,
                score: getScore(player, data.score.key),
                rank: getRank(player)
              }]
            }
            objScore.push(dataNye)
          }
        }
      }
    }
  })
}, 20)

/* FLOATING TEXT */
let currentText = 0;
system.runInterval(async() => {

  world.getDimension("overworld").getEntities().forEach(async(entity) => {
    if (entity.typeId.includes("floating_text")) {
      let tagScore = entity.getTags().find(v => v.startsWith('{"score":{'))
      let tagText = entity.getTags().filter(v => v.startsWith('text:'))
      let line = "\n"

      if (!tagScore) {
        if (tagText) {
          if (tagText.length > 1) {
            for (let kt = 0; kt < tagText.length; kt++) {
              entity.nameTag = `${tagText[(currentText + kt) % tagText.length].slice(5).replaceAll("(line)", line)}`
            }
            currentText = (currentText + 1) % tagText.length
          }
          if (tagText.length == 1) {
            entity.nameTag = `${tagText[0].slice(5).replaceAll("(line)", line)}`
          }
        }
      }

    }
  })
}, 60)