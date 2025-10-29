import TopEarnerBadge from "../components/icons/badges/4th-top-earner-badge.svg";
import EightyPercentileBadge from "../components/icons/badges/80-percentile.svg";
import FirstClaimBadge from "../components/icons/badges/first-claim.svg";
import EmptyBadge from "../components/icons/badges/empty-badge.svg";
import ClaimStreakBadge from "../components/icons/badges/3-day-claim-streak.svg";

export interface Badge {
    name: string;
    description: string;
    icon: string;
}

export const badgeTypeInfo = {
    firstClaim: {
        name: 'First Claim',
        description: 'Congratulations on your first claim!',
        icon: FirstClaimBadge,
    },
    claimStreak: {
        name: 'Claim Streak',
        description: 'You\'ve claimed $MINI every day for 3 days in a row!',
        icon: ClaimStreakBadge,
    },
    threeStreak: {
        name: '3 Day Streak',
        description: 'You\'ve maintained a 3-day claim streak!',
        icon: ClaimStreakBadge,
    },
    eightyPercentile: {
        name: '80th Percentile',
        description: 'You\'re in the top 20% of claimers!',
        icon: EightyPercentileBadge,
    },
    fourthTopEarner: {
        name: '4th Top Earner',
        description: 'You\'re the 4th highest earner in the community!',
        icon: TopEarnerBadge,
    },
    emptyBadge: {
        name: 'Empty Badge',
        description: 'This is an empty badge',
        icon: EmptyBadge,
    },
}

export const badgeTypeList: Badge[] = [
    { name: 'FirstClaim', description: badgeTypeInfo.firstClaim.description, icon: badgeTypeInfo.firstClaim.icon },
    { name: 'ClaimStreak', description: badgeTypeInfo.claimStreak.description, icon: badgeTypeInfo.claimStreak.icon },
    { name: '80thPercentile', description: badgeTypeInfo.eightyPercentile.description, icon: badgeTypeInfo.eightyPercentile.icon },
    { name: '4thTopEarner', description: badgeTypeInfo.fourthTopEarner.description, icon: badgeTypeInfo.fourthTopEarner.icon },
    { name: 'EmptyBadge', description: badgeTypeInfo.emptyBadge.description, icon: badgeTypeInfo.emptyBadge.icon },
];

