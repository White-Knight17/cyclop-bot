import { Test, TestingModule } from '@nestjs/testing';
import { XpMultipliersService } from './xp-multipliers.service';

describe('XpMultipliersService', () => {
  let service: XpMultipliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XpMultipliersService],
    }).compile();

    service = module.get<XpMultipliersService>(XpMultipliersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMultiplier', () => {
    it('should return base multiplier for regular user', () => {
      const mockMember = {
        premiumSince: null,
        roles: {
          cache: new Map(),
        },
      };

      const multiplier = service.getMultiplier(mockMember as any);
      expect(multiplier).toBe(1.0);
    });

    it('should apply booster multiplier when user has premium', () => {
      const mockMember = {
        premiumSince: new Date(),
        roles: {
          cache: new Map(),
        },
      };

      const multiplier = service.getMultiplier(mockMember as any);
      expect(multiplier).toBe(1.5);
    });

    it('should apply premium role multiplier', () => {
      const mockRoles = new Map();
      mockRoles.set('Premium', { id: '123', name: 'Premium' });

      const mockMember = {
        premiumSince: null,
        roles: {
          cache: mockRoles,
        },
      };

      const multiplier = service.getMultiplier(mockMember as any);
      expect(multiplier).toBe(2.0);
    });

    it('should apply all multipliers combined', () => {
      const mockRoles = new Map();
      mockRoles.set('Premium', { id: '123', name: 'Premium' });

      const mockMember = {
        premiumSince: new Date(),
        roles: {
          cache: mockRoles,
        },
      };

      const multiplier = service.getMultiplier(mockMember as any);
      // booster (1.5) * premium role (2.0) = 3.0
      expect(multiplier).toBe(3.0);
    });
  });
});
