var CronJob = require('../lib/js/cron.js').CronJob;
var testFunction = function() {
	console.log(Date());
	console.log('this function is running');
}

console.log('initiating cron job');
new CronJob({
  cronTime: "* * * * * *",
  onTick: testFunction,
  start: true,
  timeZone: "America/Los_Angeles"
});
