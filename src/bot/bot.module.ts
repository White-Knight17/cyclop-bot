import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ActivityModule } from 'src/activity/activity.module';
import { RoleModule } from 'src/role/role.module';



@Module({
  imports: [ActivityModule, RoleModule],
  providers: [BotService,]
})
export class BotModule { }
