import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from 'src/database/schemas/activity.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }])],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
