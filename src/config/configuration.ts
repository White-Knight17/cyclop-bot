import { registerAs } from '@nestjs/config';

export interface DiscordConfig {
  token: string;
  intents: string[];
  clientId?: string;
  guildId?: string;
}

export interface TwitchConfig {
  clientId: string;
  clientSecret: string;
}

export interface DatabaseConfig {
  uri: string;
  options?: {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
  };
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  allowedOrigins?: string[];
}

export default registerAs('app', () => ({
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    intents: [
      'Guilds',
      'GuildMessages',
      'GuildMembers',
      'MessageContent',
      'GuildPresences',
      'GuildVoiceStates',
    ],
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
  } as DiscordConfig,

  database: {
    uri: process.env.MONGO_URI || process.env.MONGODB_URI || '',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  } as DatabaseConfig,

  twitch: {
    clientId: process.env.TWITCH_CLIENT_ID || '',
    clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
  } as TwitchConfig,

  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  } as AppConfig,
}));
