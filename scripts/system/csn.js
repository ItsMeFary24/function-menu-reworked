import { system } from "@minecraft/server"
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui"
import { getScore, tagback } from "../lib/game"

system.runInterval(() => tagback('csn', warn))

export function warn(player) {
  const form = new MessageFormData()
    .title("Warning!")
    .body(`§cWARNING: This is a gambling game! §r\nIf you're not sure, exit now. §r\nWhen you choose to play, be responsible. §r\nYour decision, your risk. §r`)
    .button1("Continue")
    .button2("Cancel")

  form.show(player).then(result => {
    if (result.selection === 1) {
      player.runCommandAsync(`playsound note.pling @s`)
    } else if (result.selection === 0) {
      casino(player)
    }
  })
}

function casino(player) {
  const form = new ActionFormData()
    .title("Casino Area")
    .body(` \n        §l§cCA§eSI§aNO §bGA§dMES\n\n§rHello §c${player.name}\n§fCoins: §c${getScore(player, 'money')}, \n\n§f§6Welcome §fto our gaming zone,\nTry your luck with §edice §for §aroulette,§r or just enjoy the show with a big smile. Don't forget, if you decide to §bskip §fthe game,§f well, that's an okay choice §dLol`)
    .button("§r§lGuess the Number\n§r§oClick to play", "textures/ui/icon_expand")
    .button("§r§lLucky Card Draw\n§r§oClick to play", "textures/ui/village_hero_effect")
    .button("§r§lOpen the Door\n§r§oClick to play", "textures/items/door_wood")
    .button("§r§lDice\n§r§oClick to play", "textures/ui/icon_random")
    .button("§c§lClose\n§r§oClick to Close", "textures/ui/redX1")

  form.show(player).then(result => {
    switch (result.selection) {
      case 0:
        guessNumber(player)
        break
      case 1:
        openLuckyCardDraw(player)
        break
      case 2:
        openDoor(player)
        break
      case 3:
        dice(player)
        break
    }
  })
}


function dice(player) {
  const playerMoney = getScore(player, 'money')
  const form = new ModalFormData()
    .title("Dice")
    .dropdown(" \n        §l§cCA§eSI§aNO §bGA§dMES\n\n§r§eHow to Play:\n§rFirst, enter the bet amount and then guess whether the dice result is even or odd.\n\nMake your prediction\n§7* pilih prediksi mu", ["Odd", "Even"])
    .textField("Enter the bet amount (min. 5k)", "5000")

  form.show(player).then(result => {
    const prediction = result.formValues[0] === "Odd" ? "Odd" : "Even"
    const betAmount = parseInt(result.formValues[1])

    if (isNaN(betAmount) || betAmount < 5000) return player.sendMessage("§l§cCA§eSI§aNO §bGA§dMES §r§8// §rPlease enter a minimum bet amount of 5k coins.")

    if (betAmount > playerMoney) return player.sendMessage("§l§cCA§eSI§aNO §bGA§dMES §r§8// §rSorry, you don't have enough money for this bet.")

    const diceResult = Math.floor(Math.random() * 6) + 1
    const isOdd = diceResult % 2 !== 0
    const winAmount = ((isOdd && prediction === "Odd") || (!isOdd && prediction === "Even")) ? betAmount : -betAmount

    if (winAmount > 0) {
      player.runCommandAsync(`scoreboard players add @s money ${winAmount}`)
      player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§8- §rCongratulations! Dice result: ${diceResult}. Your prediction "${prediction}" is correct. You win ${winAmount} coins!`)
      player.runCommandAsync(`playsound random.levelup @s`)
      player.runCommandAsync(`execute at @s run summon fireworks_rocket ~~~`)
    } else {
      player.runCommandAsync(`scoreboard players remove @s money ${-winAmount}`)
      player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§r§8- §rSorry, dice result: ${diceResult}. Your prediction "${prediction}" is incorrect. You lose ${-winAmount} coins. Better luck next time.`)
      player.runCommandAsync(`playsound mob.wither.death @s`)
    }
  })
}

