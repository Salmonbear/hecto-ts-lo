import * as React from "react";
import {
  PlasmicComponent,
  extractPlasmicQueryData,
  ComponentRenderData,
  PlasmicRootProvider,
} from "@plasmicapp/loader-nextjs";
import type { GetStaticPaths, GetStaticProps } from "next";

import Error from "next/error";
import { useRouter } from "next/router";
import { PLASMIC } from "@/plasmic-init";

export default function PlasmicLoaderPage(props: {
  plasmicData?: ComponentRenderData;
  queryCache?: Record<string, any>;
}) {
  const { plasmicData, queryCache } = props;
  const router = useRouter();
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <Error statusCode={404} />;
  }
  const pageMeta = plasmicData.entryCompMetas[0];
  return (
    <div suppressHydrationWarning>
      <PlasmicRootProvider
        loader={PLASMIC}
        prefetchedData={plasmicData}
        prefetchedQueryData={queryCache}
        pageParams={pageMeta.params}
        pageQuery={router.query}
      >
        <PlasmicComponent component={pageMeta.displayName} />
      </PlasmicRootProvider>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { catchall } = context.params ?? {};
  const plasmicPath = typeof catchall === 'string' ? catchall : Array.isArray(catchall) ? `/${catchall.join('/')}` : '/';
  const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath);
  if (!plasmicData) {
    // non-Plasmic catch-all
    return { props: {} };
  }
  const pageMeta = plasmicData.entryCompMetas[0];
  // Cache the necessary data fetched for the page
  const queryCache = await extractPlasmicQueryData(
    <PlasmicRootProvider
      loader={PLASMIC}
      prefetchedData={plasmicData}
      pageParams={pageMeta.params}
    >
      <PlasmicComponent component={pageMeta.displayName} />
    </PlasmicRootProvider>
  );
  // No ISR: on Cloudflare Workers Plasmic's loader can't run at request time
  // (it compiles components with new Function, which Workers forbid), so every
  // Plasmic page must be prerendered at build time. Redeploy to pick up edits.
  return { props: { plasmicData, queryCache } };
}

const CMS_DATABASE_ID = "qu2Atc6RwmZBHivoW3xVKa";

function collectSlugs(node: any, out: Set<string>, depth = 0) {
  if (!node || typeof node !== "object" || depth > 12) return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectSlugs(n, out, depth + 1));
    return;
  }
  const slug = node?.data?.slug;
  if (typeof slug === "string" && slug) out.add(slug);
  Object.values(node).forEach((v) => collectSlugs(v, out, depth + 1));
}

// Slugs for /resources/[slug]. Source 1: the CMS rows already fetched for the
// /resources listing page. Source 2 (optional, needs build env vars
// PLASMIC_CMS_PUBLIC_TOKEN and PLASMIC_CMS_TABLE): query the CMS directly.
async function discoverResourceSlugs(): Promise<string[]> {
  const slugs = new Set<string>();
  try {
    const data = await PLASMIC.maybeFetchComponentData("/resources");
    if (data && data.entryCompMetas.length > 0) {
      const meta = data.entryCompMetas[0];
      const cache = await extractPlasmicQueryData(
        <PlasmicRootProvider
          loader={PLASMIC}
          prefetchedData={data}
          pageParams={meta.params}
        >
          <PlasmicComponent component={meta.displayName} />
        </PlasmicRootProvider>
      );
      collectSlugs(cache, slugs);
    }
  } catch (e) {
    console.error("resource slug discovery (listing page) failed", e);
  }
  const token = process.env.PLASMIC_CMS_PUBLIC_TOKEN;
  const table = process.env.PLASMIC_CMS_TABLE;
  if (token && table) {
    try {
      const limit = 100;
      for (let offset = 0; offset < 5000; offset += limit) {
        const q = encodeURIComponent(JSON.stringify({ limit, offset }));
        const res = await fetch(
          `https://data.plasmic.app/api/v1/cms/databases/${CMS_DATABASE_ID}/tables/${table}/query?q=${q}`,
          { headers: { "x-plasmic-api-cms-tokens": `${CMS_DATABASE_ID}:${token}` } }
        );
        if (!res.ok) throw new globalThis.Error(`CMS query failed: ${res.status}`);
        const rows = ((await res.json()) as any).rows ?? [];
        collectSlugs(rows, slugs);
        if (rows.length < limit) break;
      }
    } catch (e) {
      console.error("resource slug discovery (CMS API) failed", e);
    }
  }
  console.log(`Discovered ${slugs.size} resource slugs`);
  return Array.from(slugs);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pageModules = await PLASMIC.fetchPages();
  const paths = new Map<string, { params: { catchall: string[] } }>();
  const add = (path: string) => {
    paths.set(path, { params: { catchall: path.substring(1).split("/") } });
  };
  pageModules.forEach((mod) => add(mod.path));
  (await discoverResourceSlugs()).forEach((slug) => add(`/resources/${slug}`));
  return {
    paths: Array.from(paths.values()),
    // Unknown paths 404 instead of trying to render at request time (which
    // can't work on Workers).
    fallback: false,
  };
}
