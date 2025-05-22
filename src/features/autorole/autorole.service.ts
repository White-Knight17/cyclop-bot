// src/features/autorole/autorole.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AutoRole } from '../../database/schemas/autorole.schema';

@Injectable()
export class AutoRoleService {
    constructor(
        @InjectModel(AutoRole.name) private autoRoleModel: Model<AutoRole>
    ) { }

    async setAutoRole(guildId: string, roleId: string) {
        return this.autoRoleModel.findOneAndUpdate(
            { guildId },
            { roleId, enabled: true },
            { upsert: true, new: true }
        );
    }

    async disableAutoRole(guildId: string) {
        return this.autoRoleModel.findOneAndUpdate(
            { guildId },
            { enabled: false },
            { new: true }
        );
    }

    async getAutoRole(guildId: string) {
        return this.autoRoleModel.findOne({ guildId });
    }
}