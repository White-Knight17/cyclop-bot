import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermissions, RolePermissionsSchema } from '../../database/schemas/role-permissions.schema';
import { RolePermissionsService } from './role-permissions.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RolePermissions.name, schema: RolePermissionsSchema }
        ])
    ],
    providers: [RolePermissionsService],
    exports: [RolePermissionsService]
})
export class PermissionsModule { } 