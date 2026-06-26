/**
 * Discovery 能力清单
 */

import { listModules } from "@/server/layout/modules/registry";
import { ensureModulesRegistered } from "@/server/layout/modules";
import { BUILTIN_THEMES } from "@/server/layout/themes";

export interface Capabilities {
  service: string;
  version: string;
  endpoints: string[];
  layout: { moduleCount: number; categories: string[] };
  themes: { count: number; supportsCustom: boolean };
  inspect: { supported: boolean };
}

export function getCapabilities(): Capabilities {
  ensureModulesRegistered();
  const modules = listModules();
  const categories = [...new Set(modules.map((m) => m.def.category))];

  return {
    service: "wedraft",
    version: "1.0.0",
    endpoints: [
      "/api/discovery/capabilities",
      "/api/discovery/themes",
      "/api/discovery/layout",
      "/api/discovery/layout/[name]",
      "/api/discovery/layout/validate",
      "/api/discovery/inspect"
    ],
    layout: { moduleCount: modules.length, categories },
    themes: { count: BUILTIN_THEMES.length, supportsCustom: true },
    inspect: { supported: true }
  };
}
