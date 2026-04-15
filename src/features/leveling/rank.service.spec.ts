import { Test, TestingModule } from '@nestjs/testing';
import { RankService } from './rank.service';
import { Client } from 'discord.js';

const mockClient = {
  users: { cache: new Map() },
  guilds: { cache: new Map() },
} as any;

describe('RankService', () => {
  let service: RankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankService, { provide: Client, useValue: mockClient }],
    }).compile();

    service = module.get<RankService>(RankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRankInfo', () => {
    it('should return rank info for level 1', () => {
      const rankInfo = service.getRankInfo(1);
      expect(rankInfo).toBeDefined();
      expect(rankInfo.name).toContain('1');
    });

    it('should return rank info for higher levels', () => {
      const rankInfo = service.getRankInfo(10);
      expect(rankInfo).toBeDefined();
      expect(rankInfo.multiplier).toBeDefined();
    });

    it('should include next rank info', () => {
      const rankInfo = service.getRankInfo(1);
      expect(rankInfo.nextRank).toBeDefined();
    });

    it('should return max rank when level exceeds limits', () => {
      const rankInfo = service.getRankInfo(999);
      expect(rankInfo).toBeDefined();
      expect(rankInfo.name).toContain('MAX');
    });
  });
});
