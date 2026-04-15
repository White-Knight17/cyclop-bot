// Mock mongoose
jest.mock('mongoose', () => {
  const mockModel = {
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
    updateOne: jest.fn(),
    startSession: jest.fn(),
    aggregate: jest.fn(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  return {
    ...jest.requireActual('mongoose'),
    Model: jest.fn().mockImplementation(() => mockModel),
    Schema: jest.fn(),
    SchemaFactory: {
      createForClass: jest.fn().mockReturnValue({}),
    },
    connection: {
      db: {},
    },
  };
});

// Mock discord.js
jest.mock('discord.js', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      user: {
        setActivity: jest.fn(),
      },
      guilds: {
        cache: new Map(),
      },
      on: jest.fn(),
    })),
    GuildMember: jest.fn(),
    TextChannel: jest.fn(),
    ActivityType: {
      Playing: 0,
      Streaming: 1,
      Listening: 2,
      Watching: 3,
    },
    PermissionsBitField: {
      Flags: {
        SendMessages: 1n,
        ViewChannel: 2n,
        AttachFiles: 4n,
      },
    },
  };
});

// Mock canvas
jest.mock('canvas', () => {
  return {
    createCanvas: jest.fn().mockReturnValue({
      getContext: jest.fn().mockReturnValue({
        fillRect: jest.fn(),
        drawImage: jest.fn(),
        measureText: jest.fn().mockReturnValue({ width: 50 }),
        font: '',
        textBaseline: '',
        fillText: jest.fn(),
        globalAlpha: 1,
      }),
      toBuffer: jest.fn().mockReturnValue(Buffer.from('mock-image')),
      width: 200,
      height: 200,
    }),
    loadImage: jest.fn().mockResValue({
      width: 200,
      height: 200,
    }),
    registerFont: jest.fn(),
  };
});

// Mock twurple
jest.mock('@twurple/api', () => {
  return {
    TwitchApi: jest.fn().mockImplementation(() => ({
      getUserInfo: jest.fn().mockResValue({
        displayName: 'testuser',
        profilePictureUrl: 'http://example.com/avatar.jpg',
      }),
      getUserFollows: jest.fn().mockResValue([]),
    })),
    AuthProvider: jest.fn(),
    StaticAuthProvider: jest.fn(),
  };
});

jest.mock('@twurple/auth', () => {
  return {
    StaticAuthProvider: jest.fn(),
  };
});
