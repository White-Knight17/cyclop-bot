import { Injectable } from '@nestjs/common';

@Injectable()
export class XpMultipliersService {
    private readonly multipliers = {
        boosters: 1.5,
        premiumRole: 2.0,
        weekend: 1.2
    };

    getMultiplier(member: any) {
        let multiplier = 1.0;

        if (member.premiumSince) multiplier *= this.multipliers.boosters;
        if (member.roles.cache.has('Premium')) multiplier *= this.multipliers.premiumRole;
        if ([0, 6].includes(new Date().getDay())) multiplier *= this.multipliers.weekend;

        return multiplier;
    }
}