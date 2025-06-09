import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TwitchService } from './twitch.service';
import { TwitchRepository } from 'src/database/repositories/twitch.repository';
import { TwitchConfig, TwitchSchema } from 'src/database/schemas/twitch.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            { name: TwitchConfig.name, schema: TwitchSchema },
        ]),
    ],
    providers: [TwitchService, TwitchRepository],
    exports: [TwitchService],
})
export class TwitchModule { } 