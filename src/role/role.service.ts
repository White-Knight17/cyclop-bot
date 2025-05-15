import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DefaultRole } from '../schemas/role.schema';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(DefaultRole.name) private defaultRoleModel: Model<DefaultRole>,
    ) { }

    async setDefaultRole(guildId: string, roleId: string, roleName: string) {
        // Actualiza o crea el rol predeterminado para el servidor
        return this.defaultRoleModel.findOneAndUpdate(
            { guildId },
            { roleId, roleName },
            { upsert: true, new: true },
        );
    }

    async getDefaultRole(guildId: string) {
        return this.defaultRoleModel.findOne({ guildId });
    }
}