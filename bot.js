'use strict';
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const fs=require('fs');
var yt=fs.readFileSync('youtube.txt','utf8');
yt=yt.split(/\r?\n/);
if (yt[yt.length-1]=='') yt.pop();
var im=fs.readFileSync('images.txt','utf8');
im=im.split(/\r?\n/);
if (im[im.length-1]=='') im.pop();
var keyword=fs.readFileSync('keywords.txt','utf8');
keyword=keyword.split(/\r?\n/);
if (keyword[keyword.length-1]=='') keyword.pop();
var optionsString='';
for (var i=0; i<yt.length;i++){
  optionsString+='\''+keyword[i]+'\' for '+yt[i];
  optionsString+='\n';
}
const optionsEmbed=new Discord.MessageEmbed().setColor('#0099ff').setTitle('Youtube and Keywords').setDescription('Play specific youtube video using keyword. (ex !rich-play ichigo)')
.addField('vids and keywords',optionsString,true);
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
  if (message.content.toLowerCase() === '!rich') {
    // Send "pong" to the same channel
     const exampleEmbed = new Discord.MessageEmbed()
    	.setColor('#0099ff')
    	.setTitle('Our Boy!')
    	.setImage(im[Math.floor(Math.random()*(im.length-1))]);
     message.channel.send(exampleEmbed).then(console.log).catch(console.error);
  }
  else if (message.content.toLowerCase() ==='!rich-play'){
    if (!message.guild) return;
    if (message.member.voice.channel){
      const connection=await message.member.voice.channel.join();
      const dispatcher = connection.play(ytdl(yt[Math.floor(Math.random()*(yt.length-1))],{filter: 'audioonly'}));
      dispatcher.on('finish', () => {console.log('Finished playing!');});
    }else{
      message.reply('You need to be in a vc first!');
    }
  }
  else if (message.content.toLowerCase() ==='!rich-options'){
    message.member.send(optionsEmbed).then(console.log).catch(console.error);
  }
  else if(/!rich-play/.test(message.content.toLowerCase())){
    if(/youtube.com\/watch\?v=/.test(message.content.toLowerCase())){
      var pos=message.content.toLowerCase().search(/youtube.com\/watch\?v=/);
      var ytlink=message.content.slice(pos,pos+31);
      if (!message.guild) return;
      if (message.member.voice.channel){
        const connection=await message.member.voice.channel.join();
        const dispatcher = connection.play(ytdl(ytlink,{filter: 'audioonly'}));
        dispatcher.on('finish', () => {console.log('Finished playing!');});
      }else{
        message.reply('You need to be in a vc first!');
      }
      return;
    }
    else if(/youtu.be\//.test(message.content.toLowerCase())){
      var pos=message.content.toLowerCase().search(/youtu.be\//);
      var ytlink='https://'+message.content.slice(pos,pos+20);
      if (!message.guild) return;
      if (message.member.voice.channel){
        const connection=await message.member.voice.channel.join();
        const dispatcher = connection.play(ytdl(ytlink,{filter: 'audioonly'}));
        dispatcher.on('finish', () => {console.log('Finished playing!');});
      }else{
        message.reply('You need to be in a vc first!');
      }
      return;
    }
    for(var i=0; i<yt.length;i++){
      if(message.content.toLowerCase().search(keyword[i])>0){
        if (!message.guild) return;
        if (message.member.voice.channel){
          const connection2=await message.member.voice.channel.join();
          const dispatcher2 = connection2.play(ytdl(yt[i],{filter: 'audioonly'}));
          dispatcher2.on('finish', () => {console.log('Finished playing!');});
        }else{
          message.reply('You need to be in a vc first!');
        }
        return;
      }
    }
    if (!message.guild) return;
    if (message.member.voice.channel){
      const connection3=await message.member.voice.channel.join();
      const dispatcher3 = connection3.play(ytdl(yt[Math.floor(Math.random()*(yt.length-1))],{filter: 'audioonly'}));
      dispatcher3.on('finish', () => {console.log('Finished playing!');});
    }else{
      message.reply('You need to be in a vc first!');
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
