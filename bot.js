'use strict';
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const fs=require('fs');
const queue = new Map();
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
      var ytlink=yt[Math.floor(Math.random()*(yt.length-1))];
      const serverQueue = queue.get(message.guild.id);
      execute(ytlink, message,serverQueue);
    //   const connection=await message.member.voice.channel.join();
    //   const dispatcher = connection.play(ytdl(yt[Math.floor(Math.random()*(yt.length-1))],{filter: 'audioonly'}));
    //   dispatcher.on('finish', () => {console.log('Finished playing!');});
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
        const serverQueue = queue.get(message.guild.id);
        execute(ytlink, message, serverQueue);
        return;
      //   const connection=await message.member.voice.channel.join();
      //   const dispatcher = connection.play(ytdl(ytlink,{filter: 'audioonly'}));
      //   dispatcher.on('finish', () => {console.log('Finished playing!');});
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
        const serverQueue = queue.get(message.guild.id);
        execute(ytlink, message, serverQueue);
        return;
    //     const connection=await message.member.voice.channel.join();
    //     const dispatcher = connection.play(ytdl(ytlink,{filter: 'audioonly'}));
    //     dispatcher.on('finish', () => {console.log('Finished playing!');});
      }else{
        message.reply('You need to be in a vc first!');
      }
      return;
    }
    for(var i=0; i<yt.length;i++){
      if(message.content.toLowerCase().search(keyword[i])>0){
        if (!message.guild) return;
        if (message.member.voice.channel){
          const serverQueue = queue.get(message.guild.id);
          execute(yt[i], message, serverQueue);
          // const connection2=await message.member.voice.channel.join();
          // const dispatcher2 = connection2.play(ytdl(yt[i],{filter: 'audioonly'}));
          // dispatcher2.on('finish', () => {console.log('Finished playing!');});
        }else{
          message.reply('You need to be in a vc first!');
        }
        return;
      }
    }
    if (!message.guild) return;
    if (message.member.voice.channel){
      const serverQueue = queue.get(message.guild.id);
      execute(yt[Math.floor(Math.random()*(yt.length-1))], message, serverQueue);
      return;
      // const connection3=await message.member.voice.channel.join();
      // const dispatcher3 = connection3.play(ytdl(yt[Math.floor(Math.random()*(yt.length-1))],{filter: 'audioonly'}));
      // dispatcher3.on('finish', () => {console.log('Finished playing!');});
    }else{
      message.reply('You need to be in a vc first!');
    }
    return;
  }
  else if(message.content.toLowerCase()==='!rich-leave'){
    if(queue.get(message.guild.id)){
      queue.get(message.guild.id).voiceChannel.leave();
    }else{
      message.reply('I am not in a vc');
    }
    // if(message.member.voice.channel){
    //   message.member.voice.channel.leave();
    // }else{
    //   message.reply('You need to be in the same vc as me first');
    // }
  }
  else if(message.content.toLowerCase()==='!rich-skip'){
    const serverQueue = queue.get(message.guild.id);
    skip(message,serverQueue);
  }
  else if(message.content.toLowerCase()==='!rich-stop'){
    const serverQueue = queue.get(message.guild.id);
    stop(message,serverQueue);
  }
});
async function execute(ytlink,message, serverQueue) {

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(ytlink);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  queue.get(message.guild.id).voiceChannel.leave();

}

async function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    // queue.get(message.guild.id).voiceChannel.leave(); put in leave function
    // queue.delete(guild.id);
    return;
  }
  const songInfo = await ytdl.getInfo(song.url);
  const dispatcher = serverQueue.connection
    .play(ytdl(songInfo.videoDetails.video_url)) //maybe audioonly filter
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Rich playing: **${song.title}**`);
}

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
