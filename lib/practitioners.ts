import { supabase } from "@/lib/supabase";
import type { Practitioner } from "@/lib/types";

// Ordered by name A–Z. No tier-based ranking — premium is not promoted to the top.
export async function getPractitioners(): Promise<Practitioner[]> {
  const { data, error } = await supabase
    .from("equals")
    .select("id, name, specialisms, location, tier, verified, profile_picture")
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to load practitioners: ${error.message}`);
  return (data ?? []) as Practitioner[];
}
