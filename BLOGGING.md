# Publishing on Anime Vault

1. Open https://app.pagescms.org and sign in with GitHub.
2. Install its GitHub App for Bigchassy/anime-vault only.
3. Select this repository and the main branch after the upgrade is merged.
4. Open Blog articles, add an article, and complete its fields.
5. Give each article a unique lowercase ID such as naruto-review. Keep it unchanged so links remain stable.
6. Upload a cover image, write your article, and turn on Show on website when ready.
7. Save. Changes are committed to GitHub and become visible after GitHub Pages finishes deploying. No HTML export is needed.

Articles use plain text with paragraph breaks. Existing sample posts can be edited or removed in the CMS. The website uses posts.json as its source and ignores browser-local posts. Export any valuable local posts before switching; copy their text into the CMS.

Unpublished articles are hidden from the website but remain readable in this PUBLIC GitHub repository. Do not store confidential drafts here. Editor access uses GitHub permissions; visitors cannot publish through the public website.

Article links use #post=ARTICLE-ID. Cover images use /anime-vault/media; adjust .pages.yml if your repository name or hosting path changes.

The homepage now uses anime-vault.png from the repository, replacing the old embedded image.
