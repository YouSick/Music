const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { Client, Util } = require('discord.js');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map();
const client = new Discord.Client();

/*
Ø§Ù„Ø¨ÙƒØ¬Ø¢Øª
npm install discord.js
npm install ytdl-core
npm install get-youtube-id
npm install youtube-info
npm install simple-youtube-api
npm install queue
*/

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`in ${client.guilds.size} servers `)
    console.log(`[Codes] ${client.users.size}`)
    client.user.setStatus("idle")
});
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
const prefix = "$"
client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	if (!msg.content.startsWith(prefix)) return undefined;
	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('error');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
			return msg.channel.send('error');
		}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('error');
		}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'

		if (!permissions.has('EMBED_LINKS')) {
			return msg.channel.sendMessage("error")
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
			return msg.channel.send(` **${playlist.title}** error`);
		} else {
			try {//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'

				var video = await youtube.getVideo(url);
			} catch (error) {
				try {//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					const embed1 = new Discord.RichEmbed()
			        .setDescription(`error :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
					.setFooter("cow")
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 15000,
							errors: ['time']
						});//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
					} catch (err) {
						console.error(err);
						return msg.channel.send('error');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('error');
				}
			}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'

			return handleVideo(video, msg, voiceChannel);
		}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	} else if (command === `skip`) {
		if (!msg.member.voiceChannel) return msg.channel.send('error.');
		if (!serverQueue) return msg.channel.send('error');
		serverQueue.connection.dispatcher.end('error');
		return undefined;
	} else if (command === `stop`) {//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		if (!msg.member.voiceChannel) return msg.channel.send('error');
		if (!serverQueue) return msg.channel.send('error');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('error');
		return undefined;
	} else if (command === `vol`) {
		if (!msg.member.voiceChannel) return msg.channel.send('error');
		if (!serverQueue) return msg.channel.send('error');
		if (!args[1]) return msg.channel.send(`:loud_sound: error **${serverQueue.volume}**`);
		serverQueue.volume = args[1];//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
		return msg.channel.send(`:speaker: error **${args[1]}**`);
	} else if (command === `np`) {
		if (!serverQueue) return msg.channel.send('error');
		const embedNP = new Discord.RichEmbed()
	.setDescription(`:notes: Name Song : **${serverQueue.songs[0].title}**`)
		return msg.channel.sendEmbed(embedNP);
	} else if (command === `queue`) {
		//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		if (!serverQueue) return msg.channel.send('error');
		let index = 0;
		//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		const embedqu = new Discord.RichEmbed()
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**Ø§Ù„Ø§Ù† ÙŠØªÙ… ØªØ´ØºÙŠÙ„** ${serverQueue.songs[0].title}`)
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('error');
		}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		return msg.channel.send('error');
	} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('error');
		}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		return msg.channel.send('error');
	}

	return undefined;
});
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		queue.set(msg.guild.id, queueConstruct);
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		queueConstruct.songs.push(song);
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`errrr or ${error}`);
		}
	} else {//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(` **${song.title}** error 4 ever`);
	}
	return undefined;
}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	console.log(serverQueue.songs);
//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
			play(guild, serverQueue.songs[0]);
		})//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
		.on('error', error => console.error(error));//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'

	serverQueue.textChannel.send(`error fe mkan al97y7 : **${song.title}**`);
}//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'

const adminprefix = "$vip";//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
const devs = ['274923685985386496'];//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
client.on('message', message => {//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
  var argresult = message.content.split(` `).slice(1).join(' ');//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
    if (!devs.includes(message.author.id)) return;//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
    
if (message.content.startsWith(adminprefix + 'setgame')) {//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
  client.user.setGame(argresult);
    message.channel.sendMessage(`**${argresult} error`)
} else 
  if (message.content.startsWith(adminprefix + 'setname')) {
client.user.setUsername(argresult).then
    message.channel.sendMessage(`**${argresult}** : error`)
return message.reply("00100");
} else
  if (message.content.startsWith(adminprefix + 'setavatar')) {
client.user.setAvatar(argresult);
  message.channel.sendMessage(`**${argresult}** : loooool`);
      } else     
if (message.content.startsWith(adminprefix + 'setT')) {
  client.user.setGame(argresult, "https://www.twitch.tv/idk");
    message.channel.sendMessage(`${argresult}**`)
}

});

client.on("message", message => {
 if (message.content === `${prefix}`) {
  const embed = new Discord.RichEmbed() //by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
      .setColor("#000000")//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
      .setDescription(`
${prefix}play none
${prefix}skip loaowkwkwkwkss is not disbled
${prefix}pause adad
${prefix}resume wwtfstfs
${prefix}vol akkwkwkw  100 - 0
${prefix}stop momo is enabled
${prefix}np â‡ nononni
${prefix}queue loool

 `)//by ,$ ReBeL Ø¡ , ðŸ”•#4777 'CODES SERVER'
   message.channel.sendEmbed(embed)//by ,$ ReB
    
   }
   }); 
   
client.login("BOT_TOKEN");
