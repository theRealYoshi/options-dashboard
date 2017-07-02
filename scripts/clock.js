var CronJob = require('../lib/js/cron.js').CronJob;
var TraderBot = require('./traderBot.js');

//automatically detect crontime upon initiation and for how long its running.
new CronJob({
  cronTime: "* * * * *",
  onTick: TraderBot.start,
  start: true,
  timeZone: "America/Los_Angeles"
});
