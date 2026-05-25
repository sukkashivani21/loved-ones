/**
 * BouquetArrangement
 * Pixel-perfect React port of the WT CSS bouquet.
 * Every class, value, and animation copied verbatim.
 * vmin → em (1vmin = 0.45em at base font-size).
 * Teal palette → project flower colors per theme.
 */
import { useMemo, useState, useCallback } from "react";
import { getTheme } from "@/components/FlowerEmoji";

interface Props {
  flowers: string[];
  size?: "sm" | "md" | "lg";
  layoutSeed?: number;
  greeneryStyle?: "classic" | "wild" | "eucalyptus";
}

// Project flower colors replacing WT's teal (#65e6cc / #40bbab / #a7ffee / #39c6d6)
const THEME_COLORS: Record<string, { leaf1: string; leaf2: string; leaf3: string; leaf4grad: string; glow: string }> = {
  roses:      { leaf1:"hsl(350 55% 68%)", leaf2:"hsl(348 45% 48%)", leaf3:"hsl(352 72% 88%)", leaf4grad:"hsl(348 52% 58%)", glow:"hsl(350 65% 78%)" },
  dahlia:     { leaf1:"hsl(18 65% 66%)",  leaf2:"hsl(16 52% 46%)",  leaf3:"hsl(24 78% 86%)",  leaf4grad:"hsl(16 58% 56%)",  glow:"hsl(20 70% 76%)" },
  anemone:    { leaf1:"hsl(310 45% 70%)", leaf2:"hsl(308 35% 50%)", leaf3:"hsl(312 58% 88%)", leaf4grad:"hsl(308 42% 60%)", glow:"hsl(312 55% 80%)" },
  daisies:    { leaf1:"hsl(46 50% 85%)",  leaf2:"hsl(44 38% 65%)",  leaf3:"hsl(52 65% 94%)",  leaf4grad:"hsl(44 45% 72%)",  glow:"hsl(50 60% 90%)" },
  sunflowers: { leaf1:"hsl(44 80% 64%)",  leaf2:"hsl(38 65% 44%)",  leaf3:"hsl(50 90% 82%)",  leaf4grad:"hsl(40 72% 54%)",  glow:"hsl(48 85% 74%)" },
  lily:       { leaf1:"hsl(34 52% 80%)",  leaf2:"hsl(30 40% 60%)",  leaf3:"hsl(42 65% 92%)",  leaf4grad:"hsl(32 48% 68%)",  glow:"hsl(38 62% 86%)" },
  tulips:     { leaf1:"hsl(340 50% 68%)", leaf2:"hsl(338 38% 48%)", leaf3:"hsl(344 62% 86%)", leaf4grad:"hsl(338 46% 58%)", glow:"hsl(342 58% 78%)" },
  lavender:   { leaf1:"hsl(262 46% 70%)", leaf2:"hsl(260 34% 50%)", leaf3:"hsl(266 58% 86%)", leaf4grad:"hsl(260 42% 60%)", glow:"hsl(264 52% 80%)" },
};
const DCOL = THEME_COLORS.roses;

// Stem configs matching WT exactly (flower--1, --2, --3 + extras for more flowers)
const STEM_CFG = [
  // flower--1: centre, no left offset, 70vmin stem
  { posLeft: "0",    rotate: "none",     stemH: "31.5em", delay: "0.3s",
    leafAnims: ["right:1.6s","right:1.4s","left:1.2s","left:1.0s","right:1.8s","left:2.0s"],
    movAnim: "wt-moving-flower-1", leafsDelay: "1.1s" },
  // flower--2: left:50%, rotate 30deg, 60vmin stem
  { posLeft: "50%",  rotate: "30deg",    stemH: "27em",   delay: "0.8s",
    leafAnims: ["right:1.9s","right:1.7s","left:1.5s","left:1.3s"],
    movAnim: "wt-moving-flower-2", leafsDelay: "1.4s" },
  // flower--3: left:50%, rotate -15deg, 55vmin stem
  { posLeft: "50%",  rotate: "-15deg",   stemH: "24.75em",delay: "0.9s",
    leafAnims: ["right:2.5s","right:2.3s","left:2.1s","left:1.9s"],
    movAnim: "wt-moving-flower-3", leafsDelay: "1.7s" },
  // Extra flowers reuse variations
  { posLeft: "50%",  rotate: "45deg",    stemH: "22em",   delay: "0.5s",
    leafAnims: ["right:1.4s","right:1.2s","left:1.0s","left:0.8s"],
    movAnim: "wt-moving-flower-2", leafsDelay: "1.2s" },
  { posLeft: "50%",  rotate: "-35deg",   stemH: "22em",   delay: "0.7s",
    leafAnims: ["right:1.6s","right:1.4s","left:1.2s","left:1.0s"],
    movAnim: "wt-moving-flower-3", leafsDelay: "1.5s" },
  { posLeft: "50%",  rotate: "55deg",    stemH: "20em",   delay: "0.4s",
    leafAnims: ["right:1.3s","right:1.1s","left:0.9s","left:0.7s"],
    movAnim: "wt-moving-flower-2", leafsDelay: "1.3s" },
  { posLeft: "50%",  rotate: "-48deg",   stemH: "20em",   delay: "0.6s",
    leafAnims: ["right:1.8s","right:1.6s","left:1.4s","left:1.2s"],
    movAnim: "wt-moving-flower-3", leafsDelay: "1.6s" },
  { posLeft: "50%",  rotate: "25deg",    stemH: "25em",   delay: "0.5s",
    leafAnims: ["right:1.5s","right:1.3s","left:1.1s","left:0.9s"],
    movAnim: "wt-moving-flower-2", leafsDelay: "1.4s" },
  { posLeft: "50%",  rotate: "-22deg",   stemH: "24em",   delay: "0.8s",
    leafAnims: ["right:2.0s","right:1.8s","left:1.6s","left:1.4s"],
    movAnim: "wt-moving-flower-3", leafsDelay: "1.6s" },
  { posLeft: "50%",  rotate: "12deg",    stemH: "26em",   delay: "0.6s",
    leafAnims: ["right:1.4s","right:1.2s","left:1.0s","left:0.8s"],
    movAnim: "wt-moving-flower-1", leafsDelay: "1.2s" },
];

