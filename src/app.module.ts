import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    CommonModule,
    SharedModulesModule,
    AutoRoleModule,
    WelcomeModule,
    LevelingModule,
    DiscordModule,
  ],
})
export class AppModule {}
