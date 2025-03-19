// pages/index.js
import Head from 'next/head';
import Tree from '../components/Tree';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  console.log("Home component rendered"); // Лог при рендеринге компонента

  const router = useRouter();
  const { data: session, status } = useSession();
  const owner = 'writer169';
  const [repo, setRepo] = useState('');

  console.log("useSession status:", status); // Лог статуса сессии
  console.log("useSession session:", session); // Лог данных сессии

  useEffect(() => {
      console.log("useEffect for initializing repo triggered. router.query:", router.query);
      if (router.query.repo) {
          setRepo(router.query.repo);
      }
  }, [router.query.repo]);


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit triggered. repo:", repo);
    router.push(`/?repo=${repo}`, undefined, { shallow: true });
  };

  if (status === "loading") {
    console.log("Loading state");
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    useEffect(() => {
      console.log("useEffect for redirect triggered. Status:", status);
      router.push('/api/auth/signin');
      // }, [router]); //  Закомментировал - первоначальная версия
    }, [router, status]); // Временно добавили status для отладки

    return <div style={{ padding: "40px", textAlign: "center" }}>Redirecting to sign in...</div>;
  }

  if (status === "authenticated" && !session.isAllowed) {
    console.log("Unauthorized access");
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Unauthorized Access</h1>
        <p>You are not authorized to view this content.</p>
        <button
          onClick={() => {
            console.log("Sign Out button clicked");
            signOut();
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  console.log("Rendering main content"); // Лог перед рендерингом основного содержимого

  return (
    <div>
      <Head>
        <title>GitHub Repo Viewer</title>
        <meta name="description" content="View GitHub repository structure" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>GitHub Repository Viewer</h1>
          <div>
            {session && (
              <span style={{ marginRight: "10px" }}>
                Signed in as {session.user.email}
              </span>
            )}
            <button
              onClick={() => {
                console.log("Sign Out button clicked");
                signOut();
              }}
              style={{
                padding: "8px 12px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        <p>Owner: {owner}</p>
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label htmlFor="repo">Repository:</label>
            <input
              type="text"
              id="repo"
              value={repo}
              onChange={(e) => {
                console.log("Repo input changed:", e.target.value);
                setRepo(e.target.value);
              }}
              required
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              View
            </button>
          </div>
        </form>

        <Tree owner={owner} repo={repo} />
      </main>
    </div>
  );
}
