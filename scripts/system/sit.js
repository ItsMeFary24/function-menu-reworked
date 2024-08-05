import { system, world } from "@minecraft/server"

system.runInterval(() => world.getPlayers().forEach((player) => {
    if (player.isInWater || player.isSneaking || player.isClimbing || player.isFalling || player.isSwimming || player.isSprinting || player.isJumping) {
      if (player.hasTag("sit")) {
        player.removeTag("sit")
        player.playAnimation('animation.player.sit', {blendOutTime: 0})
      } else if (player.hasTag("lay")) {
        player.removeTag("lay")
        player.playAnimation('animation.player.lay', {blendOutTime: 0})
      }
    } 
}))