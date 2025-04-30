import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class BotService implements OnModuleInit {
    public client: Client;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers, // Intent crítico
                GatewayIntentBits.GuildMessages,
            ],
        });
    }

    async onModuleInit() {
        await this.login();
        this.setupEvents();
    }

    private async login() {
        await this.client.login(process.env.DISCORD_TOKEN);
        console.log('✅ XMEN conectado');
    }

    private setupEvents() {
        this.client.on('ready', () => {
            console.log(`🟢 Bot listo como ${this.client.user?.tag}`);
        });
    }
}