// long-g positions — exact WT values converted (1vmin = 0.45em)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeLongG = (gc: { main: string; dark: string; leaf: string; glow: string }) => [
  // long-g--0: base (left:-42vmin, bottom:25vmin)
  { left:"-18.9em", bottom:"11.25em", transform:"none",                        zIndex:1,   filter:"none",        opacity:1,   leafMask:"",                                                                    delays:["3s","2.2s","3.4s","3.6s"] },
  // long-g--1: scale(0.8) rotate(-5deg)
  { left:"-18.9em", bottom:"0",       transform:"scale(0.8) rotate(-5deg)",    zIndex:1,   filter:"none",        opacity:1,   leafMask:`linear-gradient(to top,transparent 40%,${gc.dark} 80%)`,                delays:["3.6s","3.8s","4s","4.2s"] },
  // long-g--2: left:-35vmin bottom:-3vmin scale(0.6) rotateX(60deg)
  { left:"-15.75em",bottom:"-1.35em", transform:"scale(0.6) rotateX(60deg)",  zIndex:1,   filter:"none",        opacity:1,   leafMask:`linear-gradient(to top,transparent 50%,${gc.dark} 80%)`,                delays:["4s","4.2s","4.4s","4.6s"] },
  // long-g--3: left:-17vmin bottom:0 scale(0.6) rotateX(60deg)
  { left:"-7.65em", bottom:"0",       transform:"scale(0.6) rotateX(60deg)",  zIndex:1,   filter:"none",        opacity:1,   leafMask:`linear-gradient(to top,transparent 40%,${gc.dark} 80%)`,                delays:["4s","4.2s","3s","3.6s"] },
  // long-g--4: left:25vmin bottom:-3vmin
  { left:"11.25em", bottom:"-1.35em", transform:"scale(0.6) rotateX(60deg)",  zIndex:1,   filter:"none",        opacity:1,   leafMask:`linear-gradient(to top,transparent 50%,${gc.dark} 80%)`,                delays:["4s","4.2s","3s","3.6s"] },
  // long-g--5: left:42vmin bottom:0
  { left:"18.9em",  bottom:"0",       transform:"scale(0.8) rotate(2deg)",    zIndex:1,   filter:"none",        opacity:1,   leafMask:"",                                                                    delays:["4s","4.2s","3s","3.6s"] },
  // long-g--6: left:0 bottom:-20vmin z:100 blur
  { left:"0",       bottom:"-9em",    transform:"scale(0.8) rotate(2deg)",    zIndex:100, filter:"blur(0.135em)",opacity:1,   leafMask:"",                                                                    delays:["4.2s","4.4s","4.6s","4.8s"] },
  // long-g--7: left:35vmin bottom:20vmin z:-1 blur opacity.7
  { left:"15.75em", bottom:"9em",     transform:"scale(0.6) rotate(2deg)",    zIndex:-1,  filter:"blur(0.135em)",opacity:0.7, leafMask:"",                                                                    delays:["3s","3.2s","3.5s","3.6s"] },
];

const seeded = (s: number, n: number) => ((Math.sin(s * 9301 + n * 49297) * 233280) % 1 + 1) % 1;