function guessNumber(player) {
  const playerMoney = getScore(player, 'money')
  const form = new ModalFormData()
    .title("Guess the Number")
    .textField(" \n        §l§cCA§eSI§aNO §bGA§dMES\n\n§r§eHow to Play:\n§rEnter the bet amount (minimum 5k):\nthen try to guess the correct number\n\nEnter the bet amount\n§7* masukan jumlah taruhan", "5000")

  form.show(player).then(result => {
    const betAmount = parseInt(result.formValues[0])

    if (isNaN(betAmount) || betAmount < 5000 || betAmount > 500000) {
      player.sendMessage("§l§cCA§eSI§aNO §bGA§dMES §r§r§8 -§rPlease enter a minimum bet amount of 5k coins and a maximum of 500k.")
      return
    }

    if (betAmount > playerMoney) {
      player.sendMessage("§l§cCA§eSI§aNO §bGA§dMES §r§8// §rSorry, you don't have enough money for this bet.")
      return
    }

    const minNumber = Math.floor(Math.random() * 90) + 1
    const maxNumber = minNumber + 10
    const correctNumber = Math.floor(Math.random() * 10) + minNumber

    const dropdownOptions = Array.from({ length: 10 }, (_, i) => `${minNumber + i}`)
    const numberRange = `${minNumber} - ${maxNumber}`
    const numberForm = new ModalFormData()
      .title("Guess the Number")
      .dropdown(`Guess the number from ${numberRange}\n§7* Tebak angka dari ${numberRange}\n§r\nChoose a number`, dropdownOptions)

    numberForm.show(player).then(numberResult => {
      if (numberResult.canceled) {
        player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§r§8 -§rGame Canceled!`)
        player.runCommandAsync(`playsound note.pling @s`)
        return
      }

      const selectedNumber = parseInt(numberResult.formValues[0]) + minNumber
      const winAmount = Math.random() <= 0.45 ? betAmount : -betAmount

      if (winAmount > 0) {
        player.runCommandAsync(`scoreboard players add @s money ${betAmount}`)
        player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§r§8 -§rCongratulations! You guessed the number ${selectedNumber} correctly! You win ${betAmount} coins.`)
        player.runCommandAsync(`playsound random.levelup @s`)
      } else {
        player.runCommandAsync(`scoreboard players remove @s money ${betAmount}`)
        player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§r§8 -§rSorry, you guessed incorrectly. The correct number was ${correctNumber}. You lose ${betAmount} coins.`)
        player.runCommandAsync(`playsound mob.wither.death @s`)
      }
    })
  }).catch(console.error)
}

function openDoor(player) {
  const form = new ModalFormData()
    .title("Open the Door")
    .textField(" \n        §l§cCA§eSI§aNO §bGA§dMES\n\n§r§eHow to Play:\n§rFirst, enter the bet amount (minimum 5k):\nthen guess which door is correct.\n\nEnter the bet amount (minimum 5k):\n§7* masukan jumlah taruhan (minimal 5k)", "5000")
    .dropdown("§rGuess the correct door:", ["Door 1", "Door 2", "Door 3"])

  form.show(player).then(result => {
    const betAmount = parseInt(result.formValues[0])
    const selectedDoor = result.formValues[1]

    if (isNaN(betAmount) || betAmount < 5000) {
      player.sendMessage("§l§cCA§eSI§aNO §bGA§dMES §r§8// §rPlease enter a minimum bet amount of 5k coins.")
      return
    }

    if (betAmount > getScore(player, 'money')) {
      player.sendMessage("§l§cCA§eSI§aNO §bGA§dMES §r§8// §rSorry, you don't have enough money for this bet.")
      return
    }

    const correctDoor = `Door ${Math.floor(Math.random() * 3) + 1}`

    if (selectedDoor === correctDoor) {
      player.runCommandAsync(`scoreboard players add @s money ${betAmount}`)
      player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§8// §rCongratulations! You guessed the correct door: ${correctDoor}. You win ${betAmount} coins!`)
      player.runCommandAsync(`playsound random.levelup @s`)
    } else {
      player.runCommandAsync(`scoreboard players remove @s money ${betAmount}`)
      player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§8// §rSorry, you guessed the wrong door. The correct door was ${correctDoor}. You lose ${betAmount} coins.`)
      player.runCommandAsync(`playsound mob.wither.death @s`)
    }
  }).catch(console.error)
}

function openLuckyCardDraw(player) {
  const playerMoney = getScore(player, 'money')
  const form = new ModalFormData()
    .title("Lucky Card Draw")
    .textField(" \n        §l§cCA§eSI§aNO §bGA§dMES\n\n§r§eHow to Play:\n§rEnter the bet amount (minimum 5k):\nthen draw a card and see if you're lucky.\n\nEnter the bet amount (minimum 5k):\n§7* masukan jumlah taruhan (minimal 5k)", "5000")

  form.show(player).then(result => {
    const betAmount = parseInt(result.formValues[0])

    if (isNaN(betAmount) || betAmount < 5000) {
      player.sendMessage("§l§cCA§eSI§aNO §bGA§dMES §r§8// §rPlease enter a minimum bet amount of 5k coins.")
      return
    }

    if (betAmount > playerMoney) {
      player.sendMessage("§l§cCA§eSI§aNO §bGA§dMES §r§8// §rSorry, you don't have enough money for this bet.")
      return
    }

    const cardValue = Math.floor(Math.random() * 13) + 1
    const cardSuit = ["Hearts", "Diamonds", "Clubs", "Spades"][Math.floor(Math.random() * 4)]
    const card = `${cardValue} of ${cardSuit}`
    const winAmount = Math.random() <= 0.5 ? betAmount : -betAmount

    if (winAmount > 0) {
      player.runCommandAsync(`scoreboard players add @s money ${betAmount}`)
      player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§8// §rCongratulations! You drew the ${card} and won ${betAmount} coins!`)
      player.runCommandAsync(`playsound random.levelup @s`)
    } else {
      player.runCommandAsync(`scoreboard players remove @s money ${betAmount}`)
      player.sendMessage(`§l§cCA§eSI§aNO §bGA§dMES §r§8// §rSorry, you drew the ${card} and lost ${betAmount} coins.`)
      player.runCommandAsync(`playsound mob.wither.death @s`)
    }
  }).catch(console.error)
}
