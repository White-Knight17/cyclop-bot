// config/configuration.ts
export default () => ({
    discord: {
        token: process.env.DISCORD_TOKEN,
        clientId: process.env.DISCORD_CLIENT_ID,
        guildId: process.env.DISCORD_GUILD_ID, // Opcional para desarrollo
    },
    database: {
        uri: process.env.MONGO_URI,
    },
});