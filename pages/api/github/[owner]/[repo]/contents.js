// pages/api/github/[owner]/[repo]/contents.js
import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const { owner, repo, path = "" } = req.query;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ message: "GitHub token not configured" });
  }

  const octokit = new Octokit({ auth: githubToken });

  async function getContentsRecursive(owner, repo, path) {
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      const contents = [];
      for (const item of data) {
        if (item.type === 'dir') {
          const subContents = await getContentsRecursive(owner, repo, item.path);
          contents.push({
            name: item.name,
            type: 'directory',
            path: item.path,
            children: subContents,
            // No expanded property needed here
          });
        } else if (item.type === 'file') {
          contents.push({
            name: item.name,
            type: 'file',
            path: item.path,
            download_url: item.download_url
          });
        }
      }
      return contents;
    } catch (error) {
        //Очень важно обрабатывать ошибки внутри рекурсивной функции!
        console.error(`Error fetching contents for path ${path}:`, error);
        if (error.status === 404) { // Handle 404 specifically
            return []; // Return an empty array for a missing directory
        } else {
            throw error;  // Re-throw other errors
        }
    }
  }

  try {
      const treeData = await getContentsRecursive(owner, repo, path);
      res.status(200).json(treeData);

  } catch (error) {
    console.error(error);
    if (error.status === 404) {
      res.status(404).json({ message: "Repository or path not found" });
    } else if (error.status === 403) {
      res.status(403).json({ message: "Forbidden. Check your token permissions." });
    } else {
      res.status(500).json({ message: "Error fetching from GitHub API", error: error.message });
    }
  }
}
