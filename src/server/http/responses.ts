import { NextResponse } from "next/server";

export function ok<T>(data: T, message = "success") {
  return NextResponse.json({ code: 0, message, data });
}

export function fail(message: string, status = 400, code = status) {
  return NextResponse.json({ code, message, data: null }, { status });
}

export async function routeGuard<T>(handler: () => Promise<T | Response>) {
  try {
    const response = await handler();
    return response instanceof Response ? response : ok(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "请求失败";
    const status = message === "Unauthorized" ? 401 : 500;
    return fail(message, status);
  }
}
