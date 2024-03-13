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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css" rel="stylesheet" />
      </Head>
      <main className="main-content">{children}</main>
    </>
  );
}

export default Layout;
