import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GuildMember } from 'discord.js';

@Injectable()
export class MemberEventsListener {
  private readonly logger = new Logger(MemberEventsListener.name);

  @OnEvent('member.suspicious')
  handleSuspiciousMember(payload: { member: GuildMember; accountAge: number; guild: any }) {
    const { member, accountAge, guild } = payload;
    this.logger.warn(
      `Cuenta sospechosa detectada en ${guild.name}: ${member.user.tag} ` +
        `(ID: ${member.user.id}) - Edad: ${Math.floor(accountAge / (60 * 60 * 1000))} horas`
    );
  }

  @OnEvent('member.role.assigned')
  handleRoleAssigned(payload: { member: GuildMember; roleId: string; guild: any }) {
    const { member, roleId, guild } = payload;
    const role = guild.roles.cache.get(roleId);
    this.logger.log(
      `Rol ${role?.name || roleId} asignado exitosamente a ${member.user.tag} en ${guild.name}`
    );
  }

  @OnEvent('member.role.error')
  handleRoleError(payload: { member: GuildMember; error: Error; guild: any }) {
    const { member, error, guild } = payload;
    this.logger.error(
      `Error al asignar rol en ${guild.name} para ${member.user.tag}: ${error.message}`
    );
  }

  @OnEvent('member.welcome.sent')
  handleWelcomeSent(payload: { member: GuildMember; guild: any }) {
    const { member, guild } = payload;
    this.logger.log(
      `Mensaje de bienvenida enviado exitosamente a ${member.user.tag} en ${guild.name}`
    );
  }

  @OnEvent('member.welcome.error')
  handleWelcomeError(payload: { member: GuildMember; error: Error; guild: any }) {
    const { member, error, guild } = payload;
    this.logger.error(
      `Error al enviar bienvenida en ${guild.name} para ${member.user.tag}: ${error.message}`
    );
  }

  @OnEvent('member.processed')
  handleMemberProcessed(payload: { member: GuildMember; guild: any; timestamp: number }) {
    const { member, guild, timestamp } = payload;
    const processingTime = Date.now() - timestamp;
    this.logger.debug(
      `Miembro ${member.user.tag} procesado completamente en ${guild.name} ` +
        `(Tiempo de procesamiento: ${processingTime}ms)`
    );
  }

  @OnEvent('member.error')
  handleMemberError(payload: { member: GuildMember; error: Error; guild: any }) {
    const { member, error, guild } = payload;
    this.logger.error(
      `Error general en el procesamiento de ${member?.user?.tag || 'Miembro Desconocido'} ` +
        `en ${guild?.name || 'Servidor Desconocido'}: ${error.message}`
    );
  }
}
