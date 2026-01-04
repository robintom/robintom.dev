---
title: "Git stash with --patch for selective stashing"
date: 2026-01-04
description: "Stash only specific changes interactively"
tags: ["git"]
---

TIL you can use `git stash --patch` (or `-p`) to interactively select which hunks to stash:

```bash
git stash -p
```

Git will show you each change and ask if you want to stash it. Super useful when you have mixed changes and only want to stash some of them.

Options at each hunk:
- `y` - stash this hunk
- `n` - don't stash this hunk
- `s` - split into smaller hunks
- `q` - quit (stash what you've selected so far)
