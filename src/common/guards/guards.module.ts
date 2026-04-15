import { Module } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { ModeratorGuard } from './moderator.guard';
import { PermissionsModule } from '../../features/permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  providers: [AdminGuard, ModeratorGuard],
  exports: [AdminGuard, ModeratorGuard],
})
export class GuardsModule {}
