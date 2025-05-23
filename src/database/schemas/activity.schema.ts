import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Activity extends Document {
    @Prop({ required: true })
    content: string;

    @Prop({
        default: 'PLAYING',
        enum: ['PLAYING', 'WATCHING', 'LISTENING', 'STREAMING'],
        uppercase: true
    })
    type: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);