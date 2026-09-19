# Hyperframes Composition Brief: CustomBot

## Objective
Create a short launch-style brag video for CustomBot — a SaaS platform that turns any website into a trained AI chatbot.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1280x720
- Duration: 20 seconds

## Source Material
- Project root: `C:\Users\DELL\Documents\website-to-chatbot-prod\frontend`
- Primary files read: `app/page.tsx`, `app/globals.css`
- Product name: CustomBot
- Tagline / strongest claim: "Transform any website into an intelligent AI chatbot in minutes. Instant answers, 24/7 availability, unlimited patience."
- Key UI or visual moment to recreate: The bot training pipeline dashboard (URL input → Crawling → Embedding → Saving → READY) and the floating bubble widget with a live chat exchange
- Copy that must appear verbatim:
  - "TURN YOUR CONTENT INTO CONVERSATIONS."
  - "Instant answers. 24/7. Unlimited patience."
  - "Turn any website into a chatbot."
  - "Free to start."

## Creative Direction
- Tone preset: `default`
- Creative direction: confident tech reveal — show the product doing the real thing
- Interpretation: warm, clean pacing, 4-5 scenes with room to breathe; the product's own copy drives the personality; no SaaS jargon added
- Angle: The hook positions a static website as broken (can't answer questions), then CustomBot fixes it in a 7-second training sequence that shows the real pipeline — not a diagram of it, but the actual progress cards clients see
- Hook: "Your website… …can't answer questions." — two beats of white text on black, in silence
- Outro / punchline: CustomBot logo with gradient glow + "Turn any website into a chatbot." + "Free to start."
- Avoid:
  - Generic SaaS language ("streamline," "workflow," "leverage")
  - Abstract motion graphics that could belong to any tech video
  - Redesigning the product — use the actual purple→orange gradient palette from the site

## Visual Identity
- Background: #000000 (pure black)
- Text: #ffffff (white headlines), #9ca3af (gray-400 for secondary)
- Accent: linear-gradient from #a855f7 (purple-500) to #f97316 (orange-500)
- Display font: Geist Sans (fallback: Inter, system-ui, sans-serif)
- Body font: Geist Sans
- Visual references from the project:
  - Bot icon (lucide `Bot`) inside a purple→orange gradient rounded-xl badge
  - "CustomBot" wordmark in purple-to-orange gradient text
  - Dark cards with purple border (border-purple-500/20) on black background
  - Large hero text: font-black, gradient text from white→purple→orange
  - Rounded-full CTA buttons with purple→orange gradient fill

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook — 2.5s — "Your website… can't answer questions." White text on black. Silence.
2. Reveal — 3s — CustomBot logo + "TURN YOUR CONTENT INTO CONVERSATIONS." Music enters.
3. Training Pipeline — 7s — URL typed → crawling → embedding → saving → READY badge. Sequenced UI sounds.
4. Bot in the Wild — 4.5s — Floating bubble widget opens, user question types, bot answers. Keypress sounds.
5. Outro — 3s — Logo + tagline + "Free to start." Bell + music fade.

## Audio
- Audio role: silence for hook, then upbeat corporate bed with UI accents through the training flow, bell payoff on READY and logo
- Audio arc: dead silence → music enters on reveal → builds with UI pops → bell at READY → warm fade on outro
- Music: `assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`
- Music treatment: enters at scene 2 cut (2.5s), volume 0.35, fades to 0 over final 1.5s of outro
- Music cue guidance: bundled preset at `<skill-dir>/assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.json`; use 1-2 strong cues — one for the READY badge reveal (~10s mark), one for the logo slam (~17s mark); beat-grid for training step arrivals
- Audio-reactive treatment: subtle; use music RMS to make the purple→orange gradient glow on the logo/hero breathe gently; product card gets soft presence on bass beats; no waveform bars or equalizer visuals
- Audio-coupled moments:
  - Scene 3: each status card arrival → `interface/drop_001`, `drop_002`, `drop_003` (staggered)
  - Scene 3: READY badge → `impact/impactBell_heavy_000` (beat-locked to strong cue)
  - Scene 4: user question typing → `keyboard/keypress-*.wav` randomized per character
  - Scene 4: bot response typing → same keypress set at 0.6 volume
  - Scene 5: logo arrival → `impact/impactSoft_medium_001` at 0.65 volume
- SFX selection guidance: prefer low/medium HF-risk files for the training step pops; reserve the bell for READY and the logo only; keep keyboard sounds light and randomized so they don't sound robotic
- SFX analysis guidance: follow `sfx-analysis.md` in the brag skill assets for per-file HF risk
- Exact SFX choice: Hyperframes should choose filenames, timestamps, density, and volume based on the implemented animation
- Audio files: copy the chosen music and any selected SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. /brag is its own workflow: do not enter the Hyperframes entry-point intent interview and do not route into its generic promo/launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show the real training pipeline UI (Scene 3) and the floating bubble widget in action (Scene 4) — these are the product doing the thing, not a diagram of the thing
- Keep all text readable — every line holds long enough to be read at the reading-time floor
- Total duration: 20 seconds
- Include the planned music/SFX layer
- Scene 1 must be silent — music enters only at Scene 2
- Audio-reactive glow on the gradient elements is preferred if extraction is available
- Beat-lock the READY badge reveal and the logo slam to strong cues if the cue file supports it
- Run `hyperframes check` before render
