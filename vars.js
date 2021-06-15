const Discord = require('discord.js')
const axios = require('axios')

module.exports = {
    name: 'vars',
    admin: false,
    description: 'This command will give you the variants of a given shopify link',
    async execute(client, message, args, Discord) {
        const embed = new Discord.MessageEmbed()
        if (message.content.split(' ').length == 2) {
            let url = message.content.split(' ')[1]
            axios.get(`${url}.json`)
                .then((response) => {
                    if (response.data.product.variants) {
                        const { product } = response.data
                        let taj = Array()
                        let sizes = Array()
                        let stock = Array()
                        let totalStock = 0
                        embed.setTitle(product.title)
                        embed.setURL(url)
                        embed.setThumbnail(product.images[0].src)
                        product.variants.forEach((variant) => {
                            
                            taj.push(variant.id)
                            sizes.push(variant.title)
                            if (url.includes("shoepalace")) {
                                var itemStock = variant.old_inventory_quantity
                                var stockFormatted = itemStock.toString().replace("-","")
                                stock.push(stockFormatted)
                                totalStock+=parseInt(stockFormatted)
                            }



                        })
                        let stocklist = stock.join('\n') 
                        let formatted = taj.join('\n')
                        let formattedSizes = sizes.join('\n')
                        embed.addField('Sizes', formattedSizes, true)
                        embed.addField('Variants', formatted, true)
                        if (url.includes("shoepalace")) {
                            embed.addField('Stock', stocklist, true)
                            embed.addField('Total Stock', "`" + totalStock + "`", true)
                        }
                        embed.setColor('#9bd4ff')
                        embed.setAuthor('SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                        embed.setFooter('Shopify Variants by SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')          
                        message.channel.send(embed)
                        console.log('Variants found!')
                    }
                    else {
                        embed.setTitle('Error')
                        embed.setDescription('No variants found')
                        embed.setColor('#9bd4ff')
                        embed.setAuthor('SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                        embed.setFooter('Shopify Variants by SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                        message.channel.send(embed)
                    }
                }, (error) => {
                    embed.setTitle('Error')
                    embed.setDescription('There was an error with the shopify API. Please try again later.')
                    embed.setColor('#9bd4ff')
                    embed.setAuthor('SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                    embed.setFooter('Shopify Variants by SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                    message.channel.send(embed)
                })
        }
        else {
            embed.setTitle('Error')
            embed.setDescription('Incorrect amount of parameters. Expected: `2`')
            embed.setColor('#9bd4ff')
            embed.setAuthor('SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
            embed.setFooter('Shopify Variants by SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
            message.channel.send(embed)
        }
    }
}
