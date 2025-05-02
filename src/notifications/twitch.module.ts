import { Module } from '@nestjs/common';
import { TwitchService } from './twitch.service';
import { BotModule } from 'src/bot/bot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule, BotModule], // Usa BotModule en lugar de DiscordClientModule
    providers: [TwitchService],
    exports: [TwitchService],
})
export class TwitchModule { }