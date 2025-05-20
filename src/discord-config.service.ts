import { Injectable } from '@nestjs/common';
import { NecordModuleOptions } from 'necord';
import { IntentsBitField } from 'discord.js';

@Injectable()
export class NecordConfigService {
    createNecordOptions(): NecordModuleOptions {
        return {
            token: 'DISCORD_TOKEN',
            intents: []
        };
    }
}