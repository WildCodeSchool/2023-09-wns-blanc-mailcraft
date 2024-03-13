import dynamic from "next/dynamic";
import "@/styles/globals.css";
import Layout from "@/components/Layout";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
);

export default dynamic(() => Promise.resolve(App), { ssr: false });
