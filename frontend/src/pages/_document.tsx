import { Html, Head, Main, NextScript } from "next/document";
import { Editor } from "@tinymce/tinymce-react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script>
        <Editor apiKey='dgcriwniq8gnaafcf24ytjx944q7lnb8hiwa03t9l788b4fc' init={{ /* your other settings */ }} />
      </body>
    </Html>
  );
}
