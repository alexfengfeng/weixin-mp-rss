/**
 * 模块统一注册入口
 *
 * 导入所有内置模块并注册到 registry。
 * 提供 ModuleResolver 供 parser 使用。
 */

import { registerModule, hasModule, getModuleDef } from "@/server/layout/modules/registry";
import type { ModuleResolver } from "@/server/layout/parser/document";

// opening 类
import { heroDef, heroRender } from "@/server/layout/modules/opening/hero";
import { tocDef, tocRender } from "@/server/layout/modules/opening/toc";
import { cardsDef, cardsRender } from "@/server/layout/modules/opening/cards";
import { partDef, partRender } from "@/server/layout/modules/opening/part";
import { labelTitleDef, labelTitleRender } from "@/server/layout/modules/opening/label-title";

// infographic 类
import { stepsDef, stepsRender } from "@/server/layout/modules/infographic/steps";
import { metricsDef, metricsRender } from "@/server/layout/modules/infographic/metrics";
import { compareDef, compareRender } from "@/server/layout/modules/infographic/compare";
import { timelineDef, timelineRender } from "@/server/layout/modules/infographic/timeline";
import { infographicDef, infographicRender } from "@/server/layout/modules/infographic/infographic";

// judgment 类
import { verdictDef, verdictRender } from "@/server/layout/modules/judgment/verdict";
import { audienceFitDef, audienceFitRender } from "@/server/layout/modules/judgment/audience-fit";
import { mythFactDef, mythFactRender } from "@/server/layout/modules/judgment/myth-fact";
import { manifestoDef, manifestoRender } from "@/server/layout/modules/judgment/manifesto";
import { bridgeDef, bridgeRender } from "@/server/layout/modules/judgment/bridge";

// evidence 类
import { quoteDef, quoteRender } from "@/server/layout/modules/evidence/quote";
import { imageAnnotateDef, imageAnnotateRender } from "@/server/layout/modules/evidence/image-annotate";
import { imageCompareDef, imageCompareRender } from "@/server/layout/modules/evidence/image-compare";
import { imageStepsDef, imageStepsRender } from "@/server/layout/modules/evidence/image-steps";
import { imageTextDef, imageTextRender } from "@/server/layout/modules/evidence/image-text";

// conversion 类
import { ctaDef, ctaRender } from "@/server/layout/modules/conversion/cta";
import { faqDef, faqRender } from "@/server/layout/modules/conversion/faq";
import { checklistDef, checklistRender } from "@/server/layout/modules/conversion/checklist";
import { summaryDef, summaryRender } from "@/server/layout/modules/conversion/summary";
import { noticeDef, noticeRender } from "@/server/layout/modules/conversion/notice";
import { casesDef, casesRender } from "@/server/layout/modules/conversion/cases";

// brand 类
import { authorCardDef, authorCardRender } from "@/server/layout/modules/brand/author-card";
import { subscribeDef, subscribeRender } from "@/server/layout/modules/brand/subscribe";
import { peopleDef, peopleRender } from "@/server/layout/modules/brand/people";
import { seriesDef, seriesRender } from "@/server/layout/modules/brand/series";

// sprint4 类
import { calloutDef, calloutRender } from "@/server/layout/modules/sprint4/callout";
import { definitionDef, definitionRender } from "@/server/layout/modules/sprint4/definition";
import { quoteCardDef, quoteCardRender } from "@/server/layout/modules/sprint4/quote-card";
import { tweetDef, tweetRender } from "@/server/layout/modules/sprint4/tweet";
import { statRowDef, statRowRender } from "@/server/layout/modules/sprint4/stat-row";
import { questionDef, questionRender } from "@/server/layout/modules/sprint4/question";
import { resourceListDef, resourceListRender } from "@/server/layout/modules/sprint4/resource-list";
import { comparisonTableDef, comparisonTableRender } from "@/server/layout/modules/sprint4/comparison-table";
import { changelogDef, changelogRender } from "@/server/layout/modules/sprint4/changelog";

let registered = false;

/** 注册所有内置模块（幂等，仅执行一次） */
export function registerBuiltinModules(): void {
  if (registered) return;

  // opening
  registerModule(heroDef, heroRender);
  registerModule(tocDef, tocRender);
  registerModule(cardsDef, cardsRender);
  registerModule(partDef, partRender);
  registerModule(labelTitleDef, labelTitleRender);

  // infographic
  registerModule(stepsDef, stepsRender);
  registerModule(metricsDef, metricsRender);
  registerModule(compareDef, compareRender);
  registerModule(timelineDef, timelineRender);
  registerModule(infographicDef, infographicRender);

  // judgment
  registerModule(verdictDef, verdictRender);
  registerModule(audienceFitDef, audienceFitRender);
  registerModule(mythFactDef, mythFactRender);
  registerModule(manifestoDef, manifestoRender);
  registerModule(bridgeDef, bridgeRender);

  // evidence
  registerModule(quoteDef, quoteRender);
  registerModule(imageAnnotateDef, imageAnnotateRender);
  registerModule(imageCompareDef, imageCompareRender);
  registerModule(imageStepsDef, imageStepsRender);
  registerModule(imageTextDef, imageTextRender);

  // conversion
  registerModule(ctaDef, ctaRender);
  registerModule(faqDef, faqRender);
  registerModule(checklistDef, checklistRender);
  registerModule(summaryDef, summaryRender);
  registerModule(noticeDef, noticeRender);
  registerModule(casesDef, casesRender);

  // brand
  registerModule(authorCardDef, authorCardRender);
  registerModule(subscribeDef, subscribeRender);
  registerModule(peopleDef, peopleRender);
  registerModule(seriesDef, seriesRender);

  // sprint4
  registerModule(calloutDef, calloutRender);
  registerModule(definitionDef, definitionRender);
  registerModule(quoteCardDef, quoteCardRender);
  registerModule(tweetDef, tweetRender);
  registerModule(statRowDef, statRowRender);
  registerModule(questionDef, questionRender);
  registerModule(resourceListDef, resourceListRender);
  registerModule(comparisonTableDef, comparisonTableRender);
  registerModule(changelogDef, changelogRender);

  registered = true;
}

/** 确保模块已注册（在每次渲染前调用） */
export function ensureModulesRegistered(): void {
  if (!registered) registerBuiltinModules();
}

/** 模块解析器（供 parser/document.ts 的 parseDocument 使用） */
export const builtinModuleResolver: ModuleResolver = {
  hasModule: (name: string) => {
    ensureModulesRegistered();
    return hasModule(name);
  },
  getModuleDef: (name: string) => {
    ensureModulesRegistered();
    return getModuleDef(name);
  }
};
