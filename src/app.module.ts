import { Module } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './discord/providers/discord.service'; // Ruta corregida
import { SharedModulesModule } from './shared-modules.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    SharedModulesModule,
    DiscordModule,
  ],
  providers: [DiscordService], // Uso corregido
})
export class AppModule { }