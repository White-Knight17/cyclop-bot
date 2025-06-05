import { Injectable } from '@nestjs/common';
import { NecordModuleOptions } from 'necord';

@Injectable()
export class NecordConfigService {
    createNecordOptions(): NecordModuleOptions {
        return {
            token: process.env.DISCORD_TOKEN || '',
            intents: []
        };
    }
}