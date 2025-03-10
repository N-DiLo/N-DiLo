import fetch from 'node-fetch';

export default async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'vercel-serverless-function',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json();
    const repoStatus = repos.map(repo => ({
      name: repo.name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
    }));

    res.status(200).json({ username, repos: repoStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};