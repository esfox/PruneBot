require ('dotenv').config()
const Discord = require("discord.js");
const client = new Discord.Client();
//const config = require("./config.json");
const config = process.env;
const talkedRecently = new Set();


client.on("ready", () => {
  console.log("Online!");
  client.user.setStatus("online");
  //client.user.setActivity('this server.', { type: 'WATCHING' }); 
  client.user.setActivity('your mom.', { type: 'PLAYING' }); 
});

client.on("error", error => {
console.log(error)
});

client.awaitReply = async (message, question, limit = 15000, embed = {}) => {
  const filter = m => m.author.id === message.author.id;
  await message.channel.send(question, { embed });
  try {
  const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
    return collected.first().content;
  } catch (error) {
    client.logger.error(error);
    return false;
  }
};

//cache all the data
  client.on('message', async message => {
  if (message.content.toLowerCase().startsWith(config.prefix + "fetch")) {
    message.reply('Updating the user datas...');    
    message.guild.members.fetch()
    .then(console.log)
    message.reply('The data in cache has been updated!')  
    .catch(console.error);    
  }

//role count and list
  if (message.content.toLowerCase().startsWith(config.prefix + "roles")) {
    message.guild.members.fetch()
    let rolemap = message.guild.roles.cache
    .sort((a, b) => b.position - a.position)
    .map(r => r)
    .join(",");
    if (rolemap.length > 1024) rolemap = "To many roles to display";
    if (!rolemap) rolemap = "No roles";
    const rolesembed = new Discord.MessageEmbed()
    .setTitle('Prune Bot | Sever Roles')   
    .setDescription("")
    .addField("Role List:" , rolemap, true)   
    .addField("Total Roles:", `${message.guild.roles.cache.size}` , true)     
    message.channel.send(rolesembed);
  }

//help
  if (message.content.toLowerCase().startsWith(config.prefix + "help")) {
    const ListEmbed = new Discord.MessageEmbed() 
    .setColor('#0099ff')
    .setTitle('Commands & Information')
    .setURL('https://discord.gg/mMJ7ea229A')
    .setAuthor('Prune Bot', 'https://i.imgur.com/HsHPRgv.jpg', 'https://www.facebook.com/Mashwishi')
    .setDescription('')
    .setThumbnail('https://i.imgur.com/LYdziyV.gif')
    .addFields(
      { name: '!help', value: 'To show all of the available bot commands.' },
      { name: '!fetch', value: 'To fetch/update all the data cache.' },
      { name: '!krole <role>', value: 'Kick all the users to the specific role.' },
      { name: '!urole <role>', value: 'List all the users with the mentioned role.' },       
      { name: '!knorole', value: 'Kick all the users without role.' },
      { name: '!unorole', value: 'List all the users without role.' },          
      { name: '!roles', value: 'List and count all the roles in the server.' },
      { name: '!roleid <role>', value: 'Print the Role ID of the specific role.' },
      { name: '[Soon] !prune <day(s)> <role>', value: 'Kick inactive users with the specific day(s) and role.'},          
      { name: '!shutdown', value: 'Shutdown the discord bot.' }, 
      //{ name: '\u200B', value: '\u200B' },
      //{ name: 'Inline field title', value: 'Some value here', inline: true },
      //{ name: 'Inline field title', value: 'Some value here', inline: true },
    )
    .setImage('')
    .setTimestamp()
    .setFooter('PruneBot is created by Mashwishi', 'https://i.imgur.com/qB9jJZ3.png');

  message.channel.send(ListEmbed);     
  }    

//shutdown
  if (message.content.toLowerCase().startsWith(config.prefix + "shutdown")) {
      message.reply('The bot will now shut down.\n'+ 'Confirm with a thumb up or deny with a thumb down.');
      
      // Reacts so the user only have to click the emojis
        message.react('👍').then(r => {
        message.react('👎');
        });

      // First argument is a filter function
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
      { max: 1, time: 30000 }).then(collected => {
            if (collected.first().emoji.name == '👍') {
                    message.reply('Shutting down...');
                    client.destroy();
            }
            else
                    message.reply('Operation canceled.');
        }).catch(() => {
            message.reply('No reaction after 30 seconds, operation canceled');
        });
  }  


//role mention to role id
  if (message.content.toLowerCase().startsWith(config.prefix + "roleid")) {

    let mentionedrole = message.mentions.roles.firstKey()
    const withoutPrefix = message.content.slice(config.prefix.length);
    const split = withoutPrefix.split(/ +/);
    const command = split[0];
    const args = split.slice(1);
    let id = args[0];

    if (!args.length){
      return message.channel.send(` ${message.author}, please kindly input a role!`);
    }
    else if (!id.startsWith('<@&') && id.endsWith('>')) {
      return message.channel.send(` ${message.author}, You didn't mention a role!`);
    }
    message.channel.send(`Role ID: `+ mentionedrole);
}



//kick all users with the specific role
  if (message.content.toLowerCase().startsWith(config.prefix + "krole")) {
    
    let mentionedrole = message.mentions.roles.firstKey()
    const withoutPrefix = message.content.slice(config.prefix.length);
    const split = withoutPrefix.split(/ +/);
    const command = split[0];
    const args = split.slice(1);
    let id = args[0];

    if (!args.length){
      return message.channel.send(` ${message.author}, please kindly input a role!`);
    }
    else if (!id.startsWith('<@&') && id.endsWith('>')) {
      return message.channel.send(` ${message.author}, You didn't mention a role!`);
    }
    //[view the id before deleting] message.channel.send(`Role ID: `+ mentionedrole);
        //gather the latest data first
        message.guild.members.fetch()
        //count members will be kicked
        var memberscount = message.guild.roles.cache.get(mentionedrole).members.size;
        message.reply('The bot will kick ('+ memberscount +') users from ' + `<@&`+mentionedrole+`>` + ' role.\n'+ 'Confirm with a thumb up or deny with a thumb down.')    
          message.react('👍').then(r => {
          message.react('👎');
          });
        // confirmation of the task
        message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
        { max: 1, time: 30000 }).then(collected => {
              if (collected.first().emoji.name == '👍') {
                      message.reply('Kicking the members...');
                      let members = message.guild.roles.cache.get(mentionedrole).members
                      members.forEach(m => {
                        m.kick()
                        .catch(console.error);
                      });
              }
              else
                      message.reply('Operation canceled.');
          }).catch(() => {
              message.reply('No reaction after 30 seconds, operation canceled');
          });
  }


