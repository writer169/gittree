// pages/index.js
import Head from 'next/head';
import Tree from '../components/Tree';
import { useState } from 'react';

export default function Home() {
    const [owner, setOwner] = useState('facebook'); // Default owner
    const [repo, setRepo] = useState('react');   // Default repository

    const handleSubmit = (event) => {
        event.preventDefault();
        // You could add validation here to check if owner and repo are valid.
    };

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
                {/*  No submit button needed, changes are live */}
          </form>

        <Tree owner={owner} repo={repo} />
      </main>
    </div>
  );
}
