# pangenome.ai

Source for the [pangenome.ai](https://pangenome.ai) website. Built with [Hugo](https://gohugo.io). Deployed to GitHub Pages.

## Run locally

Install Hugo (extended) once:

```bash
# macOS
brew install hugo

# or download a binary: https://github.com/gohugoio/hugo/releases
```

Then from this folder:

```bash
hugo server
```

Open <http://localhost:1313>. The server live-reloads as you edit.

## Edit content

Everything is plain Markdown.

| What                 | File                                                    |
| -------------------- | ------------------------------------------------------- |
| Home page hero text  | `layouts/index.html`                                    |
| About                | `content/about.md`                                      |
| For Investors        | `content/for-investors.md`                              |
| For Research         | `content/for-research.md`                               |
| Contact              | `content/contact.md`                                    |
| Privacy policy       | `content/privacy-policy.md`                             |
| Blog posts           | `content/posts/*.md`                                    |
| Site config          | `hugo.toml`                                             |
| Styling              | `static/css/style.css`                                  |

### Add a new blog post

```bash
hugo new posts/my-new-post.md
```

Edit the frontmatter and write Markdown below. To change the colour of the post card on the home page and post list, set `hue` in the frontmatter to a number 0–360 (try 28 for warm, 210 for blue, 145 for green).

To use a real hero image: drop the file into `static/images/posts/` and set `image: /images/posts/your-file.jpg` in the post's frontmatter.

### Replace placeholder assets

Two assets are placeholders that you may want to replace with your real brand files:

- `static/images/favicon.svg` — currently a minimal SVG. Replace with your real favicon if you have one.
- The brand mark in `layouts/partials/header.html` — currently an inline SVG wordmark. Replace the `<svg>` block with `<img src="/images/logo.png" alt="Pangenome AI">` once you've added a `logo.png` to `static/images/`.

## Deploy

The site auto-deploys to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`. To enable:

1. Push this repo to GitHub.
2. Go to **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The next push to `main` will build and deploy.

### Custom domain

`static/CNAME` already contains `pangenome.ai`. To point the domain at GitHub Pages once you're ready to cut over:

- At your DNS provider, add `A` records for `pangenome.ai` pointing to GitHub's IPs:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- Add a `CNAME` record for `www.pangenome.ai` pointing to `<your-github-username>.github.io`.
- In **Settings → Pages**, verify the custom domain and enable **Enforce HTTPS**.

## Why Hugo?

Single static binary, no `node_modules`, builds the whole site in milliseconds. New posts are just Markdown files. Easy to maintain on a laptop, easy to sync via git, easy to deploy anywhere.

## License

Content © Pangenome AI. Code structure freely reusable.
