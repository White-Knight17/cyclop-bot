import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TwitchConfig extends Document {
  @Prop({ required: true, index: true })
  guildId: string;

  @Prop({ required: true })
  channelId: string;

  @Prop({ type: [String], default: [] })
  streamers: string[];

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ default: true })
  notifyLive: boolean;

  @Prop({ default: true })
  notifyOffline: boolean;

  @Prop()
  customMessage?: string;
}

export const TwitchSchema = SchemaFactory.createForClass(TwitchConfig);
