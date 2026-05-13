import { createMiddleware, createStart } from "@tanstack/react-start";

const noStoreCacheControl = "no-store, max-age=0, must-revalidate";

const cacheControlMiddleware = createMiddleware().server(async ({ next, pathname }) => {
  const result = await next();

  if (!pathname.startsWith("/assets/")) {
    result.response.headers.set("Cache-Control", noStoreCacheControl);
    result.response.headers.set("Pragma", "no-cache");
    result.response.headers.set("Expires", "0");
  }

  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [cacheControlMiddleware],
}));
