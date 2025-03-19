// pages/auth/error.js
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Error() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <Head>
        <title>Error - GitHub Repo Viewer</title>
      </Head>
      <h1>Authentication Error</h1>
      <div style={{ marginTop: "20px", color: "red" }}>
        <p>Sorry, you are not authorized to access this application.</p>
        <p>Error: {error}</p>
      </div>
      <button
        onClick={() => router.push('/api/auth/signin')}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
