# GitHub Repo Health Reporter

A Node.js CLI tool that generates a health report for any GitHub repo using the Swytchcode CLI.

## Usage
node report.js facebook/react
## What it does
Takes a GitHub repo (owner/repo format) and prints a health report showing:
- Stars, open issues, open PRs
- Last commit date
- Contributor count
- Latest release
- Final status: Actively maintained / Needs attention / Inactive

## Tech Stack
- Node.js (plain, no framework)
- Swytchcode CLI as the execution layer for all GitHub API calls
- No external npm packages if possible — keep it simple

## Rules
- ALWAYS use --demo flag on all swytchcode exec calls
- Never use real API keys or credentials
- All Swytchcode calls use child_process.exec to shell out to the CLI
- Keep the script simple — this is a single file project (report.js)
- Output should be clean, emoji-formatted, readable in terminal

## Common Commands
```bash
# Run the reporter
node report.js facebook/react

# Discover available github methods
swytchcode discover "github repo information" --json

# Test a swytchcode call manually
swytchcode exec github.get_repo --demo
```

## Swytchcode Notes
- Installed globally, available as `swytchcode` in terminal
- Running in sandbox mode
- Use --json flag on discover/list commands for parseable output
- Error output comes on stderr as structured JSON

## Feedback to collect while building
- Were the github methods easy to discover?
- Was the output easy to parse?
- Were error messages clear?
- What would have made this easier?
