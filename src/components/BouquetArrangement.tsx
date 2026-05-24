// ═══════════════════════════════════════════════════════════════
//  BouquetArrangement
//  CSS-div animated bouquet — structure matches the WT reference:
//    • flowers on growing stems with side leaves
//    • grass clusters (rotated, layered)
//    • long waving leaves rising from the base
//    • floating pollen particles
//  Colors remapped to the project palette:
//    stem/grass/leaves → sage green  hsl(168 38% 38%)
//    petals            → per-flower theme (dusty pink, peach, cream …)
// ═══════════════════════════════════════════════════════════════

import { useMemo } from "react";
import { getTheme } from "@/components/FlowerEmoji";

interface BouquetArrangementProps {
  flowers: string[];
  size?: "sm" | "md" | "lg";
  layoutSeed?: number;
  greeneryStyle?: "classic" | "wild" | "eucalyptus";
}

// Project palette — these mirror the FlowerEmoji THEMES
const FLOWER_COLORS: Record<string, { petal: string; petalLight: string; center: string; glow: string }> = {
  roses:      { petal:"hsl(350 52% 68%)", petalLight:"hsl(352 65% 84%)", center:"hsl(16 55% 54%)",  glow:"hsl(350 60% 70%)" },
  dahlia:     { petal:"hsl(18 62% 68%)",  petalLight:"hsl(24 72% 84%)",  center:"hsl(28 60% 48%)",  glow:"hsl(20 65% 72%)" },
  anemone:    { petal:"hsl(310 42% 72%)", petalLight:"hsl(312 52% 86%)", center:"hsl(230 44% 30%)",  glow:"hsl(312 48% 74%)" },
  daisies:    { petal:"hsl(48 48% 90%)",  petalLight:"hsl(54 60% 96%)",  center:"hsl(42 70% 58%)",  glow:"hsl(50 55% 88%)" },
  sunflowers: { petal:"hsl(44 78% 66%)",  petalLight:"hsl(50 84% 82%)",  center:"hsl(22 50% 28%)",  glow:"hsl(46 75% 70%)" },
  lily:       { petal:"hsl(34 54% 82%)",  petalLight:"hsl(42 62% 92%)",  center:"hsl(30 65% 56%)",  glow:"hsl(36 58% 84%)" },
  tulips:     { petal:"hsl(340 48% 70%)", petalLight:"hsl(344 58% 84%)", center:"hsl(336 40% 40%)",  glow:"hsl(342 52% 72%)" },
  lavender:   { petal:"hsl(262 44% 70%)", petalLight:"hsl(266 54% 84%)", center:"hsl(258 38% 48%)",  glow:"hsl(264 48% 72%)" },
};

// Greenery palette
const G = {
  stem:   "hsl(168 42% 30%)",
  stemL:  "hsl(168 48% 44%)",
  leaf:   "hsl(155 40% 36%)",
  leafL:  "hsl(158 46% 50%)",
  grass:  "hsl(162 44% 34%)",
  grassL: "hsl(162 50% 48%)",
};

// Per-flower bloom config: petal shape, count, size in vmin
const BLOOM_CONFIG: Record<string, { petals: number; pw: number; ph: number; shape: string }> = {
  roses:      { petals:5, pw:7,  ph:9,  shape:"51% 49% 47% 53%/44% 45% 55% 69%" },
  dahlia:     { petals:8, pw:5,  ph:8,  shape:"60% 40% 50% 50%/50% 60% 40% 50%" },
  anemone:    { petals:5, pw:8,  ph:10, shape:"50% 50% 40% 60%/60% 40% 60% 40%" },
  daisies:    { petals:8, pw:4,  ph:10, shape:"50% 50% 50% 50%/60% 60% 40% 40%" },
  sunflowers: { petals:8, pw:5,  ph:10, shape:"50% 50% 48% 52%/52% 48% 52% 48%" },
  lily:       { petals:6, pw:7,  ph:10, shape:"55% 45% 50% 50%/50% 55% 45% 50%" },
  tulips:     { petals:6, pw:6,  ph:10, shape:"48% 52% 48% 52%/55% 45% 55% 45%" },
  lavender:   { petals:5, pw:5,  ph:7,  shape:"52% 48% 46% 54%/46% 48% 52% 54%" },
};

