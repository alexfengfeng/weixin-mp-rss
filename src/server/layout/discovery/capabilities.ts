/**
 * Discovery 能力清单
 */

import { listModules } from "@/server/layout/modules/registry";
import { ensureModulesRegistered } from "@/server/layout/modules";
import { BUILTIN_THEMES } from "@/server/layout/themes";
import { getImageProviders } from "@/server/images/providers";

export interface Capabilities {
  service: string;
  version: string;
  endpoints: string[];
  layout: { moduleCount: number; categories: string[] };
  themes: { count: number; supportsCustom: boolean };
  inspect: { supported: boolean };
  images: {
    coverPlan: boolean;
    infographic: boolean;
    generate: boolean;
    upload: boolean;
    providers: { defaultProvider: string; count: number };
  };
  ai: {
    write: boolean;
    humanize: boolean;
    styleAnalysis: boolean;
    brandProfile: boolean;
  };
}

export function getCapabilities(): Capabilities {
  ensureModulesRegistered();
  const modules = listModules();
  const categories = [...new Set(modules.map((m) => m.def.category))];
  const providers = getImageProviders();

  return {
    service: "wedraft",
    version: "1.1.0",
    endpoints: [
      "/api/discovery/capabilities",
      "/api/discovery/themes",
      "/api/discovery/layout",
      "/api/discovery/layout/[name]",
      "/api/discovery/layout/validate",
      "/api/discovery/inspect",
      "/api/discovery/providers",
      "/api/discovery/skills",
      "/api/discovery/skills/[id]"
    ],
    layout: { moduleCount: modules.length, categories },
    themes: { count: BUILTIN_THEMES.length, supportsCustom: true },
    inspect: { supported: true },
    images: {
      coverPlan: true,
      infographic: true,
      generate: true,
      upload: true,
      providers: { defaultProvider: providers.defaultProvider, count: providers.providers.length }
    },
    ai: {
      write: true,
      humanize: true,
      styleAnalysis: true,
      brandProfile: true
    }
  };
}
