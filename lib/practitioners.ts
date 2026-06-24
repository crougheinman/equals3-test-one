import { supabase } from "@/lib/supabase";
import type { Practitioner } from "@/lib/types";

// Premium first (enum sorts standard<premium, so descending), then name A–Z.
export async function getPractitioners(): Promise<Practitioner[]> {
  const { data, error } = await supabase
    .from("practitioners")
    .select("id, name, specialisms, location, tier, verified, profile_picture")
    .order("tier", { ascending: false })
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to load practitioners: ${error.message}`);
  return (data ?? []) as Practitioner[];
}
