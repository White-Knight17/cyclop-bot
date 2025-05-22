// src/features/autorole/autorole.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoRoleService } from './autorole.service';
import { AutoRole, AutoRoleSchema } from '../../database/schemas/autorole.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AutoRole.name, schema: AutoRoleSchema }])
  ],
  providers: [AutoRoleService],
  exports: [AutoRoleService]
})
export class AutoRoleModule { }