//list of users that has the specific role
  if (message.content.toLowerCase().startsWith(config.prefix + "urole")) {

    //gather latest data
    message.guild.members.fetch()

    let mentionedrole = message.mentions.roles.firstKey()
    const withoutPrefix = message.content.slice(config.prefix.length);
    const split = withoutPrefix.split(/ +/);
    const command = split[0];
    const args = split.slice(1);
    let id = args[0];

    if (!args.length){
      return message.channel.send(` ${message.author}, please kindly input a role!`);
    }
    else if (!id.startsWith('<@&') && id.endsWith('>')) {
      return message.channel.send(` ${message.author}, You didn't mention a role!`);
    }
    //[view the id before deleting] message.channel.send(`Role ID: `+ mentionedrole);
        
        //display the gathered data of users
        const therole = message.guild.roles.cache.find(role => role.id == mentionedrole);
          const ListEmbed = new Discord.MessageEmbed() 
          .setTitle(`Prune Bot | Users`)
          .setDescription(`Users that has ${therole} role.`)
          .setColor('#0099ff')
          .addFields(
            { name: 'Users:', value: message.guild.roles.cache.get(mentionedrole).members.map(m=>m.user.tag).join('\n') },)
          .setFooter('PruneBot is created by Mashwishi', 'https://i.imgur.com/qB9jJZ3.png');
        message.channel.send(ListEmbed);    
  }

//list of users without role
if (message.content.toLowerCase().startsWith(config.prefix + "unorole")) {

      //gather latest data
      message.guild.members.fetch()
        
      var memberscount = message.guild.members.cache.filter(member => member.roles.cache.array().length < 2).size;

        if (memberscount == 0){
        message.reply('Looks like everyone has a role already.') 
        }
        else{  
        const ListEmbed = new Discord.MessageEmbed() 
        .setTitle(`Prune Bot | Users`)
        .setDescription(`Users that has no role.`)
        .setColor('#0099ff')
        .addFields(
         { name: 'Users:', value: message.guild.members.cache.filter(member => member.roles.cache.array().length < 2).map(member => member.user.tag).join('\n') },)
        .setFooter('PruneBot is created by Mashwishi', 'https://i.imgur.com/qB9jJZ3.png');
      message.channel.send(ListEmbed);   
        } 
}


//kick all users without role
if (message.content.toLowerCase().startsWith(config.prefix + "knorole")) {
    
      //gather the latest data first
      message.guild.members.fetch()
      //count members will be kicked
      var memberscount = message.guild.members.cache.filter(member => member.roles.cache.array().length < 2).size;

      if (memberscount == 0){
        message.reply('Looks like everyone has a role already.') 
      }
      else{
      message.reply('The bot will kick ('+ memberscount +') users without a role.\n'+ 'Confirm with a thumb up or deny with a thumb down.')    
        message.react('👍').then(r => {
        message.react('👎');
        });
      // confirmation of the task
      message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
      { max: 1, time: 30000 }).then(collected => {
            if (collected.first().emoji.name == '👍') {
                    let members = message.guild.members.cache.filter(member => member.roles.cache.array().length < 2)
                    members.forEach(m => {
                      m.kick()
                      .catch(console.error);
                    });               
                    message.reply('Done! ('+ memberscount +') users without roles has been kicked.'); 
            }
            else
                    message.reply('Operation canceled.');
        }).catch(() => {
            message.reply('No reaction after 30 seconds, operation canceled');
        });
      }
}



//prune
if (message.content.toLowerCase().startsWith(config.prefix + "prune")) {
    
        message.reply(`I'm currently not available :(`);

}

});

client.login(process.env.token);