export interface LevelUpResult {
    leveledUp: boolean;
    newLevel?: number;
    achievements?: Array<{
        id: string;
        name: string;
        description: string;
    }>;
}

