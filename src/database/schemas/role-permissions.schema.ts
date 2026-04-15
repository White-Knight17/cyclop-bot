import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RolePermissions extends Document {
  @Prop({ required: true, unique: true, index: true })
  guildId: string;

  @Prop({ type: [String], default: [] })
  adminRoles: string[];

  @Prop({ type: [String], default: [] })
  moderatorRoles: string[];

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const RolePermissionsSchema = SchemaFactory.createForClass(RolePermissions);

// Índices adicionales
RolePermissionsSchema.index({ adminRoles: 1 });
RolePermissionsSchema.index({ moderatorRoles: 1 });
