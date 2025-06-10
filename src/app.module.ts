import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscordModule } from './discord/discord.module';
import { CommonModule } from './common/common.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SharedModulesModule } from './features/shared-modules.module';
import { AutoRoleModule } from './features/autorole/autorole.module';
import { WelcomeModule } from './features/welcome/welcome.module';
import { LevelingModule } from './features/leveling/leveling.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_DB_URI');
        if (!uri) {
          throw new Error('MONGO_DB_URI no está configurada en las variables de entorno');
        }
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true
        };
      },
      inject: [ConfigService]
    }),
    EventEmitterModule.forRoot(),
    CommonModule,
    SharedModulesModule,
    AutoRoleModule,
    WelcomeModule,
    LevelingModule,
    DiscordModule
  ]
})
export class AppModule { }