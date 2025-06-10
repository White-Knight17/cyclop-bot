import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GuildMember } from 'discord.js';

@Injectable()
export class MemberEventsListener {
    private readonly logger = new Logger(MemberEventsListener.name);

    @OnEvent('member.suspicious')
    async handleSuspiciousMember(payload: { member: GuildMember; accountAge: number; guild: any }) {
        const { member, accountAge, guild } = payload;
        this.logger.warn(
            `Cuenta sospechosa detectada en ${guild.name}: ${member.user.tag} ` +
            `(ID: ${member.user.id}) - Edad: ${Math.floor(accountAge / (60 * 60 * 1000))} horas`
        );
        // Aquí puedes implementar acciones adicionales para cuentas sospechosas
        // Por ejemplo, notificar a los moderadores, registrar en una base de datos, etc.
    }

    @OnEvent('member.role.assigned')
    async handleRoleAssigned(payload: { member: GuildMember; roleId: string; guild: any }) {
        const { member, roleId, guild } = payload;
        const role = guild.roles.cache.get(roleId);
        this.logger.log(
            `Rol ${role?.name || roleId} asignado exitosamente a ${member.user.tag} en ${guild.name}`
        );
        // Aquí puedes implementar acciones adicionales después de asignar el rol
        // Por ejemplo, registrar en una base de datos, notificar al usuario, etc.
    }

    @OnEvent('member.role.error')
    async handleRoleError(payload: { member: GuildMember; error: Error; guild: any }) {
        const { member, error, guild } = payload;
        this.logger.error(
            `Error al asignar rol en ${guild.name} para ${member.user.tag}: ${error.message}`
        );
        // Aquí puedes implementar acciones adicionales para manejar errores de roles
        // Por ejemplo, notificar a los administradores, intentar nuevamente, etc.
    }

    @OnEvent('member.welcome.sent')
    async handleWelcomeSent(payload: { member: GuildMember; guild: any }) {
        const { member, guild } = payload;
        this.logger.log(
            `Mensaje de bienvenida enviado exitosamente a ${member.user.tag} en ${guild.name}`
        );
        // Aquí puedes implementar acciones adicionales después de enviar la bienvenida
        // Por ejemplo, registrar en una base de datos, enviar DM adicional, etc.
    }

    @OnEvent('member.welcome.error')
    async handleWelcomeError(payload: { member: GuildMember; error: Error; guild: any }) {
        const { member, error, guild } = payload;
        this.logger.error(
            `Error al enviar bienvenida en ${guild.name} para ${member.user.tag}: ${error.message}`
        );
        // Aquí puedes implementar acciones adicionales para manejar errores de bienvenida
        // Por ejemplo, notificar a los administradores, intentar nuevamente, etc.
    }

    @OnEvent('member.processed')
    async handleMemberProcessed(payload: { member: GuildMember; guild: any; timestamp: number }) {
        const { member, guild, timestamp } = payload;
        const processingTime = Date.now() - timestamp;
        this.logger.debug(
            `Miembro ${member.user.tag} procesado completamente en ${guild.name} ` +
            `(Tiempo de procesamiento: ${processingTime}ms)`
        );
        // Aquí puedes implementar acciones adicionales después de procesar completamente al miembro
        // Por ejemplo, registrar estadísticas, actualizar contadores, etc.
    }

    @OnEvent('member.error')
    async handleMemberError(payload: { member: GuildMember; error: Error; guild: any }) {
        const { member, error, guild } = payload;
        this.logger.error(
            `Error general en el procesamiento de ${member?.user?.tag || 'Miembro Desconocido'} ` +
            `en ${guild?.name || 'Servidor Desconocido'}: ${error.message}`
        );
        // Aquí puedes implementar acciones adicionales para manejar errores generales
        // Por ejemplo, notificar a los administradores, registrar en un sistema de monitoreo, etc.
    }
} 