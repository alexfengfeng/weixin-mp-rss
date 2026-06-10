type Option = { id: string };

export type ArticleEditorPreferenceFields = {
  stylePresetId?: string | null;
  style?: string | null;
  templateId?: string | null;
};

export function getDefaultWritingStyleId(writingStyles: Option[]) {
  return writingStyles[0]?.id || "professional";
}

export function getDefaultWechatTemplateId(wechatTemplates: Option[]) {
  return wechatTemplates[0]?.id || "clean";
}

export function getArticleEditorPreferences(
  article: ArticleEditorPreferenceFields | undefined,
  writingStyles: Option[],
  wechatTemplates: Option[]
) {
  return {
    stylePresetId: chooseKnownOption(article?.stylePresetId, writingStyles, getDefaultWritingStyleId(writingStyles)),
    style: article?.style || "",
    templateId: chooseKnownOption(article?.templateId, wechatTemplates, getDefaultWechatTemplateId(wechatTemplates))
  };
}

export function withGeneratedArticlePreferences<T extends object>(
  article: T,
  preferences: ArticleEditorPreferenceFields,
  options: {
    writingStyles: Option[];
    wechatTemplates: Option[];
  }
) {
  return {
    ...article,
    ...getArticleEditorPreferences(preferences, options.writingStyles, options.wechatTemplates)
  };
}

function chooseKnownOption(value: string | null | undefined, options: Option[], fallback: string) {
  if (!value) return fallback;
  return options.some((option) => option.id === value) ? value : fallback;
}
