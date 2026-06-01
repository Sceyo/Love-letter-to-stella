# Stella — Romantic Interactive Web Experience

A fun "Do you still love me?" page with falling flowers/hearts, a fleeing No button, and a fullscreen love modal.

## Customization

### Replace the modal background photo
Drop your own image into `/public/` named `modal-bg.jpg`. It will be displayed fullscreen when the user clicks **Yes 💖**. If the file is missing a rose-pink gradient is shown instead.

### Change the main phrase
Open `app/page.tsx` and edit the `<h1>` text:
```tsx
<h1 ...>Do you still love me?</h1>
```

### Change the modal response text
Open `components/LoveModal.tsx` and edit:
```tsx
<p ...>I love you too 🥰</p>
```

## Deploy to Vercel

```bash
# 1. Install dependencies
npm install

# 2. Run locally to preview
npm run dev

# 3. Deploy
npx vercel
```

No environment variables are required. Vercel auto-detects Next.js — zero config needed.
