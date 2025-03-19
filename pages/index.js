// pages/index.js
import Head from 'next/head';
import Tree from '../components/Tree';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const owner = 'writer169'; // Hardcoded owner
  const [repo, setRepo] = useState(router.query.repo || 'gittree'); // Use router.query.repo

  // Check authentication status
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  // Handle unauthorized user
  if (status === "authenticated" && !session.isAllowed) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Unauthorized Access</h1>
        <p>You are not authorized to view this content.</p>
        <button
          onClick={() => signOut()}
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

  // Loading state
  if (status === "loading" || status === "unauthenticated") {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push(`/?repo=${repo}`, undefined, { shallow: true }); // Only update repo
  };

  useEffect(() => {
    // Update state if query params change (e.g., via back/forward buttons)
    if(router.query.repo) {
      setRepo(router.query.repo)
    }
  }, [router.query]);

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
            <span style={{ marginRight: "10px" }}>
              Signed in as {session.user.email}
            </span>
            <button
              onClick={() => signOut()}
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
              onChange={(e) => setRepo(e.target.value)}
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
