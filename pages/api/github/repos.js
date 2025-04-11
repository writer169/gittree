// pages/api/github/repos.js
import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const githubToken = process.env.GITHUB_TOKEN;
  const owner = req.query.owner || 'writer169'; // По умолчанию используем текущего пользователя

  if (!githubToken) {
    return res.status(500).json({ message: "GitHub token not configured" });
  }

  const octokit = new Octokit({ auth: githubToken });

  try {
    const { data } = await octokit.repos.listForUser({
      username: owner,
      per_page: 100, // Максимальное количество на странице
      sort: 'updated', // Сортировка по дате обновления
    });

    // Получаем только необходимые данные
    const repos = data.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      private: repo.private
    }));

    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    if (error.status === 404) {
      res.status(404).json({ message: "User not found" });
    } else if (error.status === 403) {
      res.status(403).json({ message: "Forbidden. Check your token permissions." });
    } else {
      res.status(500).json({ message: "Error fetching from GitHub API", error: error.message });
    }
  }
}