// Stem configs — x positions relative to centre of 60vmin-wide container
// left:50% centres each stem; offsets fan symmetrically left/right
const STEM_CONFIGS = [
  { h:"68vmin", x:"50%",  rot: 0,  delay:"0.3s", leafCount:6 },
  { h:"58vmin", x:"62%",  rot: 22, delay:"0.6s", leafCount:4 },
  { h:"52vmin", x:"38%",  rot:-18, delay:"0.9s", leafCount:4 },
  { h:"62vmin", x:"72%",  rot: 34, delay:"0.5s", leafCount:4 },
  { h:"48vmin", x:"28%",  rot:-30, delay:"0.8s", leafCount:4 },
  { h:"55vmin", x:"80%",  rot: 42, delay:"0.4s", leafCount:4 },
  { h:"44vmin", x:"20%",  rot:-38, delay:"1.0s", leafCount:4 },
  { h:"60vmin", x:"65%",  rot: 22, delay:"0.7s", leafCount:4 },
  { h:"50vmin", x:"35%",  rot:-25, delay:"0.6s", leafCount:4 },
  { h:"46vmin", x:"75%",  rot: 35, delay:"0.9s", leafCount:4 },
];

// Long leaf groups — left is % of the 60vmin container (50% = centre)
// Spread symmetrically: far-left ~-20%, far-right ~120% to match the WT wide-leaf look
const LONG_LEAF_GROUPS = [
  { left:"-30%",  bottom:"25vmin",  rotate:"-5deg", scale:0.8, blur:false, z:1   },
  { left:"-15%",  bottom:"0vmin",   rotate:"3deg",  scale:0.6, blur:false, z:1   },
  { left:"5%",    bottom:"-3vmin",  rotate:"1deg",  scale:0.6, blur:false, z:1   },
  { left:"60%",   bottom:"-3vmin",  rotate:"-1deg", scale:0.6, blur:false, z:1   },
  { left:"80%",   bottom:"0vmin",   rotate:"4deg",  scale:0.8, blur:false, z:1   },
  { left:"30%",   bottom:"-20vmin", rotate:"2deg",  scale:0.8, blur:true,  z:100 },
  { left:"70%",   bottom:"20vmin",  rotate:"-2deg", scale:0.6, blur:true,  z:-1  },
  { left:"20%",   bottom:"25vmin",  rotate:"1deg",  scale:0.7, blur:false, z:2   },
];

const seeded = (seed: number, n: number) =>
  ((Math.sin(seed * 9301 + n * 49297) * 233280) % 1 + 1) % 1;