export default function BouquetArrangement({ flowers, size = "md", layoutSeed = 7, greeneryStyle = "classic" }: Props) {
  const BASE = { sm: "7px", md: "10px", lg: "13px" }[size];

  // Greenery palette per style
  const GC = greeneryStyle === "wild"
    ? { main: "#3a9e4a", dark: "#2a7a36", leaf: "#4ab855", glow: "rgba(80,220,100,0.2)" }
    : greeneryStyle === "eucalyptus"
    ? { main: "#6aaa88", dark: "#4a8866", leaf: "#82c49a", glow: "rgba(120,220,160,0.2)" }
    : { main: "#159faa", dark: "#079097", leaf: "#1aaa15", glow: "rgba(44,238,252,0.2)" };

  const flowerList = useMemo(() => {
    if (!flowers.length) return [];
    const sorted = [...flowers].sort((a, b) => {
      const w = { large: 3, medium: 2, small: 1 } as const;
      return w[getTheme(b).sizeCategory] - w[getTheme(a).sizeCategory];
    });
    // Seeded Fisher-Yates shuffle of stem indices so layoutSeed genuinely changes positions
    const order = Array.from({ length: STEM_CFG.length }, (_, k) => k);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(seeded(layoutSeed, i) * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return sorted.slice(0, 10).map((f, i) => ({
      f,
      cfg: STEM_CFG[order[i % order.length]],
      col: THEME_COLORS[f] ?? DCOL,
      idx: i,
    }));
  }, [flowers, layoutSeed]);

  // CSS — exact WT rules, vmin→em, teal→CSS vars per flower
  const css = `
/* ── Root container ── */
.wt-flowers {
  position: relative;
  font-size: ${BASE};
}

/* ── flower ── */
.wt-flower {
  position: absolute;
  bottom: 4.5em;
  transform-origin: bottom center;
  z-index: 10;
  --fl-speed: 0.8s;
}

/* ── flower__leafs ── */
.wt-flower__leafs {
  position: relative;
  animation: wt-blooming-flower 2s backwards;
}
.wt-flower__leafs::after {
  content: "";
  position: absolute;
  left: 0; top: 0;
  transform: translate(-50%, -100%);
  width: 3.6em; height: 3.6em;
  filter: blur(4.5em);
}

/* ── flower__leaf ── */
.wt-flower__leaf {
  position: absolute;
  bottom: 0; left: 50%;
  width: 3.6em; height: 4.95em;
  border-radius: 51% 49% 47% 53%/44% 45% 55% 69%;
  transform-origin: bottom center;
  opacity: 0.9;
  box-shadow: inset 0 0 0.9em rgba(255,255,255,0.5);
}
.wt-flower__leaf--1 { transform: translate(-10%, 1%) rotateY(40deg) rotateX(-50deg); }
.wt-flower__leaf--2 { transform: translate(-50%, -4%) rotateX(40deg); }
.wt-flower__leaf--3 { transform: translate(-90%, 0%) rotateY(45deg) rotateX(50deg); }
.wt-flower__leaf--4 {
  width: 3.6em; height: 3.6em;
  transform-origin: bottom left;
  border-radius: 1.8em 4.5em 1.8em 1.8em;
  transform: translate(0%, 18%) rotateX(70deg) rotate(-43deg);
  z-index: 1; opacity: 0.8;
}

/* ── flower__white-circle ── */
.wt-flower__white-circle {
  position: absolute;
  left: -1.575em; top: -1.35em;
  width: 4.05em; height: 1.8em;
  border-radius: 50%;
  background-color: #fff;
}
.wt-flower__white-circle::after {
  content: "";
  position: absolute;
  left: 50%; top: 45%;
  transform: translate(-50%, -50%);
  width: 60%; height: 60%;
  border-radius: inherit;
  background-image:
    repeating-linear-gradient(135deg,rgba(0,0,0,.03) 0px,rgba(0,0,0,.03) 1px,transparent 1px,transparent 12px),
    repeating-linear-gradient(45deg,rgba(0,0,0,.03) 0px,rgba(0,0,0,.03) 1px,transparent 1px,transparent 12px),
    repeating-linear-gradient(67.5deg,rgba(0,0,0,.03) 0px,rgba(0,0,0,.03) 1px,transparent 1px,transparent 12px),
    repeating-linear-gradient(112.5deg,rgba(0,0,0,.03) 0px,rgba(0,0,0,.03) 1px,transparent 1px,transparent 12px),
    linear-gradient(90deg,#ffeb12,#ffce00);
}

/* ── flower__line (stem) ── */
.wt-flower__line {
  width: 0.675em;
  background-image:
    linear-gradient(to left,rgba(0,0,0,.2),transparent,rgba(255,255,255,.2)),
    linear-gradient(to top,transparent 10%,var(--stem-dark),var(--stem-light));
  box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
  animation: wt-grow-flower-tree 4s backwards;
}

/* ── flower__line__leaf ── */
.wt-flower__line__leaf {
  --w: 3.15em;
  --h: calc(var(--w) + 0.9em);
  position: absolute;
  top: 20%; left: 90%;
  width: var(--w); height: var(--h);
  border-top-right-radius: var(--h);
  border-bottom-left-radius: var(--h);
  background-image: linear-gradient(to top,rgba(20,117,122,0.4),var(--stem-light));
}
.wt-flower__line__leaf--1 { transform: rotate(70deg) rotateY(30deg); }
.wt-flower__line__leaf--2 { top: 45%; transform: rotate(70deg) rotateY(30deg); }
.wt-flower__line__leaf--3,
.wt-flower__line__leaf--4,
.wt-flower__line__leaf--6 {
  border-top-right-radius: 0; border-bottom-left-radius: 0;
  border-top-left-radius: var(--h); border-bottom-right-radius: var(--h);
  left: -460%; top: 12%;
  transform: rotate(-70deg) rotateY(30deg);
}
.wt-flower__line__leaf--4 { top: 40%; }
.wt-flower__line__leaf--5 { top: 0; transform-origin: left; transform: rotate(70deg) rotateY(30deg) scale(0.6); }
.wt-flower__line__leaf--6 { top: -2%; left: -450%; transform-origin: right; transform: rotate(-70deg) rotateY(30deg) scale(0.6); }

/* ── flower__light (pollen dots) ── */
.wt-flower__light {
  position: absolute;
  bottom: 0;
  width: 0.45em; height: 0.45em;
  border-radius: 50%;
  filter: blur(0.09em);
  animation: wt-light-ans 4s linear infinite backwards;
}
.wt-flower__light:nth-child(odd)  { background-color: #fffb00; }
.wt-flower__light:nth-child(even) { background-color: #23f0ff; }
.wt-flower__light--1 { left: -0.9em;  animation-delay: 1s; }
.wt-flower__light--2 { left:  1.35em; animation-delay: 0.5s; }
.wt-flower__light--3 { left: -2.7em;  animation-delay: 0.3s; }
.wt-flower__light--4 { left:  2.7em;  animation-delay: 0.9s; }
.wt-flower__light--5 { left: -0.45em; animation-delay: 1.5s; }
.wt-flower__light--6 { left: -1.8em;  animation-delay: 3s; }
.wt-flower__light--7 { left:  1.35em; animation-delay: 2s; }
.wt-flower__light--8 { left: -2.7em;  animation-delay: 3.5s; }

/* ── flower__grass ── */
.wt-flower__grass {
  --c: var(--grass-c, ${GC.main});
  --line-w: 0.675em;
  position: absolute;
  bottom: 5.4em; left: -3.15em;
  display: flex; flex-direction: column; align-items: flex-end;
  z-index: 20;
  transform-origin: bottom center;
  transform: rotate(-48deg) rotateY(40deg);
}
.wt-flower__grass--1 { animation: wt-moving-grass 2s linear infinite; }
.wt-flower__grass--2 {
  left: 0.9em; bottom: 4.5em;
  transform: scale(0.5) rotate(75deg) rotateX(10deg) rotateY(-200deg);
  opacity: 0.8; z-index: 0;
  animation: wt-moving-grass--2 1.5s linear infinite;
}
.wt-flower__grass--top {
  width: 3.15em; height: 4.5em;
  border-top-right-radius: 100%;
  border-right: var(--line-w) solid var(--c);
  transform-origin: bottom center; transform: rotate(-2deg);
}
.wt-flower__grass--bottom {
  margin-top: -2px;
  width: var(--line-w); height: 11.25em;
  background-image: linear-gradient(to top,transparent,var(--c));
}
.wt-flower__grass__leaf {
  --size: 4.5em;
  position: absolute;
  width: calc(var(--size)*2.1); height: var(--size);
  border-top-left-radius: var(--size); border-top-right-radius: var(--size);
  background-image: linear-gradient(to top,transparent,transparent 30%,var(--c));
  z-index: 100;
}
.wt-flower__grass__leaf--1 { top:-6%;  left:30%;   --size:2.7em; transform:rotate(-20deg); animation:wt-growing-grass-ans--1 2s 2.6s backwards; }
.wt-flower__grass__leaf--2 { top:-5%;  left:-110%; --size:2.7em; transform:rotate(10deg);  animation:wt-growing-grass-ans--2 2s 2.4s linear backwards; }
.wt-flower__grass__leaf--3 { top:5%;   left:60%;   --size:3.6em; transform:rotate(-18deg) rotateX(-20deg); animation:wt-growing-grass-ans--3 2s 2.2s linear backwards; }
.wt-flower__grass__leaf--4 { top:6%;   left:-135%; --size:3.6em; transform:rotate(2deg);   animation:wt-growing-grass-ans--4 2s 2s linear backwards; }
.wt-flower__grass__leaf--5 { top:20%;  left:60%;   --size:4.5em; transform:rotate(-24deg) rotateX(-20deg); animation:wt-growing-grass-ans--5 2s 1.8s linear backwards; }
.wt-flower__grass__leaf--6 { top:22%;  left:-180%; --size:4.5em; transform:rotate(10deg);  animation:wt-growing-grass-ans--6 2s 1.6s linear backwards; }
.wt-flower__grass__leaf--7 { top:39%;  left:70%;   --size:4.5em; transform:rotate(-10deg); animation:wt-growing-grass-ans--7 2s 1.4s linear backwards; }
.wt-flower__grass__leaf--8 { top:40%;  left:-215%; --size:4.95em;transform:rotate(10deg);  animation:wt-growing-grass-ans--8 2s 1.2s linear backwards; }
.wt-flower__grass__overlay {
  position:absolute; top:-10%; right:0; width:100%; height:100%;
  background-color:rgba(0,0,0,0.35); filter:blur(0.675em); z-index:100;
}

/* ── flower__g-long ── */
.wt-flower__g-long {
  --w: 0.9em; --h: 2.7em; --c: ${GC.main};
  position: absolute; bottom: 4.5em; left: -1.35em;
  transform-origin: bottom center;
  transform: rotate(-30deg) rotateY(-20deg);
  display: flex; flex-direction: column; align-items: flex-end;
  animation: wt-flower-g-long-ans 3s linear infinite;
}
.wt-flower__g-long__top {
  top: calc(var(--h)*-1);
  width: calc(var(--w)+0.45em); height: var(--h);
  border-top-right-radius: 100%;
  border-right: 0.315em solid var(--c);
  transform: translate(-0.315em,0.45em);
}
.wt-flower__g-long__bottom {
  width: var(--w); height: 22.5em;
  transform-origin: bottom center;
  background-image: linear-gradient(to top,transparent 30%,var(--c));
  box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
  clip-path: polygon(35% 0,65% 1%,100% 100%,0% 100%);
}

/* ── flower__g-right ── */
.wt-flower__g-right {
  position: absolute; bottom: 2.7em; left: -0.9em;
  transform-origin: bottom left; transform: rotate(20deg);
}
.wt-flower__g-right .wt-leaf {
  width: 13.5em; height: 22.5em;
  border-top-left-radius: 100%;
  border-left: 0.9em solid ${GC.dark};
  background-image: linear-gradient(to bottom,transparent,#000 60%);
  mask-image: linear-gradient(to top,transparent 30%,${GC.dark} 60%);
  -webkit-mask-image: linear-gradient(to top,transparent 30%,${GC.dark} 60%);
}
.wt-flower__g-right--1 { animation: wt-flower-g-right-ans 2.5s linear infinite; }
.wt-flower__g-right--2 {
  left: 2.25em; transform: rotateY(-180deg);
  animation: wt-flower-g-right-ans--2 3s linear infinite;
}
.wt-flower__g-right--2 .wt-leaf { height: 33.75em; filter: blur(0.135em); opacity: 0.8; }

/* ── flower__g-front ── */
.wt-flower__g-front {
  position: absolute; bottom: 2.7em; left: 1.125em;
  z-index: 100; transform-origin: bottom center;
  transform: rotate(-28deg) rotateY(30deg) scale(1.04);
  animation: wt-flower__g-front-ans 2s linear infinite;
}
.wt-flower__g-front__line {
  width: 0.135em; height: 9em; position: relative;
  background-image: linear-gradient(to top,transparent,${GC.dark},transparent 100%);
}
.wt-flower__g-front__leaf-wrapper {
  position: absolute; top: 0; left: 0;
  transform-origin: bottom left; transform: rotate(10deg);
}
.wt-flower__g-front__leaf-wrapper:nth-child(even) {
  left: 0; transform: rotateY(-180deg) rotate(5deg);
  animation: wt-flower__g-front__leaf-left-ans 1s ease-in backwards;
}
.wt-flower__g-front__leaf-wrapper:nth-child(odd) {
  animation: wt-flower__g-front__leaf-ans 1s ease-in backwards;
}
.wt-flower__g-front__leaf-wrapper--1 { top:-3.6em; transform:scale(0.7)!important; animation:wt-flower__g-front__leaf-ans 1s 5.5s ease-in backwards!important; }
.wt-flower__g-front__leaf-wrapper--2 { top:-3.6em; transform:rotateY(-180deg) scale(0.7)!important; animation:wt-flower__g-front__leaf-left-ans-2 1s 4.6s ease-in backwards!important; }
.wt-flower__g-front__leaf-wrapper--3 { top:-1.35em; animation-delay:4.9s!important; }
.wt-flower__g-front__leaf-wrapper--4 { top:-1.35em; transform:rotateY(-180deg) scale(0.9)!important; animation:wt-flower__g-front__leaf-left-ans-2 1s 4.6s ease-in backwards!important; }
.wt-flower__g-front__leaf-wrapper--5, .wt-flower__g-front__leaf-wrapper--6 { top:0.9em; }
.wt-flower__g-front__leaf-wrapper--7, .wt-flower__g-front__leaf-wrapper--8 { top:2.925em; }
.wt-flower__g-front__leaf-wrapper--2 { animation-delay:5.2s!important; }
.wt-flower__g-front__leaf-wrapper--3 { animation-delay:4.9s!important; }
.wt-flower__g-front__leaf-wrapper--5 { animation-delay:4.3s!important; }
.wt-flower__g-front__leaf-wrapper--6 { animation-delay:4.1s!important; }
.wt-flower__g-front__leaf-wrapper--7 { animation-delay:3.8s!important; }
.wt-flower__g-front__leaf-wrapper--8 { animation-delay:3.5s!important; }
.wt-flower__g-front__leaf {
  width: 4.5em; height: 4.5em;
  border-radius: 100% 0% 0% 100%/100% 100% 0% 0%;
  box-shadow: inset 0 2px 0.45em ${GC.glow};
  background-image: linear-gradient(to bottom left,transparent,#000),linear-gradient(to bottom right,${GC.main} 50%,transparent 50%);
  -webkit-mask-image: linear-gradient(to bottom right,${GC.main} 50%,transparent 50%);
  mask-image: linear-gradient(to bottom right,${GC.main} 50%,transparent 50%);
}

/* ── flower__g-fr ── */
.wt-flower__g-fr {
  position: absolute; bottom: -1.8em; left: 0;
  transform-origin: bottom left; z-index: 10;
  animation: wt-flower__g-fr-ans 2s linear infinite;
}
.wt-flower__g-fr .wt-leaf {
  width: 13.5em; height: 22.5em;
  border-top-left-radius: 100%;
  border-left: 0.9em solid ${GC.dark};
  mask-image: linear-gradient(to top,transparent 25%,${GC.dark} 50%);
  -webkit-mask-image: linear-gradient(to top,transparent 25%,${GC.dark} 50%);
  position: relative; z-index: 1;
}
.wt-flower__g-fr__leaf {
  position: absolute; top: 0; left: 0;
  width: 4.5em; height: 4.5em;
  border-radius: 100% 0% 0% 100%/100% 100% 0% 0%;
  box-shadow: inset 0 2px 0.45em ${GC.glow};
  background-image: linear-gradient(to bottom left,transparent,#000 98%),linear-gradient(to bottom right,${GC.main} 45%,transparent 50%);
  mask-image: linear-gradient(135deg,${GC.main} 40%,transparent 50%);
  -webkit-mask-image: linear-gradient(135deg,${GC.main} 40%,transparent 50%);
}
.wt-flower__g-fr__leaf--1 { left:9em;   transform:rotate(45deg);              animation:wt-g-fr-leaf-ans-1 0.5s 5.2s linear backwards; }
.wt-flower__g-fr__leaf--2 { left:5.4em; top:-3.15em; transform:rotate(25deg) rotateY(-180deg); animation:wt-g-fr-leaf-ans-6 0.5s 5s linear backwards; }
.wt-flower__g-fr__leaf--3 { left:6.75em;top:2.7em;  transform:rotate(55deg);  animation:wt-g-fr-leaf-ans-5 0.5s 4.8s linear backwards; }
.wt-flower__g-fr__leaf--4 { left:2.7em; top:-0.9em; transform:rotate(25deg) rotateY(-180deg); animation:wt-g-fr-leaf-ans-6 0.5s 4.6s linear backwards; }
.wt-flower__g-fr__leaf--5 { left:4.5em; top:6.3em;  transform:rotate(55deg);  animation:wt-g-fr-leaf-ans-5 0.5s 4.4s linear backwards; }
.wt-flower__g-fr__leaf--6 { left:0;     top:2.7em;  transform:rotate(25deg) rotateY(-180deg); animation:wt-g-fr-leaf-ans-6 0.5s 4.2s linear backwards; }
.wt-flower__g-fr__leaf--7 { left:2.25em;top:9.9em;  transform:rotate(45deg);  animation:wt-g-fr-leaf-ans-7 0.5s 4s linear backwards; }
.wt-flower__g-fr__leaf--8 { left:-1.8em;top:6.75em; transform:rotate(15deg) rotateY(-180deg); animation:wt-g-fr-leaf-ans-8 0.5s 3.8s linear backwards; }

/* ── long-g / leaf ── */
.wt-long-g {
  position: absolute;
  bottom: 11.25em; left: -18.9em;
  transform-origin: bottom left;
}
.wt-long-g .wt-leaf {
  --w: 6.75em; --h: 18em; --c: ${GC.leaf};
  position: absolute; bottom: 0;
  width: var(--w); height: var(--h);
  border-top-left-radius: 100%;
  border-left: 0.9em solid var(--c);
  mask-image: linear-gradient(to top,transparent 20%,var(--c));
  -webkit-mask-image: linear-gradient(to top,transparent 20%,var(--c));
  transform-origin: bottom center;
}
.wt-long-g .wt-leaf--0 { left:0.9em; animation:wt-leaf-ans-1 4s linear infinite; }
.wt-long-g .wt-leaf--1 { --w:2.25em; --h:27em; animation:wt-leaf-ans-1 4s linear infinite; }
.wt-long-g .wt-leaf--2 {
  --w:4.5em; --h:18em; left:-0.225em; bottom:2.25em;
  transform-origin:bottom left; transform:rotateY(-180deg);
  animation:wt-leaf-ans-2 3s linear infinite;
}
.wt-long-g .wt-leaf--3 {
  --w:2.25em; --h:13.5em; left:-0.45em; bottom:1.44em;
  transform-origin:bottom left; transform:rotate(-10deg) rotateY(-180deg);
  animation:wt-leaf-ans-3 3s linear infinite;
}

/* ── grow-ans helper ── */
.wt-grow-ans { animation: wt-grow-ans 2s var(--d,0s) backwards; }
.wt-growing-grass { animation: wt-growing-grass-ans 1s 2s backwards; }

/* ══ KEYFRAMES — exact WT copies ══ */
@keyframes wt-blooming-flower { 0%{transform:scale(0);} }
@keyframes wt-grow-flower-tree { 0%{height:0;border-radius:0.45em;} }
@keyframes wt-light-ans {
  0%  {opacity:0;transform:translateY(0);}
  25% {opacity:1;transform:translateY(-2.25em) translateX(-0.9em);}
  50% {opacity:1;transform:translateY(-6.75em) translateX(0.9em);filter:blur(0.09em);}
  75% {transform:translateY(-9em) translateX(-0.9em);filter:blur(0.09em);}
  100%{transform:translateY(-13.5em);opacity:0;filter:blur(0.45em);}
}
@keyframes wt-moving-flower-1 { 0%,100%{transform:rotate(2deg);}  50%{transform:rotate(-2deg);} }
@keyframes wt-moving-flower-2 { 0%,100%{transform:rotate(18deg);} 50%{transform:rotate(14deg);} }
@keyframes wt-moving-flower-3 { 0%,100%{transform:rotate(-18deg);}50%{transform:rotate(-20deg) rotateY(-10deg);} }
@keyframes wt-blooming-leaf-right { 0%{transform-origin:left;  transform:rotate(70deg)  rotateY(30deg) scale(0);} }
@keyframes wt-blooming-leaf-left  { 0%{transform-origin:right; transform:rotate(-70deg) rotateY(30deg) scale(0);} }
@keyframes wt-moving-grass    { 0%,100%{transform:rotate(-48deg) rotateY(40deg);}         50%{transform:rotate(-50deg) rotateY(40deg);} }
@keyframes wt-moving-grass--2 { 0%,100%{transform:scale(0.5) rotate(75deg) rotateX(10deg) rotateY(-200deg);} 50%{transform:scale(0.5) rotate(79deg) rotateX(10deg) rotateY(-200deg);} }
@keyframes wt-growing-grass-ans  { 0%{transform:scale(0);} }
@keyframes wt-growing-grass-ans--1 { 0%{transform-origin:bottom left;  transform:rotate(-20deg) scale(0);} }
@keyframes wt-growing-grass-ans--2 { 0%{transform-origin:bottom right; transform:rotate(10deg)  scale(0);} }
@keyframes wt-growing-grass-ans--3 { 0%{transform-origin:bottom left;  transform:rotate(-18deg) rotateX(-20deg) scale(0);} }
@keyframes wt-growing-grass-ans--4 { 0%{transform-origin:bottom right; transform:rotate(2deg)   scale(0);} }
@keyframes wt-growing-grass-ans--5 { 0%{transform-origin:bottom left;  transform:rotate(-24deg) rotateX(-20deg) scale(0);} }
@keyframes wt-growing-grass-ans--6 { 0%{transform-origin:bottom right; transform:rotate(10deg)  scale(0);} }
@keyframes wt-growing-grass-ans--7 { 0%{transform-origin:bottom left;  transform:rotate(-10deg) scale(0);} }
@keyframes wt-growing-grass-ans--8 { 0%{transform-origin:bottom right; transform:rotate(10deg)  scale(0);} }
@keyframes wt-flower-g-long-ans { 0%,100%{transform:rotate(-30deg) rotateY(-20deg);} 50%{transform:rotate(-32deg) rotateY(-20deg);} }
@keyframes wt-flower-g-right-ans    { 0%,100%{transform:rotate(20deg);}                 50%{transform:rotate(24deg) rotateX(-20deg);} }
@keyframes wt-flower-g-right-ans--2 { 0%,100%{transform:rotateY(-180deg) rotate(0deg) rotateX(-20deg);} 50%{transform:rotateY(-180deg) rotate(6deg) rotateX(-20deg);} }
@keyframes wt-flower__g-front-ans   { 0%,100%{transform:rotate(-28deg) rotateY(30deg) scale(1.04);} 50%{transform:rotate(-35deg) rotateY(40deg) scale(1.04);} }
@keyframes wt-flower__g-front__leaf-ans      { 0%{transform:rotate(10deg) scale(0);} }
@keyframes wt-flower__g-front__leaf-left-ans { 0%{transform:rotateY(-180deg) rotate(5deg) scale(0);} }
@keyframes wt-flower__g-front__leaf-left-ans-2 { 0%{transform:rotateY(-180deg) scale(0);} }
@keyframes wt-flower__g-fr-ans { 0%,100%{transform:rotate(2deg);} 50%{transform:rotate(4deg);} }
@keyframes wt-g-fr-leaf-ans-1 { 0%{transform-origin:left;  transform:rotate(45deg) scale(0);} }
@keyframes wt-g-fr-leaf-ans-5 { 0%{transform-origin:left;  transform:rotate(55deg) scale(0);} }
@keyframes wt-g-fr-leaf-ans-6 { 0%{transform-origin:right; transform:rotate(25deg) rotateY(-180deg) scale(0);} }
@keyframes wt-g-fr-leaf-ans-7 { 0%{transform-origin:left;  transform:rotate(45deg) scale(0);} }
@keyframes wt-g-fr-leaf-ans-8 { 0%{transform-origin:right; transform:rotate(15deg) rotateY(-180deg) scale(0);} }
@keyframes wt-leaf-ans-1 { 0%,100%{transform:rotate(-5deg) scale(1);}  50%{transform:rotate(5deg) scale(1.1);} }
@keyframes wt-leaf-ans-2 { 0%,100%{transform:rotateY(-180deg) rotate(5deg);} 50%{transform:rotateY(-180deg) rotate(0deg) scale(1.1);} }
@keyframes wt-leaf-ans-3 { 0%,100%{transform:rotate(-10deg) rotateY(-180deg);} 50%{transform:rotate(-20deg) rotateY(-180deg);} }
@keyframes wt-grow-ans { 0%{transform:scale(0);opacity:0;} }

/* ── Outer centering wrapper ── */
.wt-outer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 38em;
  overflow: hidden;
  position: relative;
  perspective: 1000px;
}
`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }}/>
      <div className="wt-outer">
        <div className="wt-flowers">

          {/* ══ FLOWERS ══ */}
          {flowerList.map((fl, i) => {
            const cfg = fl.cfg;
            const col = fl.col;
            const hasRotate = cfg.rotate !== "none";
            const flowerStyle: React.CSSProperties = {
              left: cfg.posLeft,
              transform: hasRotate ? `rotate(${cfg.rotate})` : undefined,
              animation: `${cfg.movAnim} 4s linear infinite`,
              ["--stem-dark" as string]: col.leaf2,
              ["--stem-light" as string]: col.leaf1,
            };
            return (
              <div key={i} className="wt-flower" style={flowerStyle}>
                {/* flower__leafs */}
                <div className="wt-flower__leafs" style={{
                  animationDelay: cfg.leafsDelay,
                  ["--glow-c" as string]: col.glow,
                }}>
                  {/* glow ::after via inline style override */}
                  <style>{`.wt-flower__leafs::after { background-color: ${col.glow}; }`}</style>
                  {/* leaf--1 */}
                  <div className="wt-flower__leaf wt-flower__leaf--1" style={{
                    backgroundImage:`linear-gradient(to top,${col.leaf2},${col.leaf3})`,
                    backgroundColor: col.leaf1,
                  }}/>
                  {/* leaf--2 */}
                  <div className="wt-flower__leaf wt-flower__leaf--2" style={{
                    backgroundImage:`linear-gradient(to top,${col.leaf2},${col.leaf3})`,
                    backgroundColor: col.leaf1,
                  }}/>
                  {/* leaf--3 */}
                  <div className="wt-flower__leaf wt-flower__leaf--3" style={{
                    backgroundImage:`linear-gradient(to top,${col.leaf2},${col.leaf3})`,
                    backgroundColor: col.leaf1,
                  }}/>
                  {/* leaf--4 */}
                  <div className="wt-flower__leaf wt-flower__leaf--4" style={{
                    backgroundImage:`linear-gradient(to top,${col.leaf4grad},${col.leaf3})`,
                  }}/>
                  {/* white circle */}
                  <div className="wt-flower__white-circle"/>
                  {/* lights */}
                  {[1,2,3,4,5,6,7,8].map(n=>(
                    <div key={n} className={`wt-flower__light wt-flower__light--${n}`}/>
                  ))}
                </div>

                {/* flower__line (stem) */}
                <div className="wt-flower__line" style={{ height: cfg.stemH, animationDelay: cfg.delay }}>
                  {cfg.leafAnims.map((la, li) => {
                    const [dir, delay] = la.split(":");
                    return (
                      <div key={li}
                        className={`wt-flower__line__leaf wt-flower__line__leaf--${li+1}`}
                        style={{ animation:`${dir==="right"?"wt-blooming-leaf-right":"wt-blooming-leaf-left"} var(--fl-speed) ${delay} backwards` }}/>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ══ g-long ══ */}
          <div className="wt-grow-ans" style={{"--d":"1.2s"} as React.CSSProperties}>
            <div className="wt-flower__g-long">
              <div className="wt-flower__g-long__top"/>
              <div className="wt-flower__g-long__bottom"/>
            </div>
          </div>

          {/* ══ GRASS clusters ══ */}
          {[1,2].map(n=>(
            <div key={n} className="wt-growing-grass">
              <div className={`wt-flower__grass wt-flower__grass--${n}`}>
                <div className="wt-flower__grass--top"/>
                <div className="wt-flower__grass--bottom"/>
                {[1,2,3,4,5,6,7,8].map(l=>(
                  <div key={l} className={`wt-flower__grass__leaf wt-flower__grass__leaf--${l}`}/>
                ))}
                <div className="wt-flower__grass__overlay"/>
              </div>
            </div>
          ))}

          {/* ══ g-right leaves ══ */}
          <div className="wt-grow-ans" style={{"--d":"2.4s"} as React.CSSProperties}>
            <div className="wt-flower__g-right wt-flower__g-right--1">
              <div className="wt-leaf"/>
            </div>
          </div>
          <div className="wt-grow-ans" style={{"--d":"2.8s"} as React.CSSProperties}>
            <div className="wt-flower__g-right wt-flower__g-right--2">
              <div className="wt-leaf"/>
            </div>
          </div>

          {/* ══ g-front fern ══ */}
          <div className="wt-grow-ans" style={{"--d":"2.8s"} as React.CSSProperties}>
            <div className="wt-flower__g-front">
              {[1,2,3,4,5,6,7,8].map(n=>(
                <div key={n} className={`wt-flower__g-front__leaf-wrapper wt-flower__g-front__leaf-wrapper--${n}`}>
                  <div className="wt-flower__g-front__leaf"/>
                </div>
              ))}
              <div className="wt-flower__g-front__line"/>
            </div>
          </div>

          {/* ══ g-fr bottom fern ══ */}
          <div className="wt-grow-ans" style={{"--d":"3.2s"} as React.CSSProperties}>
            <div className="wt-flower__g-fr">
              <div className="wt-leaf"/>
              {[1,2,3,4,5,6,7,8].map(n=>(
                <div key={n} className={`wt-flower__g-fr__leaf wt-flower__g-fr__leaf--${n}`}/>
              ))}
            </div>
          </div>

          {/* ══ long-g groups (0–7) ══ */}
          {makeLongG(GC).map((lg, gi)=>(
            <div key={gi} className="wt-long-g" style={{
              left:lg.left, bottom:lg.bottom,
              transform:lg.transform!=="none"?lg.transform:undefined,
              zIndex:lg.zIndex,
              filter:lg.filter!=="none"?lg.filter:undefined,
              opacity:lg.opacity<1?lg.opacity:undefined,
            }}>
              {lg.delays.map((d,li)=>(
                <div key={li} className="wt-grow-ans" style={{"--d":d} as React.CSSProperties}>
                  <div className={`wt-leaf wt-leaf--${li}`}
                    style={lg.leafMask?{maskImage:lg.leafMask,WebkitMaskImage:lg.leafMask}:{}}/>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// BouquetWithControls
// Drop-in wrapper that adds "Try a new arrangement" + "Change greenery" buttons
// below the bouquet. All state is self-contained — no extra props needed.
// Usage: <BouquetWithControls flowers={keys} size="lg" />
// ─────────────────────────────────────────────────────────────────────────────

type GreeneryStyle = "classic" | "wild" | "eucalyptus";
const GREENERY_STYLES: GreeneryStyle[] = ["classic", "wild", "eucalyptus"];
const GREENERY_LABELS: Record<GreeneryStyle, string> = {
  classic:    "Classic",
  wild:       "Wild",
  eucalyptus: "Eucalyptus",
};

interface ControlsProps {
  flowers: string[];
  size?: "sm" | "md" | "lg";
  initialSeed?: number;
  initialGreenery?: GreeneryStyle;
}

export function BouquetWithControls({
  flowers,
  size = "lg",
  initialSeed,
  initialGreenery = "classic",
}: ControlsProps) {
  const [seed, setSeed] = useState<number>(initialSeed ?? Math.floor(Math.random() * 10_000));
  const [greenery, setGreenery] = useState<GreeneryStyle>(initialGreenery);

  const shuffle = useCallback(() => setSeed(Math.floor(Math.random() * 10_000)), []);
  const cycleGreenery = useCallback(() => {
    setGreenery(g => GREENERY_STYLES[(GREENERY_STYLES.indexOf(g) + 1) % GREENERY_STYLES.length]);
  }, []);

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4em",
    padding: "0.5em 1.1em",
    border: "1px solid currentColor",
    borderRadius: "0.25em",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "monospace",
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "inherit",
    opacity: 0.75,
    transition: "opacity 0.15s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <BouquetArrangement
        flowers={flowers}
        size={size}
        layoutSeed={seed}
        greeneryStyle={greenery}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center" }}>
        <button
          type="button"
          style={btnStyle}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
          onClick={shuffle}
        >
          {/* shuffle icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
          </svg>
          Try a new arrangement
        </button>
        <button
          type="button"
          style={btnStyle}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
          onClick={cycleGreenery}
        >
          {/* leaf icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
          Change greenery{" "}
          <span style={{ opacity: 0.55, fontStyle: "italic" }}>({GREENERY_LABELS[greenery]})</span>
        </button>
      </div>
    </div>
  );
}