// components/Tree.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/Tree.module.css';

function Tree({ owner, repo }) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false); // State for copy button feedback


  useEffect(() => {
    async function fetchRepoData() {
      setLoading(true);
      setError(null);
      setCopied(false); // Reset copied state on new repo load

      try {
          const response = await fetch(`/api/github/${owner}/${repo}/contents`);
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTreeData(buildTree(data));

      } catch (err) {
        setError(err.message);
        console.error("Error fetching repo:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRepoData();
  }, [owner, repo]);



    function buildTree(data, path = "") {
        const tree = [];

        for (const item of data) {
            if (item.type === 'dir') {
                tree.push({
                    name: item.name,
                    type: 'directory',
                    path: item.path,
                    children: [], // Initially empty, will be populated on demand
                    expanded: false,
                });
            } else if (item.type === 'file') {
                tree.push({
                    name: item.name,
                    type: 'file',
                    path: item.path,
                    download_url: item.download_url
                });
            }
        }
        return tree;
    }

    async function fetchFolderContents(path, node) {
        try {
            const response = await fetch(`/api/github/${owner}/${repo}/contents?path=${path}`);
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return buildTree(data, path); // Build the subtree

        } catch (err) {
            console.error("Error fetching folder contents:", err);
            setError(err.message); // Display a general error or specific to this node.
            return []; // Return an empty array to prevent further errors
        }
    }


    const renderTree = (nodes, level = 0) => { // Add level for indentation
        return (
          <ul>
            {nodes.map((node, index) => (
              <li key={`${node.path}-${index}`}>
                {node.type === 'directory' ? (
                    <>
                        <span
                            className={styles.folder}
                            onClick={async () => {
                              // Toggle expanded state
                                const newTreeData = [...treeData];
                                const nodeIndex = newTreeData.findIndex(n => n.path === node.path);

                                if(nodeIndex !== -1){ //For root level nodes
                                    if (newTreeData[nodeIndex].expanded) {
                                       newTreeData[nodeIndex].expanded = false;
                                    } else {
                                        if (newTreeData[nodeIndex].children.length === 0) {
                                            newTreeData[nodeIndex].children = await fetchFolderContents(node.path, newTreeData[nodeIndex]);
                                        }
                                        newTreeData[nodeIndex].expanded = true;
                                    }
                                     setTreeData(newTreeData);

                                } else { //For nested nodes
                                    //Find the parent, and update children
                                    let pathParts = node.path.split("/");
                                    let currentLevel = newTreeData;
                                    for(let i = 0; i < pathParts.length -1; i++){ // -1 because last part is current node
                                        let nextLevel = currentLevel.find(n => n.name === pathParts[i] && n.type === 'directory');
                                         if(nextLevel){
                                             currentLevel = nextLevel.children;
                                         } else {
                                             //Shouldn't happen, but handle for robustness
                                             console.error("Path not found in tree");
                                             return;
                                         }
                                    }

                                    const nestedNodeIndex = currentLevel.findIndex(n => n.path === node.path);
                                      if (nestedNodeIndex !== -1) {
                                          if (currentLevel[nestedNodeIndex].expanded) {
                                               currentLevel[nestedNodeIndex].expanded = false;
                                          } else {
                                              if (currentLevel[nestedNodeIndex].children.length === 0) {
                                                 currentLevel[nestedNodeIndex].children = await fetchFolderContents(node.path, currentLevel[nestedNodeIndex]);
                                              }
                                              currentLevel[nestedNodeIndex].expanded = true;
                                          }

                                            // Since we modified a nested part, we still need to trigger a re-render.
                                           setTreeData([...newTreeData]); // Spread to create a new array to trigger update.
                                      }

                                }

                            }}
                        >
                    {node.expanded ? '[-]' : '[+]'} {node.name}
                    </span>
                    {node.expanded && node.children.length > 0 && renderTree(node.children, level + 1)}
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
            text += `${'  '.repeat(indent)}${node.type === 'directory' ? '[+] ' : ''}${node.name}\n`;
            if (node.type === 'directory' && node.expanded) {
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
    return <div>No data</div>; // Should not happen, but handle for completeness.
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
