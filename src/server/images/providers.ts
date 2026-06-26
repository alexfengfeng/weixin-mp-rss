/**
 * 图片 Provider 查询服务
 *
 * 返回当前配置的图片生成服务提供商信息。
 */

export type ImageProvider = {
  id: string;
  name: string;
  baseUrl: string;
  fallbackBaseUrl: string;
  configured: boolean;
  models: string[];
  supportedSizes: string[];
  supportedModes: string[];
};

export type ImageProvidersResult = {
  defaultProvider: string;
  providers: ImageProvider[];
  envVars: string[];
};

/**
 * 获取当前配置的图片生成服务提供商。
 * 从环境变量读取配置，不暴露 API Key。
 */
export function getImageProviders(): ImageProvidersResult {
  const highwayKey = !!process.env.HIGHWAY_API_KEY?.trim();
  const jiekouKey = !!process.env.JIEKOU_API_KEY?.trim();
  const highwayBaseUrl = process.env.HIGHWAY_IMAGE_BASE_URL || "https://api.highwayapi.ai/v3";

  const providers: ImageProvider[] = [
    {
      id: "highway",
      name: "Highway API",
      baseUrl: highwayBaseUrl,
      fallbackBaseUrl: "https://api.jiekou.ai/v3",
      configured: highwayKey || jiekouKey,
      models: ["gpt-image-2-light"],
      supportedSizes: ["1024x1024", "1024x1536", "1536x1024"],
      supportedModes: ["text-to-image", "image-edit"]
    }
  ];

  return {
    defaultProvider: "highway",
    providers,
    envVars: ["HIGHWAY_API_KEY", "JIEKOU_API_KEY", "HIGHWAY_IMAGE_BASE_URL"]
  };
}
