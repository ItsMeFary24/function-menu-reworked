import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"

export function textEditor(player) {
  let entityObjects = mc.world.getDimension(player.dimension.id).getEntities().filter(f => f.typeId.includes("floating_text"))
  let operations = DB.keys().filter(f => f == entityObjects.id)
  new ui.ModalFormData()
  .title(`FTEXT EDITOR`)
  .dropdown("Select one of the FLOATING_TEXT with the ID below to edit", operations)
  .show(player).then(async(res) => {
    if (res.canceled) return
    let target = entityObjects[res.formValues[0]]
    if (target) editorMenu(player, target)
  })
}

async function editorMenu(player, target) {
  let data = DB.get(target.id), title = data.texts, id = data.id, score = data.scoreId

  new ui.ActionFormData()
  .title(`FTEXT EDITOR`)
  .body(`§c${Math.floor(target.location.x)} ${Math.floor(target.location.y)} ${Math.floor(target.location.z)}\n§bid: §7${id ?? "§cnot found"}\n§bscore: §7${score ?? "§cnot found"}\n§btext: §7${title ?? "§cnot found"}`)
  .button("Leaderboard\n§r§oClick To Open")
  .button("Text Change\n§r§oClick To Open")
  .button("Teleport Coordinate\n§r§oClick To Open")
  .show(player).then(async(result) => {
    if (result.selection == 0) scoreEditor(player, target)
    if (result.selection == 1) tcEditor(player, target)
    if (result.selection == 2) tpCoordinate(player, target)
  })
}

function scoreEditor(player, target) {
  new ui.MessageFormData()
  .title(`FTEXT EDITOR`)
  .body(`Select setup leaderboard or delete leaderboard`)
  .button1(`setup`)
  .button2(`remove`)
  .show(player).then(async(result) => {
    if (result.canceled) return
    if (result.selection == 0) setupScore(player, target)
    if (result.selection == 1) rmScore(player, target)
  })
}

async function setupScore(player, target) {
  let tagScore = target.getTags().find(v => v.startsWith('{"score":{'))
  new ui.ModalFormData()
  .title(`FTEXT EDITOR`)
  .textField(`§cEnter the name key of scoreboard`, `Enter scoreboard name`)
  .textField(`§cEnter a title for the leaderboard`, `Enter leaderboard name`)
  .show(player).then(async(res) => {
    if (res.canceled) return
    let keyScore = res.formValues[0]
    let nameScore = res.formValues[1]
    let object = mc.world.scoreboard.getObjective(keyScore)
    if (!object) return player.sendui.Message(`§c${keyScore} scoreboard does not exist`) || player.playSound("note.bass")

    let data = JSON.parse(tagScore)
    if (keyScore && nameScore) {
      if (keyScore.includes(" ") || nameScore.length > 28) return player.sendui.Message("tes")
      let dataScore = { score: { key: keyScore, name: nameScore }}
      if (tagScore) await target.removeTag(JSON.stringify(data))
      await target.addTag(JSON.stringify(dataScore))
    }
  })
}

async function rmScore(player, target) {
  let tagScore = target.getTags().find(v => v.startsWith('{"score":{'))
  if (tagScore) {
    let data = JSON.parse(tagScore)
    target.removeTag(JSON.stringify(data))
    player.sendui.Message(`§aSuccessfully cleared the ${data.score.key} leaderboard`)
  } else {
    player.sendui.Message("§cThere is no leaderboard that can be deleted")
    player.playSound("note.bass")
  }
}

function tcEditor(player, target) {
  new ui.MessageFormData()
  .title(`FTEXT EDITOR`)
  .body(`Select setup`)
  .button1(`change/add`)
  .button2(`remove`)
  .show(player).then(async(result) => {
    if (result.canceled) return
    if (result.selection == 0) textEdit(player, target)
    if (result.selection == 1) removeText(player, target)
  })
}

function textEdit(player, target) {
  let getText = target.getTags().filter(v => v.includes("text:"))
  new ui.ModalFormData()
  .title(`FTEXT EDITOR`)
  .slider(`FLOATING_TEXT already has ${getText.length} text, how many text do you want to add to FLOATING_TEXT?`, 1, 10, 1)
  .show(player).then(async(res) => {
    if (res.canceled) return
    if (res.formValues[0]) addText(player, target, res.formValues[0])
  })
}

function addText(player, target, countText) {
  let getText = target.getTags().filter(v => v.includes("text:"))
  if (getText.length + countText > 10) return player.sendui.Message(`§cYou chose too many text, the floating_text now has ${getText.length} text and you chose ${countText} text if added up to ${getText.length + countText} which is more than the maximum number of 10 text`) && player.playSound("note.pling")
  let gui = new ui.ModalFormData()
  gui.title(`FTEXT EDITOR`)
  for (let i = 0; i < countText; i++) {
    gui.textField(`§cText ${i + 1}`,`Add Text`)
  }
  gui.show(player).then(async(res) => {
    if (res.canceled) return
    let sText = 0
    for (let i = 0; i < countText; i++) {
      if (target.hasTag(`text:${res.formValues[i]}`)) {
        player.sendui.Message(`§cThe ${i+1}th text containing "${res.formValues[i]}" is already in the text list`)
        player.playSound("note.bass")
      } else {
        target.addTag(`text:${res.formValues[i]}`)
        sText += 1
      }
    }
    player.sendui.Message(`§aSuccessfully added ${sText} text`)
    player.playSound(`random.orb`)
  })
}

function removeText(player, target) {
  let gui = new ui.ModalFormData()
  let entityText = target.getTags().filter(v => v.includes("text:"))
  if (!entityText.length == 0) return player.sendui.Message(`§cNo text listed yet`) && player.playSound("note.bass")
  let operations = entityText.map(f => f.slice(5))

  gui.title(`FTEXT EDITOR`)
  gui.dropdown("choose who you want to visit", operations)
  gui.show(player).then(async(res) => {
    if (res.canceled || !res.formValues[0]) return
    let removeText = entityText[res.formValues[0]]
    target.removeTag(`${removeText}`)
    player.sendui.Message(`§aSuccessfully deleted text "${removeText}"`)
    player.playSound("random.orb")
  })
}

function tpCoordinate(player, target) {
  new ui.ModalFormData()
  .title(`FTEXT EDITOR`)
  .textField(`§cEnter the text "@s" to teleport floating_text to you`, `Enter coordinate`)
  .show(player).then(async(res) => {
    if (res.canceled) return
    let args = res.formValues[0].trim().split(/ +/).slice(1)
    if (res.formValues[0] == "@s") {
      target.runCommandAsync(`tp @s ${player.name}`)
    } else if (!args[1] || isNaN(res.formValues[0].split(" ")[0]) || isNaN(args[0]) || isNaN(args[1])) {
      player.sendui.Message(`§cPlease enter the coordinates correctly`)
      player.playSound(`note.bass`)
    } else {
      target.runCommandAsync(`tp @s ${res.formValues[0]}`)
      player.sendui.Message(`§aSuccessfully teleported floating_text to coordinates ${res.formValues[0]}`)
      player.playSound(`random.orb`)
    }
  })
}
