import { Injectable, Logger } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService {
    private readonly logger = new Logger(BotService.name);
    public client: Client;

    constructor(private config: ConfigService) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
            ],
        });

        this.setupEvents();
        this.login();
    }

    private login() {
        this.client.login(this.config.get('DISCORD_TOKEN'))
            .then(() => this.logger.log('Cayendo en accion X-MEN!!'))
            .catch(err => this.logger.error('Error de conexión', err));
    }

    private setupEvents() {
        this.client.on('ready', () => {
            this.logger.log(`Aquí presentando-me  ${this.client.user?.tag}`);
        });
    }
}