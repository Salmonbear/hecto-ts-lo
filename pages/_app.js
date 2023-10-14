import '../styles/globals.css'
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <><PlasmicRootProvider Head={Head}>
      <Component {...pageProps} />
    </PlasmicRootProvider><Script
      id="beam-analytics"
      strategy="afterInteractive"
      src="https://beamanalytics.b-cdn.net/beam.min.js"
      data-token="f76cd8af-c1f3-4945-8694-b3733e439047"
      async>
    </Script><Script
      id="plausible"
      defer data-domain="hecto.io"
      src="https://plausible.io/js/script.js">
      </Script>
    </>
  );
}
export default MyApp
