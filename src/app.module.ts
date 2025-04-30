import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { GuildMemberAddEvent } from './events/guild-member-add';

@Module({
  imports: [BotModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),],
  controllers: [],
  providers: [GuildMemberAddEvent],
})
export class AppModule { }
