require ('dotenv').config()
const Discord = require('discord.js');
const usedCommand = new Set();
const config = process.env;

module.exports.run = async (bot, message, args) => {
    if(usedCommand.has(message.author.id)){
        message.reply("You cannot use " + config.prefix + "prole command beacuse of the cooldown.")
    } else {
           
            if(!message.member.hasPermission("ADMINISTRATOR")){
              return message.reply("You don't have `ADMINISTRATOR` permission to do that!");
            }      
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
               
                 
                  const therole = message.guild.roles.cache.find(role => role.id == mentionedrole); 
                  var memberscount = message.guild.roles.cache.get(mentionedrole).members.size;             
                  
                  const ListEmbed = new Discord.MessageEmbed() 
                  .setTitle('Prune Bot | Total of '+ memberscount +' User(s)')
                  .setDescription(`Users that has ${therole} role:  \n` + getUsers(page))
                  .setAuthor('Join our Discord Server', 'https://i.imgur.com/hKeHeEy.gif', 'https://discord.io/LIMYAW')
                  .setThumbnail('https://i.imgur.com/ypxq7B9.png')
                  .setColor('#b491c8')                  
                  .setFooter('| ◀️ Back | ▶️ Next | 👍 Confirm | 👎 Cancel', 'https://i.imgur.com/DxWDaGv.png');
                  var listMsg = await message.channel.send(ListEmbed); 
                      var page = parseInt(args[0]);
                      if (!page) {
                          page = 1;
                      };
                      await listMsg.react("◀️");
                      await listMsg.react("▶️");
                      await listMsg.react("👍");
                        await listMsg.react("👎");
                      const filter = (reaction, user) => ["◀️", "▶️", "👍","👎"].includes(reaction.emoji.name) && user.id === message.author.id;
                      const collector = listMsg.createReactionCollector(filter, {
                          time: 120000
                      });
                      collector.on('collect', (reaction, user) => {
                          reaction.emoji.reaction.users.remove(user.id);
                          switch (reaction.emoji.name) {
                              case "◀️":
                                  --page;
                                  if (page < 1) {
                                      page = 1;
                                  };
                                  const newlistMsga = new Discord.MessageEmbed()
                                  .setTitle('Prune Bot | Total of '+ memberscount +' User(s)')
                                  .setDescription(`Users that has ${therole} role: \n` + getUsers(page))
                                  .setAuthor('Join our Discord Server', 'https://i.imgur.com/hKeHeEy.gif', 'https://discord.io/LIMYAW')
                                  .setThumbnail('https://i.imgur.com/ypxq7B9.png')                                  
                                  .setColor('#b491c8')                                        
                                  .setFooter('| ◀️ Back | ▶️ Next | 👍 Confirm | 👎 Cancel', 'https://i.imgur.com/DxWDaGv.png');
                                  listMsg.edit(newlistMsga);
                                  break;
                              case "▶️":
                                
                                  ++page;
                                  const newlistMsgb = new Discord.MessageEmbed()
                                  .setTitle('Prune Bot | Total of '+ memberscount +' User(s)')
                                  .setDescription(`Users that has ${therole} role: \n` + getUsers(page))
                                  .setAuthor('Join our Discord Server', 'https://i.imgur.com/hKeHeEy.gif', 'https://discord.io/LIMYAW')
                                  .setThumbnail('https://i.imgur.com/ypxq7B9.png')                                  
                                  .setColor('#b491c8')                                      
                                  .setFooter('| ◀️ Back | ▶️ Next | 👍 Confirm | 👎 Cancel', 'https://i.imgur.com/DxWDaGv.png');                                                                   
                                  listMsg.edit(newlistMsgb);
                                  break;
                              case "👍":
                                                                
                                guild.members.prune({ days: 0, roles: [mentionedrole] })
                                .then(pruned => console.log(`I just pruned ${pruned} people!`))
                                .catch(console.error);

                                const ukicked = new Discord.MessageEmbed()                 
                                .setTitle('Prune Bot | Total of '+ memberscount +' User(s)')
                                .setDescription(`Users that has ${therole} role.`)
                                .setAuthor('Join our Discord Server', 'https://i.imgur.com/hKeHeEy.gif', 'https://discord.io/LIMYAW')
                                .setThumbnail('https://i.imgur.com/ypxq7B9.png')                        
                                .setColor('#b491c8')      
                                .addFields(
                                  { name: 'Operation Successful', value: `I just pruned ${pruned} user(s)!`} 
                                )                                         
                                .setFooter('PruneBot is created by Mashwishi', 'https://i.imgur.com/DxWDaGv.png');
                                
                                    listMsg.reactions.removeAll();
                                    listMsg.edit(ukicked);
                                    
                                  break;     
                              case "👎":
                                const cancel = new Discord.MessageEmbed()                 
                                .setTitle('Prune Bot | Total of '+ memberscount +' User(s)')
                                .setDescription(`Users that has ${therole} role.`)
                                .setAuthor('Join our Discord Server', 'https://i.imgur.com/hKeHeEy.gif', 'https://discord.io/LIMYAW')
                                .setThumbnail('https://i.imgur.com/ypxq7B9.png')                        
                                .setColor('#b491c8')      
                                .addFields(
                                  { name: 'Operation Cancelled', value: "No users has been kicked."} 
                                )                                         
                                .setFooter('PruneBot is created by Mashwishi', 'https://i.imgur.com/DxWDaGv.png');   
                                  
                                  listMsg.reactions.removeAll();
                                  listMsg.edit(cancel);
                                  break;                                                                 
                          };
                      });
                      collector.on('end', collected => {
                     
                        const done = new Discord.MessageEmbed()                 
                        .setTitle('Prune Bot | Total of '+ memberscount +' User(s)')
                        .setDescription(`Users that has ${therole} role.`)
                        .setAuthor('Join our Discord Server', 'https://i.imgur.com/hKeHeEy.gif', 'https://discord.io/LIMYAW')
                        .setThumbnail('https://i.imgur.com/ypxq7B9.png')                        
                        .setColor('#b491c8')      
                        .addFields(
                          { name: 'Reaction Timeout', value: "I'm done looking for reactions on the message!"} 
                        )                                         
                        .setFooter('PruneBot is created by Mashwishi', 'https://i.imgur.com/DxWDaGv.png');   
                          
                          listMsg.reactions.removeAll();
                          listMsg.edit(done);
                      });
                      function getUsers(n) {
                          const list = message.guild.roles.cache.get(mentionedrole).members.map(m => m.user.tag);
                          
                          var pageNum = (n * 10) - 10;
                          if (!pageNum) {
                              pageNum = 0;
                          };
                          return list.slice(pageNum, pageNum + 9).join("\n");
                      };


        usedCommand.add(message.author.id);
        setTimeout(() => {
            usedCommand.delete(message.author.id);
        }, 5000); 
    }
}

module.exports.config = {
    name: "prole",
    description: "",
    usage: "?prole",
    accessableby: "Admins",
    aliases: []
}