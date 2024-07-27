import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui"
import { enables } from '../config.js';
import { getScore } from '../lib/game.js';
import { buttons, color, disableColor, disableIcon, disableText } from "./buttons.js";

export function player(player) {
    let fm = new ActionFormData();
    fm.title("Function menu");
    fm.body("This is a very powerful menu");

    buttons.forEach((data) => {
        let buttonText, icon;
        if (enables.get(data.id) == 1) {
            buttonText = `§r${color}${data.display}\n§r${disableColor}${disableText}`
            icon = disableIcon
        } else {
            buttonText = `§r${color}${data.display}`
            icon = data.icon
        }
        fm.button(buttonText, icon);
    })

    fm.show(player).then(response => {
        if (response.isCanceled) return;
        if (enables.get(buttons[response.selection].id))
          buttons[response.selection].handler(player);
        else
          player.sendMessage("§cFitur Dinonaktifkan oleh administrator!")
    })
}