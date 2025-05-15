import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ActivityModule } from './activity/activity.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://germangiorgio1998:KingOfFighters1379@germandb.mgvn12a.mongodb.net/'),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    BotModule, ActivityModule, RoleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
