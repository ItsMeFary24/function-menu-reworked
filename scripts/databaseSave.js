import { Database } from "./lib/Database.js"

//SETTING
export const ServerSetDB = new Database("settingDB");
export const HomeDB = new Database("homeDB")

export const commandCooldown = [];