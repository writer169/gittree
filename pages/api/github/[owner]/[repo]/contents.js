// pages/api/github/[owner]/[repo]/contents.js
import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const { owner, repo, path = "" } = req.query;  // Получаем параметры из запроса
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ message: "GitHub token not configured" });
  }

  const octokit = new Octokit({ auth: githubToken });

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    // Более детальная обработка ошибок, в зависимости от статуса
    if (error.status === 404) {
      res.status(404).json({ message: "Repository or path not found" });
    } else if (error.status === 403) {
      res.status(403).json({ message: "Forbidden. Check your token permissions." });
    } else {
      res.status(500).json({ message: "Error fetching from GitHub API", error: error.message });
    }
  }
}
