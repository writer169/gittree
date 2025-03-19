// pages/index.js
import Head from 'next/head';
import Tree from '../components/Tree';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter

export default function Home() {
    const router = useRouter(); // Use useRouter hook

    // Get owner and repo from query parameters, or use defaults
    const [owner, setOwner] = useState(router.query.owner || 'facebook');
    const [repo, setRepo] = useState(router.query.repo || 'react');


    const handleSubmit = (event) => {
        event.preventDefault();
        // Update the URL with the new owner and repo
        router.push(`/?owner=${owner}&repo=${repo}`, undefined, { shallow: true });

    };

    useEffect(() => {
      // Update state if query params change (e.g., via back/forward buttons)
       if(router.query.owner) {
           setOwner(router.query.owner)
       }
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
          <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="owner">Owner:</label>
                <input
                    type="text"
                    id="owner"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    required
                />
              </div>
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
              <button type='submit'>View</button>
          </form>

        <Tree owner={owner} repo={repo} />
      </main>
    </div>
  );
}
