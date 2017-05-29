module.exports = {
	'url' : process.env.MLAB_DB_DEV_URL || 'mongodb://' + process.env.DATABASE_DEV_USERNAME + ':' + process.env.DATABASE_DEV_PASSWORD + '@ds155841.mlab.com:55841/yoshi_options_dev'
}
