import { Injectable } from '@nestjs/common';
import { SlashCommand, Context, SlashCommandContext, Options, Subcommand } from 'necord';
import { TwitchService } from 'src/features/twitch/twitch.service';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ChannelOption, StringOption, BooleanOption } from 'necord';
import { TextChannel, EmbedBuilder } from 'discord.js';

class TwitchChannelDto {
  @ChannelOption({
    name: 'channel',
    description: 'Canal para notificaciones de Twitch',
    required: true,
  })
  channel: TextChannel;
}

class TwitchStreamerDto {
  @StringOption({
    name: 'streamer',
    description: 'Nombre del streamer de Twitch',
    required: true,
  })
  streamer: string;
}

class TwitchSettingsDto {
  @BooleanOption({
    name: 'enabled',
    description: 'Activar/desactivar notificaciones',
    required: false,
  })
  enabled?: boolean;

  @BooleanOption({
    name: 'notify_live',
    description: 'Notificar cuando el streamer va en vivo',
    required: false,
  })
  notifyLive?: boolean;

  @BooleanOption({
    name: 'notify_offline',
    description: 'Notificar cuando el streamer se desconecta',
    required: false,
  })
  notifyOffline?: boolean;

  @StringOption({
    name: 'message',
    description: 'Mensaje personalizado para las notificaciones',
    required: false,
  })
  customMessage?: string;
}

@Injectable()
@UseGuards(AdminGuard)
@SlashCommand({
  name: 'twitch',
  description: 'Configuración de notificaciones de Twitch',
  defaultMemberPermissions: ['ManageGuild'],
})
export class TwitchCommand {
  constructor(private readonly twitchService: TwitchService) {}

  @Subcommand({
    name: 'channel',
    description: 'Configura el canal de notificaciones',
  })
  async setChannel(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: TwitchChannelDto
  ) {
    if (!interaction.guildId) {
      return interaction.reply({
        content: '❌ Este comando solo puede usarse en un servidor',
        ephemeral: true,
      });
    }

    try {
      await this.twitchService.setNotificationChannel(interaction.guildId, channel.id);

      return interaction.reply({
        content: `✅ Canal de notificaciones configurado en ${channel.toString()}`,
        ephemeral: true,
      });
    } catch (error) {
      return interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }

  @Subcommand({
    name: 'add',
    description: 'Agrega un streamer para seguir',
  })
  async addStreamer(
    @Context() [interaction]: SlashCommandContext,
    @Options() { streamer }: TwitchStreamerDto
  ) {
    if (!interaction.guildId) {
      return interaction.reply({
        content: '❌ Este comando solo puede usarse en un servidor',
        ephemeral: true,
      });
    }

    try {
      await this.twitchService.addStreamer(interaction.guildId, streamer);
      return interaction.reply({
        content: `✅ Streamer ${streamer} agregado correctamente`,
        ephemeral: true,
      });
    } catch (error) {
      return interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }

  @Subcommand({
    name: 'remove',
    description: 'Elimina un streamer de la lista',
  })
  async removeStreamer(
    @Context() [interaction]: SlashCommandContext,
    @Options() { streamer }: TwitchStreamerDto
  ) {
    if (!interaction.guildId) {
      return interaction.reply({
        content: '❌ Este comando solo puede usarse en un servidor',
        ephemeral: true,
      });
    }

    try {
      await this.twitchService.removeStreamer(interaction.guildId, streamer);
      return interaction.reply({
        content: `✅ Streamer ${streamer} eliminado correctamente`,
        ephemeral: true,
      });
    } catch (error) {
      return interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }

  @Subcommand({
    name: 'settings',
    description: 'Configura las opciones de notificación',
  })
  async updateSettings(
    @Context() [interaction]: SlashCommandContext,
    @Options() settings: TwitchSettingsDto
  ) {
    if (!interaction.guildId) {
      return interaction.reply({
        content: '❌ Este comando solo puede usarse en un servidor',
        ephemeral: true,
      });
    }

    try {
      await this.twitchService.updateSettings(interaction.guildId, settings);
      return interaction.reply({
        content: '✅ Configuración actualizada correctamente',
        ephemeral: true,
      });
    } catch (error) {
      return interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }

  @Subcommand({
    name: 'test',
    description: 'Prueba la notificación de Twitch',
  })
  async testNotification(@Context() [interaction]: SlashCommandContext) {
    if (!interaction.guildId || !interaction.guild) {
      return interaction.reply({
        content: '❌ Este comando solo puede usarse en un servidor',
        ephemeral: true,
      });
    }

    try {
      const config = await this.twitchService.repository.getOrCreate(interaction.guildId);
      const channel = (await interaction.guild.channels.fetch(config.channelId)) as TextChannel;

      if (!channel) {
        return interaction.reply({
          content: '❌ Canal de notificaciones no encontrado',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor('#9146FF')
        .setTitle('🔔 Prueba de Notificación')
        .setDescription(
          'Esta es una notificación de prueba para verificar que el sistema de Twitch funciona correctamente.'
        )
        .addFields(
          { name: 'Canal', value: channel.toString(), inline: true },
          { name: 'Estado', value: '✅ Configuración correcta', inline: true }
        )
        .setTimestamp();

      await channel.send({
        content: '@everyone 🔔 Notificación de prueba',
        embeds: [embed],
      });

      return interaction.reply({
        content: '✅ Notificación de prueba enviada correctamente',
        ephemeral: true,
      });
    } catch (error) {
      return interaction.reply({
        content: `❌ Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }
}
