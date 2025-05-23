// En activities.command.ts
import { SlashCommand, Context, SlashCommandContext, Options, StringOption, Subcommand } from 'necord';
import { ActivitiesService } from 'src/features/activities/activities.service';

import { AdminGuard } from 'src/common/guards/admin.guard';


