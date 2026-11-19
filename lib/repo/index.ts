import { isDemoMode } from "@/lib/config";
import type { Repo } from "@/lib/repo/types";

export async function getRepo(): Promise<Repo> {
  if (isDemoMode()) {
    const { demoRepo } = await import("@/lib/repo/demo");
    return demoRepo;
  }
  const { supabaseRepo } = await import("@/lib/repo/supabase");
  return supabaseRepo;
}

export type { Repo } from "@/lib/repo/types";
