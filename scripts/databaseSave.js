import { Database } from "./@modules/Database.js"

//SETTING
export const ServerSetDB = new Database("settingDB").load();

export const commandCooldown = [];