const Discord = require('discord.js')
const axios = require('axios')

module.exports = {
    name: 'vars',
    admin: false,
    description: 'This command will give you the variants of a given shopify link',
    async execute(client, message, args, Discord) {
        // Start of the embed
        const embed = new Discord.MessageEmbed()
        // This takes whatever text comes after the .vars (code below checks if it's a valid URL)
        if (message.content.split(' ').length == 2) {
            let url = message.content.split(' ')[1]
            // Axios takes the URL and adds .json to the end of the URL
            axios.get(`${url}.json`)
                .then((response) => {
                    if (response.data.product.variants) {
                        const { product } = response.data
                        // These array's take the variants, sizes, and stock (if loaded) and puts them into a list. taj stands for variants since he helped code this.
                        let taj = Array()
                        let sizes = Array()
                        let stock = Array()
                        let totalStock = 0
                        // Now we start creating the actual embed and how we want it to look
                        embed.setTitle(product.title)
                        embed.setURL(url)
                        // This grabs the first loaded image of the URL and uses that at the thumbnail image
                        embed.setThumbnail(product.images[0].src)
                        // Here is how we split the sizes, variants, and stock
                        product.variants.forEach((variant) => {
                            
                            taj.push(variant.id)
                            sizes.push(variant.title)
                            // Now since ShoePalace includes stock in the .json code, we can add the loaded stock for the URL.
                            if (url.includes("shoepalace")) {
                                var itemStock = variant.old_inventory_quantity
                                // Since they put a "-" before the stock we need to remove it to make the embed look cleaner. 
                                var stockFormatted = itemStock.toString().replace("-","")
                                stock.push(stockFormatted)
                                totalStock+=parseInt(stockFormatted)
                            }



                        })
                        // Let's add it all together and format it into the embed
                        let stocklist = stock.join('\n') 
                        let formatted = taj.join('\n')
                        let formattedSizes = sizes.join('\n')
                        embed.addField('Sizes', formattedSizes, true)
                        embed.addField('Variants', formatted, true)
                        // Additional ShoePalace code for the stock
                        if (url.includes("shoepalace")) {
                            embed.addField('Stock', stocklist, true)
                            embed.addField('Total Stock', "`" + totalStock + "`", true)
                        }
                        // Making the embed look nicer, make sure to edit my images and color out and put your own!
                        embed.setColor('#9bd4ff')
                        embed.setAuthor('SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                        embed.setFooter('Shopify Variants by SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')          
                        message.channel.send(embed)
                        console.log('Variants found!')
                    }
                    // Setting up the command to deal with errors so it doesn't break
                    else {
                        embed.setTitle('Error')
                        embed.setDescription('No variants found')
                        embed.setColor('#9bd4ff')
                        embed.setAuthor('SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                        embed.setFooter('Shopify Variants by SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                        message.channel.send(embed)
                    }
                    // This happens the most when anti-bot is up, you usually need to wait a few seconds for variants to be returned.
                }, (error) => {
                    embed.setTitle('Error')
                    embed.setDescription('There was an error with the shopify API. Please try again later.')
                    embed.setColor('#9bd4ff')
                    embed.setAuthor('SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                    embed.setFooter('Shopify Variants by SnowIO', 'https://media.discordapp.net/attachments/805238476018155530/826651221493547008/SnowServicesLogo-removebg-preview.png')
                    message.channel.send(embed)
                })
        }
        // If the wrong input is put into the command, this embed will be returned.
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
