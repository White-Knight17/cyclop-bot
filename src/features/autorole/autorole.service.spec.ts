import { Test, TestingModule } from '@nestjs/testing';
import { AutoroleService } from './autorole.service';

describe('AutoroleService', () => {
  let service: AutoroleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoroleService],
    }).compile();

    service = module.get<AutoroleService>(AutoroleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
