// pages/api/github/repos.js
import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ message: "GitHub token not configured" });
  }

  const octokit = new Octokit({ auth: githubToken });

  try {
    // Используем метод listForAuthenticatedUser вместо listForUser
    // Этот метод возвращает все репозитории, к которым имеет доступ авторизованный токен
    const { data } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100, // Максимальное количество на странице
      sort: 'updated', // Сортировка по дате обновления
      visibility: 'all' // Показывать все репозитории (public, private)
    });

    // Получаем только необходимые данные
    const repos = data.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      private: repo.private,
      owner: repo.owner.login // Добавляем владельца, т.к. могут быть репозитории разных пользователей
    }));

    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    if (error.status === 401) {
      res.status(401).json({ message: "Unauthorized. Check your GitHub token." });
    } else if (error.status === 403) {
      res.status(403).json({ message: "Forbidden. Check your token permissions." });
    } else {
      res.status(500).json({ message: "Error fetching from GitHub API", error: error.message });
    }
  }
}