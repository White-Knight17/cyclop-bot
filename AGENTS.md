# AGENTS.md - Cyklop Bot Development Guide

## Build, Lint, and Test Commands

```bash
npm run start          # Start bot
npm run start:dev      # Start with hot reload (recommended)
npm run start:debug    # Start with debugging
npm run build           # Build for production (dist/)
npm run start:prod     # Run production build
npm run lint            # Run ESLint with auto-fix
npm run format          # Format with Prettier
npm run test            # Run tests
npm run test:watch      # Tests in watch mode
npm run test:cov        # Tests with coverage
```

**Run single test file:**

```bash
npx jest src/features/activities/activities.service.spec.ts
```

---

## Code Style

### General

- NestJS + TypeScript Discord bot using Necord
- Use Spanish for user-facing messages, English for code/logs
- Always use `Logger` from `@nestjs/common`

### TypeScript

- Target: ES2023, Module: CommonJS
- Strict null checks enabled
- No implicit `any`

### Naming

| Element          | Convention             | Example                            |
| ---------------- | ---------------------- | ---------------------------------- |
| Classes/Types    | PascalCase             | `LevelingService`, `LevelUpResult` |
| Services         | PascalCase + `Service` | `XpMultipliersService`             |
| Files (services) | kebab-case             | `xp-multipliers.service.ts`        |
| Variables        | camelCase              | `userCache`                        |
| Constants        | UPPER_SNAKE_CASE       | `CACHE_TTL`                        |
| Private fields   | `_` prefix             | `_userCache`                       |

### Imports

- Use absolute imports with `src/` prefix
- Order: external → internal → relative

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import { XpMultipliersService } from './xp-multipliers.service';
```

### Formatting (Prettier)

- Single quotes, trailing commas, 2-space indent, semicolons

### Decorators

```typescript
@Injectable()
export class MyService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly otherService: OtherService,
  ) {}
}
```

### Error Handling

- Wrap async in try-catch, log before rethrowing
- Spanish messages for user-facing errors

```typescript
async someMethod(userId: string): Promise<Result> {
  try {
    const result = await this.userModel.findOne({ discordId: userId });
    if (!result) throw new Error('Usuario no encontrado');
    return result;
  } catch (error) {
    this.logger.error(`Error: ${error.message}`, error.stack);
    throw error;
  }
}
```

### Database

- Use `lean()` for read queries
- Use sessions for transactions

```typescript
const users = await this.userModel
  .find()
  .sort({ level: -1 })
  .limit(10)
  .lean()
  .exec();
```

### Service Structure

```typescript
@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);
  private readonly userCache = new Map<
    string,
    { user: User; timestamp: number }
  >();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly otherService: OtherService,
  ) {}
}
```

### Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyService],
    }).compile();
    service = module.get<MyService>(MyService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### File Structure

```
src/
├── common/       # Utils, guards, filters
├── config/       # Config
├── database/     # Schemas, repos
├── discord/      # Commands, events
├── features/     # Feature modules
├── app.module.ts
└── main.ts
```

### Environment

- `.env.local` for dev, `.env` for prod
- `process.env.VAR ?? defaultValue`
