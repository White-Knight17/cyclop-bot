import { Module } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './discord/providers/discord.service'; // Ruta corregida
import { SharedModulesModule } from './shared-modules.module';
import configuration from './config/configuration';
import { AutoRoleModule } from './features/autorole/autorole.module';
import { ActivitiesModule } from './features/activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
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