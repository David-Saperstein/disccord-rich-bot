'use strict';

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const yt=['https://www.youtube.com/watch?v=YT_MycK6_tA',
'https://youtu.be/QDh6RWD-8WI',
'https://www.youtube.com/watch?v=SCL46jdWX9g',
'https://www.youtube.com/watch?v=Ph7ilM8Ua_s',
'https://www.youtube.com/watch?v=hU3OfgLJSC4',
'https://www.youtube.com/watch?v=MgOJh9F7ugQ',
'https://www.youtube.com/watch?v=_RTh8kYXa88',
'https://www.youtube.com/watch?v=iw_rcdevHTw',
'https://www.youtube.com/watch?v=oVDILs-pFo4',
'https://www.youtube.com/watch?v=RYP7EDWG378',
'https://www.youtube.com/watch?v=kVCFbqIimPo',
'https://www.youtube.com/watch?v=pc5dcIttCl4',
'https://www.youtube.com/watch?v=JV4ZNiz-mLM',
'https://www.youtube.com/watch?v=_ebnuMeWXl8',
'https://www.youtube.com/watch?v=_c4XfupJeeU',
'https://www.youtube.com/watch?v=0CD7VE14zv4',
'https://www.youtube.com/watch?v=PnmmBg-hznY'];
const im=['https://upload.wikimedia.org/wikipedia/commons/b/b3/Richard_Epcar_Headshot.jpg',
'https://m.media-amazon.com/images/M/MV5BMWM3NDJiNTktODI3OS00OTJkLWFjMzAtOGNkMzI3ZjE1NjkxXkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_.jpg',
'https://m.media-amazon.com/images/M/MV5BMmQ4MTAwMmEtYTVmMy00MzQ0LTg2ODgtM2Q5ZDMzMDc2NDljXkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UX180_CR0,0,180,180_AL_.jpg',
'https://vignette.wikia.nocookie.net/avatar/images/a/a4/Richard_Epcar.png/revision/latest/top-crop/width/360/height/450?cb=20130924201101',
'https://static.tvtropes.org/pmwiki/pub/images/re_54.jpg',
'https://pbs.twimg.com/media/DjyrzZaUwAAjePS.jpg',
'https://i.ytimg.com/vi/_c4XfupJeeU/maxresdefault.jpg',
'https://vignette.wikia.nocookie.net/marvelanimated/images/d/d1/Richard_Epcar.jpg/revision/latest/scale-to-width-down/340?cb=20180430035422',
'https://pbs.twimg.com/media/Di5eyeAU8AAzAiL.jpg',
'https://giantbomb1.cbsistatic.com/uploads/scale_small/0/5809/551421-richard.jpg'];
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();
const ytdl = require('ytdl-core');
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', async message => {
  // If the message is "ping"
  if (message.content === '!rich') {
    // Send "pong" to the same channel
     const exampleEmbed = new Discord.MessageEmbed()
    	.setColor('#0099ff')
    	.setTitle('Our Boy!')
    	.setImage(im[Math.floor(Math.random()*(im.length-1))]);
     message.channel.send(exampleEmbed).then(console.log).catch(console.error);
  }
  else if (message.content==='!rich-play'){
    if (!message.guild) return;
    if (message.member.voice.channel){
      const connection=await message.member.voice.channel.join();
      const dispatcher = connection.play(ytdl(yt[Math.floor(Math.random()*(yt.length-1))],{filter: 'audioonly'}));
      dispatcher.on('finish', () => {console.log('Finished playing!');});
    }else{
      message.reply('You need to be in a vc first!');
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
