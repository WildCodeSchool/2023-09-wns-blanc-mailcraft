import Head from "next/head";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>MailCraft</title>
        <meta name="description" content="MailCraft" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main-content">{children}</main>
    </>
  );
}

export default Layout;
