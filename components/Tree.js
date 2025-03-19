// components/Tree.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/Tree.module.css';

function Tree({ owner, repo }) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchRepoData() {
      setLoading(true);
      setError(null);
      setCopied(false);

      try {
        const response = await fetch(`/api/github/${owner}/${repo}/contents`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTreeData(data); // Directly set the data, no buildTree needed

      } catch (err) {
        setError(err.message);
        console.error("Error fetching repo:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRepoData();
  }, [owner, repo]);


  const renderTree = (nodes, level = 0) => {
    return (
      <ul>
        {nodes.map((node, index) => (
          <li key={`${node.path}-${index}`}>
            {node.type === 'directory' ? (
              <>
                <span className={styles.folder}>
                  {/* No expand/collapse logic needed */}
                  {node.name}
                </span>
                {node.children && node.children.length > 0 && renderTree(node.children, level + 1)}
              </>
            ) : (
              <a href={node.download_url} target="_blank" rel="noopener noreferrer">
                {node.name}
              </a>
            )}
          </li>
        ))}
      </ul>
    );
  };

      // Function to convert tree data to text
    const treeToText = (nodes, indent = 0) => {
        let text = '';
        for (const node of nodes) {
            text += `${'  '.repeat(indent)}${node.type === 'directory' ? '' : ''}${node.name}\n`;
            if (node.type === 'directory') {
                text += treeToText(node.children, indent + 1);
            }
        }
        return text;
    };

  // Function to copy text to clipboard
    const copyToClipboard = async () => {
      if(!treeData) return;

        const text = treeToText(treeData);
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true); // Set copied state to true
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds

        } catch (err) {
            console.error('Failed to copy:', err);
            //  Handle error (e.g., show a message to the user)
        }
    };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!treeData) {
    return <div>No data</div>;
  }

  return (
    <div className={styles.treeContainer}>
      <button onClick={copyToClipboard} disabled={!treeData} className={styles.copyButton}>
        {copied ? 'Copied!' : 'Copy Tree'}
      </button>
      {renderTree(treeData)}
    </div>
  );
}

export default Tree;
