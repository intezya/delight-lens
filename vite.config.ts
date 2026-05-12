// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { PluginOption } from "vite";

const reactGrabVirtualModuleId = "virtual:react-grab-dev";
const resolvedReactGrabVirtualModuleId = `\0${reactGrabVirtualModuleId}`;

function reactGrabDevPlugin(): PluginOption {
  return {
    name: "react-grab-dev",
    apply: "serve",
    enforce: "pre",
    resolveId(id) {
      if (id === reactGrabVirtualModuleId) {
        return resolvedReactGrabVirtualModuleId;
      }

      return null;
    },
    load(id) {
      if (id !== resolvedReactGrabVirtualModuleId) {
        return null;
      }

      return `
if (typeof window !== "undefined") {
  void import("/src/dev/react-grab-arrow-shim.ts");
}
`;
    },
    transform(code, id) {
      const normalizedId = id.replace(/\\/g, "/");

      if (!normalizedId.endsWith("/src/routes/__root.tsx")) {
        return null;
      }

      return `import "${reactGrabVirtualModuleId}";
${code}`;
    },
  };
}

export default defineConfig({
  plugins: [reactGrabDevPlugin()],
});
