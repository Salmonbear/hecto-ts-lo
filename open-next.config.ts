import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Serve prerendered pages (Plasmic catch-all) from the deployed static assets.
  incrementalCache: staticAssetsIncrementalCache,
});
