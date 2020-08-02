const Discord = require("discord.js");
const prefix='!rich';
const ytdl = require("ytdl-core");

const client = new Discord.Client();
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

const queue = new Map();

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}-play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}-skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}-stop`)) {
    stop(message, serverQueue);
    return;
  }else if(message.content==='!rich'){
    const exampleEmbed = new Discord.MessageEmbed()
     .setColor('#0099ff')
     .setTitle('Our Boy!')
     .setImage(im[Math.floor(Math.random()*(im.length-1))]);
    message.channel.send(exampleEmbed).then(console.log).catch(console.error);
  }else if(message.content.startsWith(`${prefix}-leave`)){
    serverQueue.voiceChannel.leave();
    queue.delete(message.guild.id);
  }else if(message.content.startsWith(`${prefix}-options`)){
    message.member.send(optionsEmbed).then(console.log).catch(console.error);
  }else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");
  for (var i=0;i<yt.length;i++){
    if(args[1]==keyword[i]){
      args[1]=yt[i];
    }
  }
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

  const songInfo = await ytdl.getInfo(args[1]);
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
  if (serverQueue.songs.length==0)
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
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    // serverQueue.voiceChannel.leave();
    // queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}


// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