export default function BouquetArrangement({
  flowers,
  size = "md",
  layoutSeed = 7,
}: BouquetArrangementProps) {
  const flowerList = useMemo(() => {
    if (!flowers.length) return [];
    const sorted = [...flowers].sort((a, b) => {
      const w = { large: 3, medium: 2, small: 1 } as const;
      return w[getTheme(b).sizeCategory] - w[getTheme(a).sizeCategory];
    });
    return sorted.slice(0, 10).map((f, i) => ({
      key:   f,
      cfg:   STEM_CONFIGS[i % STEM_CONFIGS.length],
      colors: FLOWER_COLORS[f] ?? FLOWER_COLORS.roses,
      bloom:  BLOOM_CONFIG[f] ?? BLOOM_CONFIG.roses,
      seed:   seeded(layoutSeed, i),
    }));
  }, [flowers, layoutSeed]);

  const scale = { sm: 0.55, md: 0.72, lg: 0.9 }[size];

  const css = `
    .ba-outer {
      display:flex;
      align-items:flex-end;
      justify-content:center;
      width:100%;
      overflow:visible;
    }
    .ba-root {
      position:relative;
      width:60vmin;
      transform:scale(${scale});
      transform-origin:bottom center;
    }

    /* ── Flower stem ── */
    .ba-flower { position:absolute; bottom:10vmin; transform-origin:bottom center; z-index:10; }
    .ba-stem {
      width:1.5vmin; background-image:
        linear-gradient(to left, rgba(0,0,0,.15), transparent, rgba(255,255,255,.15)),
        linear-gradient(to top, transparent 10%, ${G.stem}, ${G.stemL});
      box-shadow:inset 0 0 2px rgba(0,0,0,.4);
      animation:ba-grow-stem 4s backwards;
    }
    @keyframes ba-grow-stem { 0%{ height:0; border-radius:1vmin; } }

    /* ── Petals ── */
    .ba-leafs { position:relative; animation:ba-bloom 2s backwards; }
    @keyframes ba-bloom { 0%{ transform:scale(0); } }
    .ba-leafs::after {
      content:""; position:absolute; left:0; top:0;
      transform:translate(-50%,-100%);
      width:8vmin; height:8vmin; border-radius:50%;
      filter:blur(8vmin);
    }
    .ba-petal {
      position:absolute; bottom:0; left:50%;
      width:8vmin; height:11vmin;
      transform-origin:bottom center; opacity:.88;
      box-shadow:inset 0 0 2vmin rgba(255,255,255,.45);
    }

    /* ── Petal white centre disc ── */
    .ba-disc {
      position:absolute; left:-3.5vmin; top:-3vmin;
      width:9vmin; height:4vmin; border-radius:50%;
      background-color:#fff8f0;
    }
    .ba-disc::after {
      content:""; position:absolute; left:50%; top:45%;
      transform:translate(-50%,-50%);
      width:60%; height:60%; border-radius:inherit;
      background-image:
        repeating-linear-gradient(135deg,rgba(0,0,0,.04) 0,rgba(0,0,0,.04) 1px,transparent 1px,transparent 10px),
        repeating-linear-gradient(45deg,rgba(0,0,0,.04) 0,rgba(0,0,0,.04) 1px,transparent 1px,transparent 10px),
        linear-gradient(90deg,hsl(44 80% 72%),hsl(38 80% 60%));
    }

    /* ── Pollen lights ── */
    .ba-light {
      position:absolute; bottom:0; width:1vmin; height:1vmin;
      border-radius:50%; filter:blur(.2vmin);
      animation:ba-light 4s linear infinite backwards;
    }
    .ba-light:nth-child(odd)  { background:hsl(50 90% 75%);  }
    .ba-light:nth-child(even) { background:hsl(160 60% 75%); }
    @keyframes ba-light {
      0%  { opacity:0; transform:translateY(0); }
      25% { opacity:1; transform:translateY(-5vmin) translateX(-2vmin); }
      50% { opacity:1; transform:translateY(-15vmin) translateX(2vmin); filter:blur(.2vmin); }
      75% { transform:translateY(-22vmin) translateX(-2vmin); filter:blur(.3vmin); }
      100%{ transform:translateY(-32vmin); opacity:0; filter:blur(1vmin); }
    }

    /* ── Stem side-leaves ── */
    .ba-side-leaf {
      --w:7vmin; --h:calc(var(--w) + 2vmin);
      position:absolute; top:20%; left:90%;
      width:var(--w); height:var(--h);
      background-image:linear-gradient(to top, rgba(0,0,0,.2), ${G.leafL});
    }
    .ba-side-leaf.right {
      border-top-right-radius:var(--h); border-bottom-left-radius:var(--h);
      animation:ba-leaf-right .8s backwards;
    }
    .ba-side-leaf.left {
      border-top-left-radius:var(--h); border-bottom-right-radius:var(--h);
      left:-460%; animation:ba-leaf-left .8s backwards;
    }
    @keyframes ba-leaf-right { 0%{ transform-origin:left;  transform:rotate(70deg) rotateY(30deg) scale(0); } }
    @keyframes ba-leaf-left  { 0%{ transform-origin:right; transform:rotate(-70deg) rotateY(30deg) scale(0); } }

    /* ── Flower sway animations (translateX(-50%) baked in so sway doesn't break centering) ── */
    @keyframes ba-sway-0  { 0%,100%{ transform:translateX(-50%) rotate(2deg);  } 50%{ transform:translateX(-50%) rotate(-2deg);  } }
    @keyframes ba-sway-1  { 0%,100%{ transform:translateX(-50%) rotate(22deg); } 50%{ transform:translateX(-50%) rotate(18deg);  } }
    @keyframes ba-sway-2  { 0%,100%{ transform:translateX(-50%) rotate(-18deg);} 50%{ transform:translateX(-50%) rotate(-22deg) rotateY(-8deg); } }
    @keyframes ba-sway-3  { 0%,100%{ transform:translateX(-50%) rotate(35deg); } 50%{ transform:translateX(-50%) rotate(31deg);  } }
    @keyframes ba-sway-4  { 0%,100%{ transform:translateX(-50%) rotate(-30deg);} 50%{ transform:translateX(-50%) rotate(-34deg); } }
    @keyframes ba-sway-5  { 0%,100%{ transform:translateX(-50%) rotate(43deg); } 50%{ transform:translateX(-50%) rotate(39deg);  } }
    @keyframes ba-sway-6  { 0%,100%{ transform:translateX(-50%) rotate(-38deg);} 50%{ transform:translateX(-50%) rotate(-42deg); } }
    @keyframes ba-sway-7  { 0%,100%{ transform:translateX(-50%) rotate(22deg); } 50%{ transform:translateX(-50%) rotate(18deg);  } }
    @keyframes ba-sway-8  { 0%,100%{ transform:translateX(-50%) rotate(-25deg);} 50%{ transform:translateX(-50%) rotate(-29deg); } }
    @keyframes ba-sway-9  { 0%,100%{ transform:translateX(-50%) rotate(36deg); } 50%{ transform:translateX(-50%) rotate(32deg);  } }

    /* ── Grass cluster ── */
    .ba-grass-wrap { animation:ba-grass-grow 1s 2s backwards; }
    @keyframes ba-grass-grow { 0%{ transform:scale(0); } }
    .ba-grass {
      --c:${G.grass};
      --cL:${G.grassL};
      --lw:1.5vmin;
      position:absolute; bottom:12vmin; left:-7vmin;
      display:flex; flex-direction:column; align-items:flex-end;
      transform-origin:bottom center;
      transform:rotate(-48deg) rotateY(40deg);
    }
    .ba-grass.g1 { animation:ba-grass-sway 2s linear infinite; }
    .ba-grass.g2 {
      left:2vmin; bottom:10vmin;
      transform:scale(.5) rotate(75deg) rotateX(10deg) rotateY(-200deg);
      opacity:.8; z-index:0;
      animation:ba-grass-sway2 1.5s linear infinite;
    }
    @keyframes ba-grass-sway  { 0%,100%{transform:rotate(-48deg) rotateY(40deg);} 50%{transform:rotate(-50deg) rotateY(40deg);} }
    @keyframes ba-grass-sway2 { 0%,100%{transform:scale(.5) rotate(75deg) rotateX(10deg) rotateY(-200deg);} 50%{transform:scale(.5) rotate(79deg) rotateX(10deg) rotateY(-200deg);} }

    .ba-grass-top {
      width:7vmin; height:10vmin; border-top-right-radius:100%;
      border-right:var(--lw) solid var(--c);
      transform-origin:bottom center; transform:rotate(-2deg);
    }
    .ba-grass-bottom {
      margin-top:-2px; width:var(--lw); height:25vmin;
      background-image:linear-gradient(to top, transparent, var(--c));
    }
    .ba-grass-leaf {
      --size:10vmin;
      position:absolute;
      width:calc(var(--size)*2.1); height:var(--size);
      border-top-left-radius:var(--size); border-top-right-radius:var(--size);
      background-image:linear-gradient(to top, transparent, transparent 30%, var(--c));
      z-index:100;
    }
    .ba-grass-overlay {
      position:absolute; top:-10%; right:0; width:100%; height:100%;
      background:rgba(0,0,0,.35); filter:blur(1.5vmin); z-index:100;
    }

    /* ── Right/back big leaves ── */
    .ba-g-right {
      position:absolute; bottom:6vmin; left:-2vmin;
      transform-origin:bottom left; transform:rotate(20deg);
    }
    .ba-g-right .ba-big-leaf {
      width:30vmin; height:50vmin; border-top-left-radius:100%;
      border-left:2vmin solid ${G.leaf};
      background-image:linear-gradient(to bottom, transparent, rgba(0,0,0,.45) 60%);
      mask-image:linear-gradient(to top, transparent 30%, ${G.leaf} 60%);
      -webkit-mask-image:linear-gradient(to top, transparent 30%, ${G.leaf} 60%);
    }
    .ba-g-right.r1 { animation:ba-gr-sway1 2.5s linear infinite; }
    .ba-g-right.r2 { left:5vmin; transform:rotateY(-180deg); animation:ba-gr-sway2 3s linear infinite; }
    .ba-g-right.r2 .ba-big-leaf { height:75vmin; filter:blur(.3vmin); opacity:.8; }
    @keyframes ba-gr-sway1 { 0%,100%{transform:rotate(20deg);} 50%{transform:rotate(24deg) rotateX(-20deg);} }
    @keyframes ba-gr-sway2 { 0%,100%{transform:rotateY(-180deg) rotate(0deg) rotateX(-20deg);} 50%{transform:rotateY(-180deg) rotate(6deg) rotateX(-20deg);} }

    /* ── Front fern ── */
    .ba-g-front {
      position:absolute; bottom:6vmin; left:2.5vmin; z-index:100;
      transform-origin:bottom center;
      transform:rotate(-28deg) rotateY(30deg) scale(1.04);
      animation:ba-front-sway 2s linear infinite;
    }
    @keyframes ba-front-sway {
      0%,100%{transform:rotate(-28deg) rotateY(30deg) scale(1.04);}
      50%{transform:rotate(-35deg) rotateY(40deg) scale(1.04);}
    }
    .ba-front-line {
      width:.3vmin; height:20vmin; position:relative;
      background-image:linear-gradient(to top, transparent, ${G.leafL}, transparent);
    }
    .ba-front-leaf-wrap {
      position:absolute; top:0; left:0; transform-origin:bottom left;
    }
    .ba-front-leaf-wrap.odd  { transform:rotate(10deg); }
    .ba-front-leaf-wrap.even { left:0; transform:rotateY(-180deg) rotate(5deg); }
    .ba-front-leaf {
      width:10vmin; height:10vmin;
      border-radius:100% 0% 0% 100%/100% 100% 0% 0%;
      box-shadow:inset 0 2px 1vmin rgba(100,220,180,.2);
      background-image:
        linear-gradient(to bottom left, transparent, rgba(0,0,0,.5)),
        linear-gradient(to bottom right, ${G.grassL} 50%, transparent 50%);
      -webkit-mask-image:linear-gradient(to bottom right, ${G.grassL} 50%, transparent 50%);
      mask-image:linear-gradient(to bottom right, ${G.grassL} 50%, transparent 50%);
    }

    /* ── Long leaf groups ── */
    .ba-long-g { position:absolute; bottom:25vmin; left:0; transform-origin:bottom left; }
    .ba-long-leaf {
      --w:15vmin; --h:40vmin;
      position:absolute; bottom:0;
      width:var(--w); height:var(--h);
      border-top-left-radius:100%;
      border-left:2vmin solid ${G.leaf};
      mask-image:linear-gradient(to top, transparent 20%, ${G.leaf});
      -webkit-mask-image:linear-gradient(to top, transparent 20%, ${G.leaf});
      transform-origin:bottom center;
      animation:ba-leaf-sway1 4s linear infinite;
    }
    .ba-long-leaf.l0 { left:2vmin; }
    .ba-long-leaf.l1 { --w:5vmin; --h:60vmin; }
    .ba-long-leaf.l2 {
      --w:10vmin; --h:40vmin; left:-.5vmin; bottom:5vmin;
      transform-origin:bottom left; transform:rotateY(-180deg);
      animation:ba-leaf-sway2 3s linear infinite;
    }
    .ba-long-leaf.l3 {
      --w:5vmin; --h:30vmin; left:-1vmin; bottom:3.2vmin;
      transform-origin:bottom left; transform:rotate(-10deg) rotateY(-180deg);
      animation:ba-leaf-sway3 3s linear infinite;
    }
    @keyframes ba-leaf-sway1 { 0%,100%{transform:rotate(-5deg) scale(1);} 50%{transform:rotate(5deg) scale(1.08);} }
    @keyframes ba-leaf-sway2 { 0%,100%{transform:rotateY(-180deg) rotate(5deg);} 50%{transform:rotateY(-180deg) rotate(0deg) scale(1.08);} }
    @keyframes ba-leaf-sway3 { 0%,100%{transform:rotate(-10deg) rotateY(-180deg);} 50%{transform:rotate(-20deg) rotateY(-180deg);} }

    /* ── g-long single stem with curl top ── */
    .ba-g-long {
      --w:2vmin; --h:6vmin;
      position:absolute; bottom:10vmin; left:-3vmin;
      transform-origin:bottom center; transform:rotate(-30deg) rotateY(-20deg);
      display:flex; flex-direction:column; align-items:flex-end;
      animation:ba-glong-sway 3s linear infinite;
    }
    @keyframes ba-glong-sway { 0%,100%{transform:rotate(-30deg) rotateY(-20deg);} 50%{transform:rotate(-32deg) rotateY(-20deg);} }
    .ba-g-long-top {
      top:calc(var(--h)*-1); width:calc(var(--w)+1vmin); height:var(--h);
      border-top-right-radius:100%; border-right:.7vmin solid ${G.stemL};
      transform:translate(-.7vmin, 1vmin);
    }
    .ba-g-long-bottom {
      width:var(--w); height:50vmin; transform-origin:bottom center;
      background-image:linear-gradient(to top, transparent 30%, ${G.stemL});
      box-shadow:inset 0 0 2px rgba(0,0,0,.4);
      clip-path:polygon(35% 0, 65% 1%, 100% 100%, 0% 100%);
    }

    /* ── grow-in animation wrapper ── */
    .ba-grow { animation:ba-grow-in 2s var(--d, 0s) backwards; }
    @keyframes ba-grow-in { 0%{ transform:scale(0); opacity:0; } }
  `;

  const LIGHT_OFFSETS = ["-2vmin","3vmin","-6vmin","6vmin","-1vmin","-4vmin","3vmin","-5vmin"];
  const LIGHT_DELAYS  = ["1s",".5s",".3s",".9s","1.5s","3s","2s","3.5s"];

  const grassLeafStyles = [
    { top:"-6%",  left:"30%",   size:"6vmin",  rot:"-20deg"              },
    { top:"-5%",  left:"-110%", size:"6vmin",  rot:"10deg"               },
    { top:"5%",   left:"60%",   size:"8vmin",  rot:"-18deg"              },
    { top:"6%",   left:"-135%", size:"8vmin",  rot:"2deg"                },
    { top:"20%",  left:"60%",   size:"10vmin", rot:"-24deg"              },
    { top:"22%",  left:"-180%", size:"10vmin", rot:"10deg"               },
    { top:"39%",  left:"70%",   size:"10vmin", rot:"-10deg"              },
    { top:"40%",  left:"-215%", size:"11vmin", rot:"10deg"               },
  ];

  const frontLeafPositions = [
    { top:"-8vmin", cls:"odd",  scale:"scale(.7)"              },
    { top:"-8vmin", cls:"even", scale:"scale(.7)"              },
    { top:"-3vmin", cls:"odd"                                   },
    { top:"-3vmin", cls:"even", scale:"scale(.9)"              },
    { top:"2vmin",  cls:"odd"                                   },
    { top:"2vmin",  cls:"even"                                  },
    { top:"6.5vmin",cls:"odd"                                   },
    { top:"6.5vmin",cls:"even"                                  },
  ];

  // Petal rotation offsets per slot & total count
  const getPetalTransforms = (count: number, pw: number, ph: number) => {
    const step = 360 / count;
    return Array.from({ length: count }).map((_, i) => {
      const angle = step * i;
      const rad   = (angle * Math.PI) / 180;
      return {
        transform: `translate(-50%, 0%) rotate(${angle}deg) translateY(-${ph * 0.35}vmin)`,
        style: { left:"50%", bottom:"0", transform:`
          translate(-50%, 0%)
          rotate(${angle}deg)
          translateY(-${ph * 0.28}vmin)
        `},
      };
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ba-outer">
      <div className="ba-root">

        {/* ── Flowers on stems ── */}
        {flowerList.map((fl, i) => {
          const cfg    = fl.cfg;
          const col    = fl.colors;
          const bloom  = fl.bloom;
          const ptfms  = getPetalTransforms(bloom.petals, bloom.pw, bloom.ph);
          const sideLeafTops  = ["20%","45%","70%","85%","10%","55%"];
          const sideLeafDelay = [1.6, 1.4, 1.2, 1.0, 1.8, 2.0];

          return (
            <div
              key={`flower-${i}`}
              className="ba-flower"
              style={{
                left: cfg.x,
                animation: `ba-sway-${i % 10} 4s linear infinite`,
              }}
            >
              {/* Bloom head */}
              <div
                className="ba-leafs"
                style={{
                  animationDelay: cfg.delay,
                  '--glow': col.glow,
                } as React.CSSProperties}
              >
                {/* Glow halo */}
                <div style={{
                  position:"absolute", left:0, top:0,
                  transform:"translate(-50%,-100%)",
                  width:"8vmin", height:"8vmin", borderRadius:"50%",
                  backgroundColor: col.glow,
                  filter:"blur(8vmin)",
                }}/>

                {/* Petals */}
                {ptfms.map((_, pi) => {
                  const angle   = (360 / bloom.petals) * pi;
                  const isFirst = pi === 0;
                  return (
                    <div
                      key={pi}
                      className="ba-petal"
                      style={{
                        width:`${bloom.pw}vmin`,
                        height:`${bloom.ph}vmin`,
                        borderRadius: bloom.shape,
                        backgroundColor: pi % 2 === 0 ? col.petal : col.petalLight,
                        backgroundImage:`linear-gradient(to top, ${col.petal}, ${col.petalLight})`,
                        transform:`translate(-50%, 0%) rotate(${angle}deg)
                                   translateY(-${bloom.ph * 0.3}vmin)`,
                      }}
                    />
                  );
                })}

                {/* Centre disc */}
                <div className="ba-disc"/>

                {/* Pollen lights */}
                {LIGHT_OFFSETS.map((lx, li) => (
                  <div
                    key={li}
                    className="ba-light"
                    style={{ left: lx, animationDelay: LIGHT_DELAYS[li] }}
                  />
                ))}
              </div>

              {/* Stem */}
              <div
                className="ba-stem"
                style={{
                  height: cfg.h,
                  animationDelay: cfg.delay,
                }}
              >
                {/* Side leaves */}
                {Array.from({ length: cfg.leafCount }).map((_, li) => {
                  const isRight = li % 2 === 0;
                  const delay   = `${sideLeafDelay[li] ?? 1.4}s`;
                  return (
                    <div
                      key={li}
                      className={`ba-side-leaf ${isRight ? "right" : "left"}`}
                      style={{
                        top: sideLeafTops[li] ?? "30%",
                        animationDelay: delay,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── Long single g-long stem ── */}
        <div className="ba-grow" style={{"--d":"1.2s"} as React.CSSProperties}>
          <div className="ba-g-long">
            <div className="ba-g-long-top"/>
            <div className="ba-g-long-bottom"/>
          </div>
        </div>

        {/* ── Grass clusters ── */}
        <div className="ba-grass-wrap">
          <div className="ba-grass g1">
            <div className="ba-grass-top"/>
            <div className="ba-grass-bottom"/>
            {grassLeafStyles.map((g, gi) => (
              <div key={gi} className="ba-grass-leaf" style={{
                top:g.top, left:g.left,
                ["--size" as string]:g.size,
                transform:`rotate(${g.rot})`,
              }}/>
            ))}
            <div className="ba-grass-overlay"/>
          </div>
        </div>
        <div className="ba-grass-wrap">
          <div className="ba-grass g2">
            <div className="ba-grass-top"/>
            <div className="ba-grass-bottom"/>
            {grassLeafStyles.slice(0,6).map((g, gi) => (
              <div key={gi} className="ba-grass-leaf" style={{
                top:g.top, left:g.left,
                ["--size" as string]:g.size,
                transform:`rotate(${g.rot})`,
              }}/>
            ))}
            <div className="ba-grass-overlay"/>
          </div>
        </div>

        {/* ── Right/back big leaves ── */}
        <div className="ba-grow" style={{"--d":"2.4s"} as React.CSSProperties}>
          <div className="ba-g-right r1"><div className="ba-big-leaf"/></div>
        </div>
        <div className="ba-grow" style={{"--d":"2.8s"} as React.CSSProperties}>
          <div className="ba-g-right r2"><div className="ba-big-leaf"/></div>
        </div>

        {/* ── Front fern ── */}
        <div className="ba-grow" style={{"--d":"2.8s"} as React.CSSProperties}>
          <div className="ba-g-front">
            {frontLeafPositions.map((lp, li) => (
              <div
                key={li}
                className={`ba-front-leaf-wrap ${lp.cls}`}
                style={{
                  top: lp.top,
                  ...(lp.scale ? { transform: `${lp.cls === "even" ? "rotateY(-180deg) " : ""}${lp.scale}` } : {}),
                }}
              >
                <div className="ba-front-leaf"/>
              </div>
            ))}
            <div className="ba-front-line"/>
          </div>
        </div>

        {/* ── Long leaf groups (base) ── */}
        {LONG_LEAF_GROUPS.map((lg, lgi) => (
          <div
            key={lgi}
            className="ba-long-g"
            style={{
              left:     lg.left,
              bottom:   lg.bottom,
              transform:`scale(${lg.scale}) rotate(${lg.rotate})`,
              zIndex:   lg.z,
              filter:   lg.blur ? "blur(.3vmin)" : undefined,
            }}
          >
            {["l0","l1","l2","l3"].map((cls, li) => (
              <div
                key={li}
                className="ba-grow"
                style={{"--d":`${3 + lgi * 0.2 + li * 0.2}s`} as React.CSSProperties}
              >
                <div className={`ba-long-leaf ${cls}`}/>
              </div>
            ))}
          </div>
        ))}

      </div>
      </div>
    </>
  );
}