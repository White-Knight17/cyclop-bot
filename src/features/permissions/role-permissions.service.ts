import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolePermissions } from '../../database/schemas/role-permissions.schema';

@Injectable()
export class RolePermissionsService {
  private readonly logger = new Logger(RolePermissionsService.name);

  constructor(
    @InjectModel(RolePermissions.name)
    private rolePermissionsModel: Model<RolePermissions>
  ) {}

  async getRolePermissions(guildId: string): Promise<RolePermissions | null> {
    try {
      return await this.rolePermissionsModel.findOne({ guildId }).exec();
    } catch (error) {
      this.logger.error(`Error al obtener permisos de roles para ${guildId}: ${error.message}`);
      return null;
    }
  }

  async setAdminRoles(guildId: string, roleIds: string[]): Promise<RolePermissions> {
    try {
      const config = await this.rolePermissionsModel
        .findOneAndUpdate(
          { guildId },
          {
            guildId,
            adminRoles: roleIds,
            enabled: true,
          },
          { upsert: true, new: true }
        )
        .exec();

      this.logger.log(`Roles de administrador actualizados para ${guildId}: ${roleIds.join(', ')}`);
      return config;
    } catch (error) {
      this.logger.error(
        `Error al actualizar roles de administrador para ${guildId}: ${error.message}`
      );
      throw error;
    }
  }

  async setModeratorRoles(guildId: string, roleIds: string[]): Promise<RolePermissions> {
    try {
      const config = await this.rolePermissionsModel
        .findOneAndUpdate(
          { guildId },
          {
            guildId,
            moderatorRoles: roleIds,
            enabled: true,
          },
          { upsert: true, new: true }
        )
        .exec();

      this.logger.log(`Roles de moderador actualizados para ${guildId}: ${roleIds.join(', ')}`);
      return config;
    } catch (error) {
      this.logger.error(`Error al actualizar roles de moderador para ${guildId}: ${error.message}`);
      throw error;
    }
  }

  async getAdminRoles(guildId: string): Promise<string[]> {
    try {
      const config = await this.getRolePermissions(guildId);
      return config?.adminRoles || [];
    } catch (error) {
      this.logger.error(
        `Error al obtener roles de administrador para ${guildId}: ${error.message}`
      );
      return [];
    }
  }

  async getModeratorRoles(guildId: string): Promise<string[]> {
    try {
      const config = await this.getRolePermissions(guildId);
      return config?.moderatorRoles || [];
    } catch (error) {
      this.logger.error(`Error al obtener roles de moderador para ${guildId}: ${error.message}`);
      return [];
    }
  }

  async disableRolePermissions(guildId: string): Promise<void> {
    try {
      await this.rolePermissionsModel.findOneAndUpdate({ guildId }, { enabled: false }).exec();
      this.logger.log(`Permisos de roles deshabilitados para ${guildId}`);
    } catch (error) {
      this.logger.error(
        `Error al deshabilitar permisos de roles para ${guildId}: ${error.message}`
      );
      throw error;
    }
  }
}
