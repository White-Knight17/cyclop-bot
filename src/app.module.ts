import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { GuildMemberAddEvent } from './events/guild-member-add';
import { WelcomeModule } from './welcome/welcome.module';

@Module({
  imports: [BotModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), WelcomeModule],
  controllers: [],
  providers: [GuildMemberAddEvent],
})
export class AppModule { }
