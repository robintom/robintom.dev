# Robin Tom's Blog

A minimal developer blog built with Hugo.

## Quick Start

### Prerequisites

Install Hugo (extended version not required):

```bash
# macOS
brew install hugo

# Windows (scoop)
scoop install hugo

# Windows (choco)
choco install hugo

# Linux (snap)
snap install hugo
```

### Development

```bash
# Start dev server with drafts
hugo server -D

# Site available at http://localhost:1313
# Auto-reloads on file changes
```

### Create New Post

```bash
hugo new posts/my-new-post.md
```

Edit the file in `content/posts/my-new-post.md`. Set `draft: false` when ready to publish.

### Build for Production

```bash
hugo --minify
```

Output goes to `public/` directory.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create new project → Connect to Git → Select your repo
4. Build settings:
   - **Build command**: `hugo --minify`
   - **Build output directory**: `public`
   - **Environment variable**: `HUGO_VERSION` = `0.140.0`
5. Deploy!

Every push to `main` will auto-deploy.

## Project Structure

```
├── content/posts/    # Blog posts (markdown)
├── content/about.md  # About page
├── layouts/          # HTML templates
├── static/css/       # Stylesheet
├── static/js/        # Theme toggle
└── hugo.toml         # Configuration
```

## Customization

- **Site title/author**: Edit `hugo.toml`
- **Colors**: Edit CSS variables in `static/css/style.css`
- **Intro text**: Edit `layouts/index.html`
- **About page**: Edit `content/about.md`

## Documentation

See `DEVLOG.md` for detailed explanations of how everything works.
