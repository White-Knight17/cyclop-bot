import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DefaultRole, DefaultRoleSchema } from '../schemas/role.schema';
import { RoleService } from './role.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DefaultRole.name, schema: DefaultRoleSchema }]),
  ],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule { }