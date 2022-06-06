const RPC = require("discord-rpc");
const rpc = new RPC.Client({ transport: "ipc" });
const axios = require("axios");

const {
  RPC_CLIENT_ID,
  API_KEY,
  EPIC_USERNAME,
  BUTTONS,
} = require("./settings/config.json");

async function GetStats() {
  let res = await axios.get(
    "https://fortnite-api.com/v2/stats/br/v2?name={username}".replace(
      "{username}",
      EPIC_USERNAME
    ),
    {
      headers: {
        Authorization: API_KEY,
      },
    }
  );
  let lvl = res.data.data.battlePass.level;
  let wins = res.data.data.stats.all.overall.wins;
  let kills = res.data.data.stats.all.overall.kills;
  let deaths = res.data.data.stats.all.overall.deaths;
  let progress = res.data.data.battlePass.progress;

  Stats(lvl, wins, kills, deaths, progress);
}
async function Stats(bp, w, k, d, p) {
  rpc.setActivity({
    details: "👑 {battlepass} | 🎉 {current_progress}% ({next_level}% Left)"
      .replace("{battlepass}", bp)
      .replace("{next_level}", 100 - p)
      .replace("{current_progress}", p),
    state: "🏆 {wins} | 🎯 {kills} | 💀 {deaths}"
      .replace("{kills}", k.toLocaleString())
      .replace("{wins}", w.toLocaleString())
      .replace("{deaths}", d.toLocaleString()),
    largeImageKey: "fn",
    largeImageText: "Chillin' & Grindin' Battlepass",
    smallImageKey: "stats",
    smallImageText: "{epic}".replace("{epic}", EPIC_USERNAME),
    buttons: [
      {
        label: BUTTONS.one.label,
        url: BUTTONS.one.url,
      },
      {
        label: "Powered By Fortnite-API.com",
        url: "https://fortnite-api.com/?utm_source=2G4U#6809_RPC",
      },
    ],
  });
  await new Promise((p) => setTimeout(p, 60000));
  GetStats();
}
rpc.on("ready", async () => {
  console.log(
    "Fornite Stats RPC Connected\n\nAPI KEY: {key}\nEPIC USERNAME: {user}\nBUTTONS: \n{one_label} ({one_url})\n{two_label} ({two_url})"
      .replace("{key}", API_KEY)
      .replace("{user}", EPIC_USERNAME)
      .replace("{one_label}", BUTTONS.one.label)
      .replace("{one_url}", BUTTONS.one.url)
      .replace("{two_label}", BUTTONS.two.label)
      .replace("{two_url}", BUTTONS.two.url)

  );
  GetStats();
});

rpc.login({
  clientId: RPC_CLIENT_ID,
});
