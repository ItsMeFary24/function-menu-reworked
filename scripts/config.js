export default config()

function config() {
  return {
    //Prefix to use custom command, You can't use /
    //since mojang doesn't allow to read the commands
    prefix: ".",

    //The format of the chat, possible value is:
    //%level%, %title% (this is rank), %player%, %clan%, %msg%
    chatFormat: `[Lv.%level%§r] [%title%§r] %player% %clan% >>§f %msg%`,

    //Cooldown for chatting so player doesn't spam
    chatCd: 3,

    //Text above player head when chatting
    bubbleChat: true,

    //Default rank before the admin sets it
    defaultRank: '§7Guest',

    //Prefix on the player tag so system know
    //that tag is rank
    rankPrefix: 'rank:',

    //Message that's shows up when you level up
    levelUpMsg: `>> §bSelamat! Anda telah naik level menjadi §aLv.%level%!`,

    //Chance of getting bigger xp
    chanceXp: 5,

    //Rather to show or not text above items drop to
    //countdown before despawn
    clearItem: false,

    //This is the reward for level up
    specialLevelMappings: {
      5: "iron_sword",
      10: "bow",
      15: "iron_pickaxe",
      20: "shield",
      25: "brewing_stand",
      30: "ender_chest",
      35: "netherite_chestplate",
      40: "trident",
      50: "elytra",
      60: "totem_of_undying",
      70: "netherite_chestplate",
      80: "beacon",
      100: "nether_star"
    }
  };
}
