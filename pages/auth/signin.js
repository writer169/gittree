// pages/auth/signin.js
import { getProviders, signIn, useSession } from "next-auth/react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SignIn({ providers }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const callbackUrl = router.query.callbackUrl || '/'; // Используем callbackUrl, если есть, иначе главная
      router.push(callbackUrl);
    }
  }, [status, router]);


  // Если сессия загружается, показываем индикатор загрузки
  if (status === "loading") {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }


  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <Head>
        <title>Sign In - GitHub Repo Viewer</title>
      </Head>
      <h1>GitHub Repository Viewer</h1>
      <h2>Sign In</h2>
      <div style={{ marginTop: "30px" }}>
        {Object.values(providers).map((provider) => (
          <div key={provider.name} style={{ marginBottom: "20px" }}>
            <button
              onClick={() => signIn(provider.id)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
