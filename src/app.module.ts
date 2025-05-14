import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { GuildMemberAddEvent } from './events/guild-member-add';
import { WelcomeModule } from './welcome/welcome.module';
import { TwitchModule } from './notifications/twitch/twitch.module';

@Module({
  imports: [BotModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), WelcomeModule, TwitchModule],
  controllers: [],
  providers: [GuildMemberAddEvent],
})
export class AppModule { }
