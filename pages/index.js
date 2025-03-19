// pages/index.js
import Head from 'next/head';
import Tree from '../components/Tree';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const owner = 'writer169'; // Hardcoded owner
  const [repo, setRepo] = useState(router.query.repo || 'gittree'); // Use router.query.repo


  const handleSubmit = (event) => {
    event.preventDefault();
    router.push(`/?repo=${repo}`, undefined, { shallow: true }); // Only update repo
  };


   useEffect(() => {
      // Update state if query params change (e.g., via back/forward buttons)

       if(router.query.repo) {
         setRepo(router.query.repo)
       }
    }, [router.query])

  return (
    <div>
      <Head>
        <title>GitHub Repo Viewer</title>
        <meta name="description" content="View GitHub repository structure" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>GitHub Repository Viewer</h1>
        <p>Owner: {owner}</p> {/* Display the hardcoded owner */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="repo">Repository:</label>
            <input
              type="text"
              id="repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              required
            />
          </div>
          <button type="submit">View</button>
        </form>

        <Tree owner={owner} repo={repo} />
      </main>
    </div>
  );
}
