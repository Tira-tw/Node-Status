const { ActivityType } = require('discord.js')
const chalk = require('chalk')
const checkStatus = require('../handlers/checkStatus')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(chalk.cyan('Lesa Host') + chalk.green('機器人已上線'))
		console.log(chalk.cyan('Lesa Host') + chalk.green('免費託管 : https://discord.gg/Lesa-Bot-Hosting'))
		console.log(chalk.cyan('Lesa Host') + chalk.yellow('節點上線但是偵測為下線,請開啟log_error') + chalk.green('log_error') + chalk.yellow('免費託管 : https://discord.gg/Lesa-Bot-Hosting'))
        console.log(chalk.cyan('Lesa Host') + chalk.green('本託管只翻譯, 所有版權歸HirziDevs'))

		if (client.guilds.cache.size < 1) return console.log(chalk.cyan('Lesa Host') + chalk.red('你要確定有沒有在你的伺服器a owob'))
		if (client.config.timeout < 1) {
			console.log(chalk.cyan('Lesa Host') + chalk.red('刷新時間不能小於1秒鐘'))
			client.config.timeout = 1
		}

		if (client.config.refresh > 1 && client.config.refresh < 10) console.log(chalk.cyan('Lesa Host') + chalk.red('刷新時間不建議設定在10秒鐘'))
		else if (client.config.refresh < 1) {
			console.log(chalk.cyan('Lesa Host') + chalk.red('刷新時間不能小於1秒鐘'))
			client.config.refresh = 10
		}

		if (client.config.presence.text && client.config.presence.type) {
			switch (client.config.presence.type.toLowerCase()) {
				case 'playing':
					client.config.presence.type = ActivityType.Playing
					break;
				case 'listening':
					client.config.presence.type = ActivityType.Listening
					break;
				case 'competing':
					client.config.presence.type = ActivityType.Competing
					break;
				default:
					client.config.presence.type = ActivityType.Watching
			}

			client.user.setActivity(client.config.presence.text, { type: client.config.presence.type })
		}

		if (client.config.presence.status) {
			if (!['idle', 'online', 'dnd', 'invisible'].includes(client.config.presence.status.toLowerCase())) client.config.presence.status = 'online'

			client.user.setStatus(client.config.presence.status);
		}

		checkStatus({ client: client })

		setInterval(() => {
			checkStatus({ client: client })
		}, client.config.refresh * 1000)
	}
}