const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');


const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const TOKEN = config.TOKEN;
const PREFIX = config.PREFIX;
const KOMUTLAR = config.KOMUTLAR;
const { MIN_XP_KAZANCI, MAX_XP_KAZANCI, SEVIYE_CARPANI } = config.XP_AYARLARI;
const { SEVIYE_ATLANDI, LEVEL_ACILDI, LEVEL_KAPANDI, KANAL_AYARLANDI, YETKI_YOK, KANAL_BULUNAMADI, KULLANICI_BULUNAMADI } = config.MESAJLAR;

const dbPath = path.join(__dirname, 'database.json');

function readDatabase() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { settings: {}, users: {} }; 
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Veritabanı yazma hatası:', error.message);
    }
}

const requiredXp = (level) => (level + 1) * SEVIYE_CARPANI; 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, 
    ]
});

client.on('ready', () => {
    console.log(`Bot Hazır! Giriş yapıldı: ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot || !message.guild) return;

    const db = readDatabase();
    const guildId = message.guild.id;

    if (!db.settings[guildId]) {
        db.settings[guildId] = {
            levelChannelId: null,
            isLevelSystemEnabled: true
        };
        writeDatabase(db);
    }
    
    const serverSettings = db.settings[guildId];

    if (message.content.startsWith(PREFIX)) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === KOMUTLAR.YARDIM) {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('🤖 Seviye Botu Yardım Komutları')
                .setDescription(`Tüm komutlar \`${PREFIX}\` ön eki ile başlar.`)
                .addFields(
                    { name: '⚙️ YÖNETİCİ KOMUTLARI', value: 
                        `\`${PREFIX}${KOMUTLAR.SEVIYE_SISTEMI}\`: Seviye sistemini açar/kapatır.\n` +
                        `\`${PREFIX}${KOMUTLAR.SEVIYE_KANALI_AYARLA} #kanal\`: Seviye atlama kanalını ayarlar.`, 
                      inline: false 
                    },
                    { name: '✨ KULLANICI KOMUTLARI', value: 
                        `\`${PREFIX}${KOMUTLAR.RANK}\`: Mevcut seviyenizi ve XP'nizi gösterir.\n` +
                        `\`${PREFIX}${KOMUTLAR.YARDIM}\`: Bu yardım mesajını gösterir.`, 
                      inline: false 
                    }
                )
                .setFooter({ text: 'Noise Development Altyapısı' });

            return message.channel.send({ embeds: [embed] });
        }

        if (command === KOMUTLAR.SEVIYE_SISTEMI) {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.channel.send(YETKI_YOK);
            }

            serverSettings.isLevelSystemEnabled = !serverSettings.isLevelSystemEnabled;
            writeDatabase(db);

            const response = serverSettings.isLevelSystemEnabled ? LEVEL_ACILDI : LEVEL_KAPANDI;
            return message.channel.send(response);
        }

        if (command === KOMUTLAR.SEVIYE_KANALI_AYARLA) {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.channel.send(YETKI_YOK);
            }

            const channelMention = args[0];
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(channelMention);

            if (!channel || channel.type !== 0) { 
                return message.channel.send(KANAL_BULUNAMADI);
            }

            serverSettings.levelChannelId = channel.id;
            writeDatabase(db);

            const response = KANAL_AYARLANDI.replace('{channel}', channel);
            return message.channel.send(response);
        }

        if (command === KOMUTLAR.RANK) {
            const targetUser = message.mentions.users.first() || message.author;
            const userKey = `${targetUser.id}-${guildId}`;
            
            const user = db.users[userKey];

            if (!user) {
                return message.channel.send(KULLANICI_BULUNAMADI);
            }

            const currentLevel = user.level;
            const currentXp = user.xp;
            const nextLevelXp = requiredXp(currentLevel);
            const progress = (currentXp / nextLevelXp) * 100;

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({ name: targetUser.tag, iconURL: targetUser.displayAvatarURL() })
                .setTitle('⭐ Seviye Bilgisi')
                .addFields(
                    { name: 'Mevcut Seviye', value: `**${currentLevel}**`, inline: true },
                    { name: 'Mevcut XP', value: `${currentXp} / ${nextLevelXp}`, inline: true },
                    { name: 'İlerleme', value: `\`%${progress.toFixed(2)}\``, inline: false }
                )
                .setFooter({ text: 'Daha fazla mesaj atarak seviye atla!' });

            return message.channel.send({ embeds: [embed] });
        }

        return; 
    }

    if (!serverSettings.isLevelSystemEnabled) return;

    const xpDifference = MAX_XP_KAZANCI - MIN_XP_KAZANCI;
    const xpToGive = Math.floor(Math.random() * (xpDifference + 1)) + MIN_XP_KAZANCI;

    const userKey = `${message.author.id}-${guildId}`;

    if (!db.users[userKey]) {
        db.users[userKey] = {
            level: 0,
            xp: 0
        };
    }

    const user = db.users[userKey];

    const xpNeededForNextLevel = requiredXp(user.level); 

    user.xp += xpToGive;

    if (user.xp >= xpNeededForNextLevel) {
        user.level++; 
        user.xp -= xpNeededForNextLevel; 
        
        const levelUpMessage = SEVIYE_ATLANDI
            .replace('{user}', message.author)
            .replace('{level}', user.level);

        const targetChannel = serverSettings.levelChannelId 
            ? message.guild.channels.cache.get(serverSettings.levelChannelId) 
            : message.channel;

        if (targetChannel) {
            targetChannel.send(levelUpMessage);
        }
    }

    writeDatabase(db);
});

client.login(TOKEN);
