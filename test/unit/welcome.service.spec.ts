import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeService } from '../../src/features/welcome/welcome.service';
import { ImageBuilderUtil } from '../../src/features/welcome/image-builder.util';
import { Model } from 'mongoose';
import { WelcomeConfig } from '../../src/database/schemas/welcome.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockImageBuilder = {
  generateWelcomeCard: jest.fn().mockResolvedValue(Buffer.from('mock-image')),
};

const mockWelcomeModel = {
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
};

describe('WelcomeService', () => {
  let service: WelcomeService;
  let model: Model<WelcomeConfig>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WelcomeService,
        {
          provide: ImageBuilderUtil,
          useValue: mockImageBuilder,
        },
        {
          provide: getModelToken(WelcomeConfig.name),
          useValue: mockWelcomeModel,
        },
      ],
    }).compile();

    service = module.get<WelcomeService>(WelcomeService);
    model = module.get<Model<WelcomeConfig>>(getModelToken(WelcomeConfig.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setWelcomeChannel', () => {
    const guildId = '123456789';
    const channelId = '987654321';
    const message = 'Custom welcome message';

    it('should set welcome channel successfully', async () => {
      // Arrange
      const mockConfig = {
        guildId,
        channelId,
        message,
        enabled: true,
        save: jest.fn(),
      };
      mockWelcomeModel.findOneAndUpdate.mockResolvedValue(mockConfig);

      // Act
      const result = await service.setWelcomeChannel(guildId, channelId, message);

      // Assert
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { guildId },
        {
          channelId,
          message,
          enabled: true,
        },
        { upsert: true, new: true }
      );
      expect(result).toEqual(mockConfig);
    });

    it('should use default message when none provided', async () => {
      // Arrange
      const mockConfig = {
        guildId,
        channelId,
        message: '¡Bienvenido {user} a {server}!',
        enabled: true,
        save: jest.fn(),
      };
      mockWelcomeModel.findOneAndUpdate.mockResolvedValue(mockConfig);

      // Act
      const result = await service.setWelcomeChannel(guildId, channelId);

      // Assert
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { guildId },
        {
          channelId,
          message: '¡Bienvenido {user} a {server}!',
          enabled: true,
        },
        { upsert: true, new: true }
      );
      expect(result).toEqual(mockConfig);
    });

    it('should throw error when guildId is missing', async () => {
      // Act & Assert - el throw depende de la implementación
      await expect(service.setWelcomeChannel('', channelId)).rejects.toThrow();
    });

    it('should throw error when channelId is missing', async () => {
      // Act & Assert
      await expect(service.setWelcomeChannel(guildId, '')).rejects.toThrow();
    });

    it('should handle database errors', async () => {
      // Arrange
      mockWelcomeModel.findOneAndUpdate.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(service.setWelcomeChannel(guildId, channelId)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('disableWelcome', () => {
    const guildId = '123456789';

    it('should disable welcome messages successfully', async () => {
      // Arrange
      const mockConfig = {
        guildId,
        channelId: '987654321',
        message: 'Test message',
        enabled: false,
      };
      mockWelcomeModel.findOneAndUpdate.mockResolvedValue(mockConfig);

      // Act
      const result = await service.disableWelcome(guildId);

      // Assert
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { guildId },
        { enabled: false },
        { new: true }
      );
      expect(result).toEqual(mockConfig);
    });

    it('should throw error when guildId is missing', async () => {
      // Act & Assert
      await expect(service.disableWelcome('')).rejects.toThrow();
    });

    it('should handle database errors', async () => {
      // Arrange
      mockWelcomeModel.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.disableWelcome(guildId)).rejects.toThrow('Database error');
    });
  });

  describe('getWelcomeConfig', () => {
    const guildId = '123456789';

    it('should get welcome config when exists', async () => {
      // Arrange
      const mockConfig = {
        guildId,
        channelId: '987654321',
        message: 'Test message',
        enabled: true,
      };
      mockWelcomeModel.findOne.mockResolvedValue(mockConfig);

      // Act
      const result = await service.getWelcomeConfig(guildId);

      // Assert
      expect(model.findOne).toHaveBeenCalledWith({ guildId });
      expect(result).toEqual(mockConfig);
    });

    it('should return null when config does not exist', async () => {
      // Arrange
      mockWelcomeModel.findOne.mockResolvedValue(null);

      // Act
      const result = await service.getWelcomeConfig(guildId);

      // Assert
      expect(model.findOne).toHaveBeenCalledWith({ guildId });
      expect(result).toBeNull();
    });

    it('should throw error when guildId is missing', async () => {
      // Act & Assert
      await expect(service.getWelcomeConfig('')).rejects.toThrow();
    });

    it('should handle database errors', async () => {
      // Arrange
      mockWelcomeModel.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.getWelcomeConfig(guildId)).rejects.toThrow('Database error');
    });
  });
});
