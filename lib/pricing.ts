import type { Tier } from "@/lib/types";

// Monthly subscription fee per tier (GBP).
export const TIER_PRICE: Record<Tier, number> = {
  standard: 150,
  premium: 249,
};
