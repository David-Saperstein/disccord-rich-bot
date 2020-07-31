'use strict';

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const yt=['https://www.youtube.com/watch?v=YT_MycK6_tA',
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
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

const GoogleImages = require('google-images');

const clientG = new GoogleImages('016068996190123085229:kcsibvskhoc', 'AIzaSyC87FAGjS64h2tU1W8xh5vuOozjv7S2vYE');
const ytdl = require('ytdl-core');
function main(){
  var imgurl='';
  var rnd=Math.floor(Math.random()*9);
  var pg=Math.floor(rnd/10)+1;
  var left=rnd%10;
  return clientG.search('Richard Epcar', {page: pg}).then(images=>{
    return images[left]['url'];
  });
}
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
     main().then(val=>{
       const exampleEmbed = new Discord.MessageEmbed()
      	.setColor('#0099ff')
      	.setTitle('Our Boy!')
      	.setImage(val);
       message.channel.send(exampleEmbed).then(console.log).catch(console.error);
     });
  }
  else if (message.content==='!rich-play'){
    if (!message.guild) return;
    if (message.member.voice.channel){
      const connection=await message.member.voice.channel.join();
      const dispatcher = connection.play(ytdl(yt[Math.floor(Math.random()*15)],{filter: 'audioonly'}));
      dispatcher.on('finish', () => {console.log('Finished playing!');});
    }else{
      message.reply('You need to be in a vc first!');
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login('NzM4NzY4MzQ0MzAzNTM0MjI4.XyQtog.qJ1Oet0dbfSt8PoRoTeHeNF_l2o');
