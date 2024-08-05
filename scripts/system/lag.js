import { world, system } from '@minecraft/server'
import { clearitem } from '../config'

system.runInterval(() => {
  if (clearitem) {
    world.getDimension("overworld").getEntities().forEach(async v => {
      if (v.typeId === "minecraft:item" && v.isValid()) {
        let second = 15
        const run = system.runInterval(() => {
          second--
          if (v && v.isValid()) {
            if (tick <= 0) {
              v.kill()
              system.clearRun(run)
            } else {
              v.nameTag = "§7item ini akan dihapus\n§7dalam waktu: §c" + second + " detik§r"
            }
          } else {
            system.clearRun(_0x1a5b15)
          }
        }, 14)
      }
    })
  }
}, 190)