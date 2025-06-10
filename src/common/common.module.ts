import { Module, Global } from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { ModeratorGuard } from './guards/moderator.guard';
import { PermissionsModule } from '../features/permissions/permissions.module';

@Global()
@Module({
    imports: [PermissionsModule],
    providers: [
        AdminGuard,
        ModeratorGuard
    ],
    exports: [
        AdminGuard,
        ModeratorGuard,
        PermissionsModule
    ]
})
export class CommonModule { } 