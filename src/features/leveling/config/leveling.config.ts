export const LevelingConfig = {
    xpRange: { min: 5, max: 15 },
    cooldown: 60000, // 1 minuto
    levelFormula: (level: number) => Math.floor(5 * Math.pow(level, 2) + 50 * level + 100),
};


export const RankConfig = {
    ranks: [
        {
            name: "Hierro",
            levels: 5,
            color: "#a19d94",
            xpMultiplier: 1.0,
            roleId: "" // Se puede asignar después
        },
        {
            name: "Bronce",
            levels: 5,
            color: "#cd7f32",
            xpMultiplier: 1.1,
            roleId: ""
        },
        {
            name: "Plata",
            levels: 5,
            color: "#c0c0c0",
            xpMultiplier: 1.2,
            roleId: ""
        },
        {
            name: "Oro",
            levels: 5,
            color: "#ffd700",
            xpMultiplier: 1.3,
            roleId: ""
        },
        {
            name: "Platino",
            levels: 5,
            color: "#00ced1",
            xpMultiplier: 1.4,
            roleId: ""
        },
        {
            name: "Diamante",
            levels: 5,
            color: "#b9f2ff",
            xpMultiplier: 1.5,
            roleId: ""
        },
        {
            name: "Maestro",
            levels: 3,
            color: "#ff00ff",
            xpMultiplier: 1.6,
            roleId: ""
        },
        {
            name: "Gran Maestro",
            levels: 3,
            color: "#ff4500",
            xpMultiplier: 1.7,
            roleId: ""
        },
        {
            name: "Legendario",
            levels: 1,
            color: "#ff0000",
            xpMultiplier: 2.0,
            roleId: ""
        }
    ],
    // Niveles totales = sumatoria de levels de cada rango (5+5+5+5+5+5+3+3+1 = 37 niveles)
    getRank(level: number) {
        return this.ranks.find(r => level <= r.maxLevel) || this.ranks[this.ranks.length - 1];
    }
};