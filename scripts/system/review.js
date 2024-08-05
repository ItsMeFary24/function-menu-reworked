import { system } from "@minecraft/server"
import { tagback } from "../lib/game"
import { ModalFormData, ActionFormData } from "@minecraft/server-ui"
import { DB } from "../lib/Database"

system.runInterval(() => tagback("review", getReview))

export function review(player) {
  new ModalFormData()
  .title("§eReview Player")
  .slider("§eRatings", 1, 5, 1)
  .textField("§cExplain Opinion", "Enter Opinion!")
  .show(player).then(result => {
    if (result.canceled || !result.formValues[0] || !result.formValues[1]) return

    const playerRate = result.formValues[0]
    const reason = result.formValues[1]
  
    if (reason.includes("§")) return player.sendMessage("§cCant use letters character")
 
    if (playerRate.length < 1 || reason.length < 1) return player.sendMessage("§cPlease enter all data correctly")
    const reviewData = {
      reporter: player.name,
      ratedPlayer: playerRate,
      reason: reason,
      timestamp: Date.now()
    }

    dbReviews.set(player.name, reviewData)

    player.sendMessage("§aSuccesfilly give feedback")
  })
}

export function getReview(player) {
  let reviewLogs = "Review List:\n\n"
  let d = new Date()
  let utc = d.getTimezoneOffset()
  d.setMinutes(d.getMinutes() + utc)
  let indTime = 7 * 60
  d.setMinutes(d.getMinutes() + indTime)
  let h = d.getHours()
  let m = d.getMinutes()
  let s = d.getSeconds()

  DB.get("reviews").forEach((key, value) => {
    reviewLogs += `Rate From: ${value.reporter}\n`
    reviewLogs += `Player Rate: ${value.ratedPlayer.toFixed(0)}/5\n`
    reviewLogs += `Reason: ${value.reason}\n`
    reviewLogs += `Timestamp: ${h}:${m}:${s}\n\n`
  })

  new ActionFormData()
  .title("Rating List")
  .body(reviewLogs)
  .button("§bCreate Review", "textures/ui/icon_book_writable.png")
  .button("§l§cEXIT", "textures/ui/icon_import.png")
  .show(player).then((response) => {
    if (response.selection == 0) review(player)
  })
}