// pages/_app.js
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css'; // Make sure this file exists or create it if needed

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
