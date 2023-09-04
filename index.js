const fs = require('fs');
const child = require('child_process');

function InstallPackages() {
	console.log('你沒有安裝包...')
	console.log('請稍候...開始使用安裝所有必需的安裝包')
	console.log('如果機器人無法安裝安裝包，請手動安裝')
	try {
		child.execSync('npm i')
		console.log('安裝完成,請再次運行index.js')
		process.exit()
	} catch (err) {
		console.log('錯誤 ', err)
		console.log('本託管只翻譯, 所有版權歸HirziDevs : https://discord.gg/zv6maQRah3')
		process.exit()
	}
}

if (Number(process.version.split('.')[0]) < 16) {
	console.log('請使用node16以上')
	process.exit()
}
if (fs.existsSync('./node_modules')) {
	if (fs.existsSync('./node_modules/discord.js')) {
		const check = require('./node_modules/discord.js/package.json')
		if (Number(check.version.split('.')[0]) !== 14) {
			console.log('請使用Discord.js14')
			process.exit()
		}
	} else InstallPackages()
	if (fs.existsSync('./node_modules/axios')) {
		const check = require('./node_modules/axios/package.json')
		if (Number(check.version.split('.')[1]) > 1) {
			console.log('請使用axios1.1.3')
			process.exit()
		}
	} else InstallPackages()
	if (fs.existsSync('./node_modules/chalk')) {
		const check = require('./node_modules/chalk/package.json')
		if (Number(check.version.split('.')[0]) > 4) {
			console.log('請使用Chalk4.1.2')
			process.exit()
		}
	} else InstallPackages()
	if (!fs.existsSync('./node_modules/js-yaml')) InstallPackages()
} else InstallPackages()

const chalk = require('chalk');
const yaml = require('js-yaml');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));

if (client.config.panel.adminkey || client.config.resource || client.config.message.image) {
	console.log(chalk.cyan('Lesa Host') + chalk.red('你正在使用舊的檔案,請使用最新(本託管只翻譯, 所有版權歸HirziDevs)') + chalk.green('https://github.com/HirziDevs/PteroStats/blob/main/config.yml'))
	process.exit()
}
if (client.config.token.startsWith('Put') || !client.config.token.length) {
	console.log(chalk.cyan('Lesa Host') + chalk.red('Discord bot token寫錯了'))
	process.exit()
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(client.config.token);