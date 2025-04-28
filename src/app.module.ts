import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { BotService } from './bot/bot.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BotModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  controllers: [AppController],
  providers: [AppService, BotService],
})
export class AppModule { }
