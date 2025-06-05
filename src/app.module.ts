import { Module } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './discord/providers/discord.service';
import { SharedModulesModule } from './features/shared-modules.module';
import { AutoRoleModule } from './features/autorole/autorole.module';
import { ActivitiesModule } from './features/activities/activities.module';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
      isGlobal: true
    }),
    SharedModulesModule,
    AutoRoleModule,
    DiscordModule,
    ActivitiesModule,
  ],
  providers: [DiscordService], // Uso corregido
})
export class AppModule { }