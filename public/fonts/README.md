# Brand font

The landing page's display typeface is **Neue Kaine** (`--display` in
`app/landing.css`). The font file is not committed to this repository because it
is licensed separately.

To get the exact brand typography, drop the web build here:

```
public/fonts/neue-kaine.woff2
```

The `@font-face` rule at the top of `app/landing.css` already points at that
path and also tries `local("Neue Kaine")` first, so a system install works too.
Until the file exists, the display stack falls back to Geist and the page still
renders correctly — only the headline letterforms differ from the design.
