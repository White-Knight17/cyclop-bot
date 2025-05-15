import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from '../schemas/activity.schema';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel(Activity.name) private activityModel: Model<Activity>,
    ) { }

    async create(activity: { type: string; message: string }) {
        const newActivity = new this.activityModel(activity);
        return newActivity.save();
    }

    async findAll() {
        return this.activityModel.find().exec();
    }
}