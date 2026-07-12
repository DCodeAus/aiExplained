# AI Explained - A Beginner's Guide to LLMs

A small static website that explains AI and large language models for complete beginners: tokens, training, prompting, and agents - with interactive demos and a game layer (points, levels, badges, and quizzes on every page; progress saves in the browser via localStorage). No frameworks, no build step; just HTML, CSS and vanilla JavaScript.

## Pages

- `index.html` - home, the 60-second version, myths busted
- `tokens.html` - how AI reads (with an interactive tokeniser)
- `training.html` - how models learn (with a next-token prediction demo)
- `using-ai.html` - prompts, context windows, temperature, hallucinations (with a temperature slider)
- `agents.html` - tool use and agent loops (with a step-through demo)
- `models.html` - history of AI, the researchers behind the models, plus Copilot 365 vs Claude vs Codex: plans, limits, and setup (date-stamped snapshot)
- `australians.html` - notable Australians in AI, from Ross Quinlan to Jeremy Howard
- `safety.html` - what never to paste into a chatbot, and honest AI use while studying (with quiz)
- `final-challenge.html` - a final hands-on challenge with a persistent checklist and the final badge
- `glossary.html` - plain-English jargon buster

## Hosting on GitHub Pages

1. Create a new repository on GitHub (e.g. `ai-explained`). Make it **Public**.
2. Upload all the files in this folder to the repository (drag-and-drop works on github.com: **Add file → Upload files**).
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**, choose the `main` branch and `/ (root)` folder, then **Save**.
5. Wait a minute or two. Your site will be live at:
   `https://<your-username>.github.io/ai-explained/`

Any time you edit and commit a file, the site updates automatically within a few minutes.

## Local preview

Just open `index.html` in a browser - no server needed.
