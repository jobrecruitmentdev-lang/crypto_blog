# Project Rules & Directives

**CRITICAL DIRECTIVE FOR ALL AGENTS**

1. **AUTOMATIC GIT PUSH ON CODE MODIFICATIONS**:
   - Whenever any task, bug fix, refactor, or feature is completed and verified, the agent MUST automatically stage, commit (using concise conventional commit messages), and push the changes directly to the remote GitHub repository branch (`origin main` or active branch).
   - This ensures that automated CI/CD pipelines (e.g. GitHub Actions FTP deployment to Hostinger) trigger immediately without requiring manual developer push commands.

2. **PRODUCTION & LIVE SERVER SAFETY**:
   - Live servers (Hostinger, cPanel, VPS SSH) are READ-ONLY for agents.
   - Do NOT run destructive remote file editing scripts directly on live servers.
   - Always push changes to GitHub so the automated deployment pipeline handles the deployment safely.

3. **ZERO FALSE POSITIVES & STRICT DOUBLE CROSS-CHECKING**:
   - Never assume or provide premature/false positive success reports.
   - Every verification must be double cross-checked across all variations (e.g., test URLs BOTH with trailing slash `/` and without trailing slash, verify response codes, inspect body contents).
   - If any permutation returns 4xx, 5xx, or unexpected behavior, the agent must fix and re-verify before reporting.
