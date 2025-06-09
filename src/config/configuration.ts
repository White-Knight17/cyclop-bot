export default () => ({
    discord: {
        token: process.env.DISCORD_TOKEN || '',
        intents: [
            'Guilds',
            'GuildMessages',
            'GuildMembers',
            'MessageContent',
            'GuildPresences',
            'GuildVoiceStates',
        ]
    },
    MONGO_DB_URI: process.env.MONGO_URI,
    twitch: {
        clientId: process.env.TWITCH_CLIENT_ID || '',
        clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
    }
})