import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, Events, GuildMember, PartialGuildMember, PermissionFlagsBits } from 'discord.js';
import { AutoRoleService } from '../../../features/autorole/autorole.service';
import { WelcomeService } from '../../../features/welcome/welcome.service';

@Injectable()
export class GuildMemberAddEvent implements OnModuleInit {
  private readonly logger = new Logger(GuildMemberAddEvent.name);

  constructor(
    private readonly client: Client,
    private readonly autoRoleService: AutoRoleService,
    private readonly welcomeService: WelcomeService
  ) {
    this.logger.log('GuildMemberAddEvent inicializado');
  }

  onModuleInit() {
    this.logger.log('Registrando evento GuildMemberAdd...');

    this.client.on(Events.GuildMemberAdd, (member: GuildMember | PartialGuildMember) => {
      void this.handleNewMember(member);
    });

    this.logger.log('Evento GuildMemberAdd registrado correctamente');
  }

  private async handleNewMember(member: GuildMember | PartialGuildMember) {
    this.logger.debug('Evento GuildMemberAdd recibido', {
      isPartial: member.partial,
      memberId: member.id,
      guildId: member.guild?.id,
      userTag: member.user?.tag,
    });

    try {
      // Si el miembro es parcial, intentar obtener el miembro completo
      if (member.partial) {
        this.logger.debug('Miembro parcial detectado, intentando obtener miembro completo');
        try {
          member = await member.fetch();
          this.logger.debug('Miembro completo obtenido exitosamente');
        } catch (error) {
          this.logger.error('Error al obtener miembro completo:', error);
          return;
        }
      }

      // Validaciones básicas
      if (!member?.guild || !member?.user) {
        this.logger.error('Miembro inválido para procesar', {
          memberId: member?.id,
          guildId: member?.guild?.id,
          hasUser: !!member?.user,
          userTag: member?.user?.tag,
          isPartial: member?.partial,
        });
        return;
      }

      const displayName = member.displayName || member.user.username;
      const guildName = member.guild.name;

      this.logger.log(
        `Nuevo miembro detectado: ${displayName} (${member.user.tag}) en ${guildName} (ID: ${member.guild.id})`
      );

      // Verificar permisos del bot
      const botMember = member.guild.members.me;
      if (!botMember) {
        this.logger.error('Bot no encontrado en el servidor');
        return;
      }

      const botPermissions = botMember.permissions.toArray();
      this.logger.debug('Permisos del bot:', botPermissions);

      // Verificar que el bot tiene los permisos necesarios
      const requiredPermissions = [
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ViewChannel,
      ];
      const missingPermissions = requiredPermissions.filter(
        (permission) => !botMember.permissions.has(permission)
      );

      if (missingPermissions.length > 0) {
        this.logger.error(`Bot sin permisos necesarios: ${missingPermissions.join(', ')}`);
        return;
      }

      // Procesar autorol (independiente)
      await this.handleAutoRole(member);

      // Procesar bienvenida (independiente)
      await this.handleWelcome(member);
    } catch (error) {
      this.logger.error(
        `❌ Error general en GuildMemberAdd: ${error.message}\nStack: ${error.stack}`
      );
    }
  }

  private async handleAutoRole(member: GuildMember) {
    try {
      const autoRoleConfig = await this.autoRoleService.getAutoRole(member.guild.id);
      this.logger.debug('Configuración de autorol:', autoRoleConfig);

      if (!autoRoleConfig?.enabled || !autoRoleConfig.roleId) {
        this.logger.debug(`No hay auto-rol configurado para ${member.guild.name}`);
        return;
      }

      const success = await this.autoRoleService.validateAndAssignRole(
        member,
        autoRoleConfig.roleId
      );
      if (success) {
        this.logger.log(
          `✅ Auto-rol asignado exitosamente a ${member.user.tag} en ${member.guild.name}`
        );
      } else {
        this.logger.warn(
          `⚠️ No se pudo asignar el auto-rol a ${member.user.tag} en ${member.guild.name}`
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Error al asignar autorol a ${member.user.tag} en ${member.guild.name}: ${error.message}`
      );
    }
  }

  private async handleWelcome(member: GuildMember) {
    try {
      const config = await this.welcomeService.getWelcomeConfig(member.guild.id);
      this.logger.debug('Configuración de bienvenida:', config);

      if (!config?.enabled || !config.channelId) {
        this.logger.debug(`Bienvenida no configurada para ${member.guild.name}`);
        return;
      }

      const success = await this.welcomeService.sendWelcomeMessage(member);
      if (success) {
        this.logger.log(
          `✅ Mensaje de bienvenida enviado a ${member.user.tag} en ${member.guild.name}`
        );
      } else {
        this.logger.warn(
          `⚠️ No se pudo enviar el mensaje de bienvenida a ${member.user.tag} en ${member.guild.name}`
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Error al enviar bienvenida a ${member.user.tag} en ${member.guild.name}: ${error.message}`
      );
    }
  }
}
