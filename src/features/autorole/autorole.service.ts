// src/features/autorole/autorole.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AutoRole } from '../../database/schemas/autorole.schema';
import { GuildMember } from 'discord.js';

@Injectable()
export class AutoRoleService {
  private readonly logger = new Logger(AutoRoleService.name);

  constructor(@InjectModel(AutoRole.name) private autoRoleModel: Model<AutoRole>) {}

  async getAutoRole(guildId: string): Promise<AutoRole | null> {
    try {
      return await this.autoRoleModel.findOne({ guildId }).exec();
    } catch (error) {
      this.logger.error(`Error al obtener auto-rol para ${guildId}: ${error.message}`);
      return null;
    }
  }

  async setAutoRole(guildId: string, roleId: string): Promise<AutoRole> {
    try {
      const autoRole = await this.autoRoleModel
        .findOneAndUpdate(
          { guildId },
          { guildId, roleId, enabled: true },
          { upsert: true, new: true }
        )
        .exec();

      this.logger.log(`Auto-rol configurado para ${guildId}: ${roleId}`);
      return autoRole;
    } catch (error) {
      this.logger.error(`Error al configurar auto-rol para ${guildId}: ${error.message}`);
      throw error;
    }
  }

  async disableAutoRole(guildId: string): Promise<void> {
    try {
      await this.autoRoleModel.findOneAndUpdate({ guildId }, { enabled: false }).exec();
      this.logger.log(`Auto-rol deshabilitado para ${guildId}`);
    } catch (error) {
      this.logger.error(`Error al deshabilitar auto-rol para ${guildId}: ${error.message}`);
      throw error;
    }
  }

  async validateAndAssignRole(member: GuildMember, roleId: string): Promise<boolean> {
    try {
      // Validaciones básicas
      if (!member?.guild || !member?.user) {
        this.logger.warn('Miembro inválido para asignación de rol');
        return false;
      }

      // Obtener el rol
      const role = member.guild.roles.cache.get(roleId);
      if (!role) {
        this.logger.warn(`Rol no encontrado: ${roleId} en ${member.guild.name}`);
        return false;
      }

      // Verificar si el miembro ya tiene el rol
      if (member.roles.cache.has(roleId)) {
        this.logger.debug(`Miembro ${member.user.tag} ya tiene el rol ${role.name}`);
        return true;
      }

      // Verificar permisos del bot
      const botMember = member.guild.members.me;
      if (!botMember?.permissions.has('ManageRoles')) {
        this.logger.warn(`Bot sin permisos para gestionar roles en ${member.guild.name}`);
        return false;
      }

      // Verificar posición del rol
      if (role.position >= botMember.roles.highest.position) {
        this.logger.warn(
          `Rol ${role.name} está por encima del rol más alto del bot en ${member.guild.name}`
        );
        return false;
      }

      // Asignar el rol
      await member.roles.add(role);
      this.logger.log(
        `Rol ${role.name} asignado exitosamente a ${member.user.tag} en ${member.guild.name}`
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error al asignar rol a ${member?.user?.tag || 'Miembro Desconocido'}: ${error.message}`
      );
      return false;
    }
  }
}
