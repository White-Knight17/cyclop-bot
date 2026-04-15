export const LevelingConfig = {
  xpRange: { min: 5, max: 15 },
  cooldown: 60000, // 1 minuto
  levelFormula: (level: number) => Math.floor(5 * Math.pow(level, 2) + 50 * level + 100),
};

export const RankConfig = {
  ranks: [
    {
      name: 'Hierro',
      levels: 5,
      color: '#a19d94',
      xpMultiplier: 1.0,
      permissions: {
        viewChannel: true,
        sendMessages: true,
        readMessageHistory: true,
      },
    },
    {
      name: 'Bronce',
      levels: 5,
      color: '#cd7f32',
      xpMultiplier: 1.1,
      permissions: {
        viewChannel: true,
        sendMessages: true,
        readMessageHistory: true,
        addReactions: true,
        useExternalEmojis: true,
      },
    },
    {
      name: 'Plata',
      levels: 5,
      color: '#c0c0c0',
      xpMultiplier: 1.2,
      permissions: {
        viewChannel: true,
        sendMessages: true,
        readMessageHistory: true,
        addReactions: true,
        useExternalEmojis: true,
        attachFiles: true,
        embedLinks: true,
      },
    },
    {
      name: 'Oro',
      levels: 5,
      color: '#ffd700',
      xpMultiplier: 1.3,
      permissions: {
        viewChannel: true,
        sendMessages: true,
        readMessageHistory: true,
        addReactions: true,
        useExternalEmojis: true,
        attachFiles: true,
        embedLinks: true,
        createPublicThreads: true,
        createPrivateThreads: true,
      },
    },
    {
      name: 'Platino',
      levels: 5,
      color: '#00ced1',
      xpMultiplier: 1.4,
      permissions: {
        viewChannel: true,
        sendMessages: true,
        readMessageHistory: true,
        addReactions: true,
        useExternalEmojis: true,
        attachFiles: true,
        embedLinks: true,
        createPublicThreads: true,
        createPrivateThreads: true,
        manageThreads: true,
        useExternalStickers: true,
      },
    },
    {
      name: 'Diamante',
      levels: 5,
      color: '#b9f2ff',
      xpMultiplier: 1.5,
      permissions: {
        viewChannel: true,
        sendMessages: true,
        readMessageHistory: true,
        addReactions: true,
        useExternalEmojis: true,
        attachFiles: true,
        embedLinks: true,
        createPublicThreads: true,
        createPrivateThreads: true,
        manageThreads: true,
        useExternalStickers: true,
        manageMessages: true,
        mentionEveryone: true,
      },
    },
    {
      name: 'Maestro',
      levels: 3,
      color: '#ff00ff',
      xpMultiplier: 1.6,
      permissions: {
        viewChannel: true,
        sendMessages: true,
        readMessageHistory: true,
        addReactions: true,
        useExternalEmojis: true,
        attachFiles: true,
        embedLinks: true,
        createPublicThreads: true,
        createPrivateThreads: true,
        manageThreads: true,
        useExternalStickers: true,
        manageMessages: true,
        mentionEveryone: true,
        moderateMembers: true,
        manageNicknames: true,
      },
    },
    {
      name: 'Gran Maestro',
      levels: 3,
      color: '#ff4500',
      xpMultiplier: 1.7,
      permissions: {
        viewChannel: true,
        sendMessages: true,
        readMessageHistory: true,
        addReactions: true,
        useExternalEmojis: true,
        attachFiles: true,
        embedLinks: true,
        createPublicThreads: true,
        createPrivateThreads: true,
        manageThreads: true,
        useExternalStickers: true,
        manageMessages: true,
        mentionEveryone: true,
        moderateMembers: true,
        manageNicknames: true,
        manageRoles: true,
        manageChannels: true,
      },
    },
    {
      name: 'Legendario',
      levels: 1,
      color: '#ff0000',
      xpMultiplier: 2.0,
      permissions: {
        administrator: true,
      },
    },
  ],

  // Niveles totales = sumatoria de levels de cada rango (5+5+5+5+5+5+3+3+1 = 37 niveles)
  getRank(level: number) {
    let accumulatedLevels = 0;
    for (const rank of this.ranks) {
      if (level <= accumulatedLevels + rank.levels) {
        return rank;
      }
      accumulatedLevels += rank.levels;
    }
    return this.ranks[this.ranks.length - 1];
  },

  // Obtener el nivel máximo de cada rango
  getMaxLevel(rankName: string): number {
    let accumulatedLevels = 0;
    for (const rank of this.ranks) {
      accumulatedLevels += rank.levels;
      if (rank.name === rankName) {
        return accumulatedLevels;
      }
    }
    return 0;
  },
};
