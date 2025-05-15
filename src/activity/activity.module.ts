import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from '../schemas/activity.schema';
import { ActivityService } from './activity.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }]),
    ],
    providers: [ActivityService],
    exports: [ActivityService], // Exportamos para usarlo en BotService
})
export class ActivityModule { }