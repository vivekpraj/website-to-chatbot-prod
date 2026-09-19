# Brag Plan: CustomBot

## What is this app?
CustomBot turns any website into a trained AI chatbot in minutes — paste a URL, watch it crawl and learn, then embed the floating bubble widget anywhere.

## The angle
Your website has been silently ignoring questions for years. CustomBot fixes that. The video shows the exact moment a static website becomes something that *talks back* — from URL input to real chatbot answer, in one continuous reveal.

## Hook (first 2-3 seconds)
Text builds on a black screen: "Your website…" pause "…can't answer questions." The anti-pitch. Sets up the problem in 2.5 seconds without being a generic SaaS pain-point slide.

## Key moments (the middle)
- User types a URL into the CustomBot dashboard — training kicks off — progress flows through Crawling → Embedding → Saving → a green READY badge pops in
- The floating bubble widget appears in the corner of a sample site — user asks a question — bot types the answer back, character by character
- "Instant answers. 24/7. Unlimited patience." — three lines arriving one by one, direct from the site's own copy

## Outro / punchline
CustomBot logo with gradient glow. Tagline: "Turn any website into a chatbot." Pause. Small: "Free to start." Clean fade.

## User flow worth showing
1. Entry — user pastes a URL into the dashboard create-bot input
2. Key action — training pipeline progress: Crawling → Embedding → Saving → Ready (real status labels from the backend)
3. Result — floating bubble chatbot on a website surface, question typed, answer appears

## Tone
- Preset: `default`
- Creative direction: confident tech reveal — the product is real, the pipeline is real, show it doing the thing
- Interpretation: warm, clean pacing with room to breathe; the product's own copy carries the personality ("unlimited patience"); no hype language added

## Format: landscape — 1280x720
## Duration: 20 seconds

## Visual identity (from the project)
- Background: #000000 (pure black, site uses `bg-black`)
- Accent primary: #a855f7 (purple-500) → #f97316 (orange-500) gradient
- Text: #ffffff white / #9ca3af gray-400 for body copy
- Display font: Geist Sans (the site's configured font-family); fallback: Inter, system-ui
- Body font: Geist Sans
- Strongest visual element: the purple-to-orange gradient — runs through logo, CTA buttons, hero headline, and bot icon background

## Share copy (draft)
Paste a URL. Get an AI chatbot that knows your entire website. CustomBot trains in minutes and lives on your site forever.

## Audio direction
- Role: warm upbeat business bed with UI pop-ins for training steps and a bell payoff on the logo
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` — most energetic, good for a product reveal
- Music treatment: start at 0, fade slightly under outro, volume 0.35
- Music cue guidance: bundled preset at `<skill-dir>/assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.json`; target 1-2 strong cues for the training-ready reveal and the logo slam; detect at composition time
- Audio-reactive treatment: subtle; use music RMS to make the purple gradient glow on the hero and give the bot widget gentle presence on bass beats. No waveform bars.
- SFX posture: moderate — UI sounds for training step reveals, keypress sounds during the typing animation, bell for the READY badge and logo
- Audio-coupled moments:
  - Scene 3 (training steps) — `interface/drop_001–003` as each status card arrives
  - Scene 3 (READY badge) — `impact/impactBell_heavy_000` when green badge pops in
  - Scene 4 (bot typing) — `keyboard/keypress-*.wav` randomized per character
  - Scene 5 (logo) — `impact/impactSoft_medium_001` on logo arrival, music fades
- Restraint rule: no SFX in scenes 1 and 2; let the hook land clean before audio layer builds

---

## Storyboard

### Scene 1 — Hook — 2.5s
Black screen. White text appears in two beats:
- Line 1: "Your website…" — fades in at 0.3s, holds
- Line 2: "…can't answer questions." — slides in at 1.2s, holds 1s+
Font: large display, center aligned. No gradient here — pure white on black.
Sequential/interaction: yes — line 1 appears, then line 2
Audio intent: silence here — no music, no SFX; the hook lands in silence
Audio-coupled idea: none — intentional pause before music enters
Music: none (silence in this scene only)
Transition mood: hard cut → Scene 2

### Scene 2 — Reveal — 3s
CustomBot logo (bot icon + gradient wordmark) fades in center screen with a subtle glow bloom.
Below it, the hero headline from the site appears in two lines, gradient text:
- "TURN YOUR CONTENT"
- "INTO CONVERSATIONS."
Music enters at this cut — upbeat track fades in from 0.
Sequential/interaction: logo arrives first (0.3s), then headline lines stagger in
Audio intent: music energy enters — feel the shift from silence to forward motion
Audio-coupled idea: logo arrival → `impact/impactSoft_medium_001` at low volume
Music: happy-beats-vol-1, fade in from 0 to 0.35
Transition mood: clean wipe → Scene 3

### Scene 3 — Training Pipeline — 7s
Recreate the dashboard bot creation flow. Dark card on black, subtle purple border.
URL input field — text "yourwebsite.com" types in character by character (1.5s)
Training progress cards appear one by one below:
- 🕷️ Crawling your website… (arrives at 2.0s)
- 🧠 Reading and embedding… (arrives at 2.8s)  
- 💾 Saving to knowledge base… (arrives at 3.6s)
- ✅ READY (green badge slams in at 4.8s) — this is the payoff
Sequential/interaction: yes — URL typed, then 3 status steps arrive sequentially, then READY badge
Audio intent: building energy as steps arrive; bell on READY
Audio-coupled idea: each status card → `interface/drop_001`, `drop_002`, `drop_003`; READY badge → `impact/impactBell_heavy_000` beat-locked to a strong cue
Music: continuing, full volume
Transition mood: soft crossfade → Scene 4

### Scene 4 — Bot in the Wild — 4.5s
A simple "website" surface (dark page mock) with the floating purple→orange bubble widget in the bottom right.
Widget opens — shows the chat interface.
A question types in: "Do you offer free shipping?"
Bot responds, typing character by character: "Yes! We offer free shipping on all orders over $50."
Sequential/interaction: yes — widget opens, user question types, bot answer types back
Audio intent: warm and satisfying — the product working
Audio-coupled idea: user typing → `keyboard/keypress-*.wav` randomized; bot response typing → same keypress set at slightly lower volume; feel of a real conversation
Music: full
Transition mood: clean wipe → Scene 5

### Scene 5 — Outro — 3s
CustomBot logo centered, full gradient glow. Two lines of text:
- "Turn any website into a chatbot."
- "Free to start."
Subtle purple glow radiates from the logo on arrival.
Sequential/interaction: logo arrives (0.3s), first line fades in (0.7s), second line (1.3s)
Audio intent: warm landing — the payoff
Audio-coupled idea: logo → `impact/impactSoft_medium_001`; music fades to 0 over last 1.5s
Music: fades out
Transition mood: fade to black

**Music mood for this video:** upbeat, forward-moving, clean business energy
**Audio summary:** Silence in the hook → music enters on the reveal → builds with UI pops through the training pipeline → bell on READY → warm landing on the logo with a gentle fade-out.
