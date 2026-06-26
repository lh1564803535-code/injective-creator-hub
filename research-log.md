# Research Log

## 2026-06-25 — canvas-confetti Advanced Effects

### Topic
canvas-confetti React animation examples: custom shapes, emoji effects, star particles, and advanced configuration for creator economy UIs.

### Findings

**1. Star & Custom Shape Support**
canvas-confetti natively supports `shapes: ['star']` alongside `'square'` and `'circle'`. This is perfect for reward celebration animations — stars convey achievement visually. Can also pass canvas drawing functions for fully custom shapes (emoji, icons).
- Source: https://github.com/catdad/canvas-confetti

**2. Scalar & Gravity Tuning for Dramatic Effects**
The `scalar` option (default 1) controls particle size. Setting `scalar: 1.5` with `gravity: 0.6` creates a slow-falling, large-particle "snow" effect ideal for celebration moments. Combined with `ticks: 200` for longer-lasting particles.
- Source: https://www.kirilv.com/canvas-confetti/

**3. Side Cannons Pattern**
Using two confetti bursts from `origin: { x: 0 }` and `origin: { x: 1 }` with `angle: 60/120` creates a "cannon" effect from both screen edges — dramatically better than center-only bursts for campaign creation success states.
- Already partially implemented in CreateCampaignForm.tsx, but not in RewardAnimation.

**4. Reduced Motion Accessibility**
`disableForReducedMotion: true` is an important accessibility flag. The project currently doesn't use it — should be added to all confetti calls for users with motion sensitivity.
- Source: https://www.npmjs.com/package/canvas-confetti

**5. Emoji Confetti via Canvas Shape**
Custom canvas elements can render emoji as confetti particles:
```js
const star = document.createElement('canvas');
star.width = 30; star.height = 30;
const ctx = star.getContext('2d');
ctx.font = '30px serif';
ctx.fillText('⭐', 0, 25);
confetti({ shapes: [star], scalar: 2 });
```
This could be used for a "celebration" mode with USDC/symbol emoji.

### URLs
- npm: https://www.npmjs.com/package/canvas-confetti
- GitHub: https://github.com/catdad/canvas-confetti
- Demo: https://www.kirilv.com/canvas-confetti/

### Application to Project
- Add `shapes: ['star']` to reward confetti for a more celebratory feel
- Add `disableForReducedMotion: true` to all confetti calls for accessibility
- Enhance side-cannon pattern in RewardAnimation.tsx
- Add floating particle background effect to hero section using CSS (not confetti library, to avoid performance overhead)
