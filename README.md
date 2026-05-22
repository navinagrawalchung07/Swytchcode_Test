# GitHub Repo Health Reporter

A Node.js CLI tool that generates a health report for any GitHub repository using the [Swytchcode](https://swytchcode.com) CLI.

## What it shows

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GitHub Health Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📦 Repo          facebook/react
  📝 Description   The library for web and native user interfaces.
  ⭐ Stars         245,166
  🐛 Open issues   1,309 (includes PRs)
  🕐 Last commit   May 21, 2026 (0d ago)
  👥 Contributors  30+
  🏷️  Latest release v19.2.6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🟢 Actively maintained
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Status logic:**
- 🟢 Actively maintained — last commit within 30 days
- 🟡 Needs attention — last commit within 180 days
- 🔴 Inactive — no commits in over 180 days

## Prerequisites

1. **Node.js** — v18 or higher
2. **Swytchcode CLI**
   ```bash
   npm install -g swytchcode
   ```
3. **Swytchcode account**
   ```bash
   swytchcode login
   ```
4. **GitHub token** — free to create at [github.com/settings/tokens](https://github.com/settings/tokens)
   ```bash
   swytchcode login github
   # paste your GitHub token when prompted
   ```

## Setup

```bash
git clone https://github.com/navinagrawalchung07/Swytchcode_Test.git
cd Swytchcode_Test

# Add your GitHub token to a local .env file (never committed)
echo "GITHUB_TOKEN=your_token_here" > .env
```

## Usage

```bash
node report.js <owner>/<repo>
```

**Examples:**
```bash
node report.js facebook/react
node report.js microsoft/vscode
node report.js torvalds/linux
node report.js your-username/your-repo
```

## Notes

- The `.env` file is gitignored — your token stays local
- Contributor count shows the first page (30+) returned by the GitHub API
- Open issues count includes both issues and pull requests (GitHub API combines them)
