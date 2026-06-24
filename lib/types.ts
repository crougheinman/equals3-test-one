export type Tier = "standard" | "premium";

export type Practitioner = {
  id: number;
  name: string;
  specialisms: string[];
  location: string;
  tier: Tier;
  verified: boolean;
  profile_picture: string | null;
};
