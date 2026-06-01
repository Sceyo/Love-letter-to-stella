Prompt:
Build a romantic interactive web experience deployed on Vercel. Use a Next.js App Router project structure with TypeScript and Tailwind CSS.

Project Structure
/app
  layout.tsx
  page.tsx
/components
  FallingElements.tsx
  LoveModal.tsx
  NoButton.tsx
/public
  modal-bg.jpg        ← placeholder, easy to swap

Background & Atmosphere
In FallingElements.tsx, create a fullscreen animated layer with continuously falling flowers (🌸🌺🌹🌼) and hearts (🤍🩷❤️💕). Use useEffect with setInterval or requestAnimationFrame to spawn new elements at randomized:

Horizontal positions
Fall speeds
Sizes (1rem to 2.5rem)
Rotation angles
Opacity (slight fade-in at top, fade-out at bottom)

Remove elements from state once they fall below 100vh to avoid memory leaks. The layer should sit behind all content using fixed inset-0 pointer-events-none z-0.

Main Page (page.tsx)
Center a content block both vertically and horizontally using Tailwind (flex items-center justify-center min-h-screen). It should contain:

A bold romantic heading:
"Do you still love me?"
Use the Google Font Playfair Display or Dancing Script, loaded via next/font/google. Style it large (text-5xl to text-7xl), bold, with a soft drop shadow (drop-shadow-lg) for readability over the animated background. Color: deep rose or white depending on contrast needs.
Two buttons rendered side by side below the phrase:

"Yes 💖" — warm pink/rose Tailwind classes, pill-shaped (rounded-full), with hover:scale-110 and a subtle glow via hover:shadow-pink-400.
"No 💔" — rendered via the <NoButton /> component (see below).




LoveModal.tsx — "Yes" Button Behavior
When the user clicks Yes, show a fullscreen modal that:

Uses a fixed inset-0 z-50 overlay with a smooth opacity-0 → opacity-100 transition using Tailwind's transition-opacity duration-500.
Sets the background image via a Next.js <Image /> component with fill and object-cover, sourced from /public/modal-bg.jpg. Add a clearly labeled comment:

tsx  {/* 👇 Replace modal-bg.jpg in /public with your own photo */}

Displays centered text "I love you too 🥰" in large, bold, white font with drop-shadow-xl for readability.
Includes a close button (✕) in the top-right corner (absolute top-4 right-4) that sets modal state to closed.
Accepts an isOpen and onClose prop from page.tsx.


NoButton.tsx — "No" Button Behavior
The No button should:

Use position: fixed with top and left stored in useState, initialized to the center of the screen.
On click AND on mouseenter, immediately recalculate a new random position using:

ts  const newX = Math.random() * (window.innerWidth - buttonWidth);
  const newY = Math.random() * (window.innerHeight - buttonHeight);
Account for button dimensions to keep it fully within viewport bounds at all times.

Never stop — this behavior runs infinitely with no escape.
Use useRef to get the button's actual dimensions for accurate boundary calculation.
Add a short transition (transition-all duration-100) so the movement feels snappy but not jarring.
Style it with Tailwind: muted/neutral colors, rounded-full, z-50.


Tech & Vercel Requirements

Framework: Next.js 14+ with App Router
Language: TypeScript
Styling: Tailwind CSS
Fonts: next/font/google (no external <link> tags — Vercel optimizes these automatically)
Images: next/image with fill for the modal background (required for Vercel image optimization)
No .env needed — no API keys or secrets
Add a vercel.json only if needed; default Next.js config should deploy with zero configuration
The project should be deployable by running:

bash  npx create-next-app@latest
  # then replace files with the generated code
  vercel deploy

Add a brief README.md explaining:

How to replace the modal background image (/public/modal-bg.jpg)
How to change the phrase text
How to deploy to Vercel