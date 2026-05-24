// ══════════════════════════════════════════════════════
//  FlowerEmoji — Botanical Sketch / Watercolour-Ink style
//  Muted pastel palette, hand-drawn ink outlines,
//  sketch strokes, cross-hatching, organic imperfection.
// ══════════════════════════════════════════════════════

interface FlowerTheme {
  name: string;
  petal: string;
  petalDark: string;
  petalLight: string;
  center: string;
  centerDark: string;
  ink: string;          // main ink outline colour
  wash: string;         // watercolour wash (semi-transparent fill)
  type: "rose" | "dahlia" | "anemone" | "daisy" | "sunflower" | "lily" | "tulip" | "lavender";
  sizeCategory: "large" | "medium" | "small";
}

// Muted botanical palette — dusty pinks, peach, cream, soft lavender
const THEMES: Record<string, FlowerTheme> = {
  roses: {
    name: "Rose",
    petal:      "hsl(350 42% 72%)",
    petalDark:  "hsl(348 38% 54%)",
    petalLight: "hsl(352 55% 88%)",
    center:     "hsl(16 48% 52%)",
    centerDark: "hsl(14 44% 36%)",
    ink:        "hsl(345 30% 24%)",
    wash:       "hsl(350 44% 80%)",
    type: "rose", sizeCategory: "large",
  },
  dahlia: {
    name: "Dahlia",
    petal:      "hsl(18 52% 72%)",
    petalDark:  "hsl(16 46% 54%)",
    petalLight: "hsl(24 62% 88%)",
    center:     "hsl(28 56% 46%)",
    centerDark: "hsl(22 50% 32%)",
    ink:        "hsl(18 32% 22%)",
    wash:       "hsl(20 48% 82%)",
    type: "dahlia", sizeCategory: "large",
  },
  anemone: {
    name: "Anemone",
    petal:      "hsl(310 32% 76%)",
    petalDark:  "hsl(310 28% 58%)",
    petalLight: "hsl(312 42% 90%)",
    center:     "hsl(230 36% 28%)",
    centerDark: "hsl(230 38% 18%)",
    ink:        "hsl(310 22% 22%)",
    wash:       "hsl(312 34% 84%)",
    type: "anemone", sizeCategory: "medium",
  },
  daisies: {
    name: "Daisy",
    petal:      "hsl(48 38% 92%)",
    petalDark:  "hsl(44 30% 76%)",
    petalLight: "hsl(54 50% 97%)",
    center:     "hsl(42 62% 56%)",
    centerDark: "hsl(34 56% 38%)",
    ink:        "hsl(40 24% 28%)",
    wash:       "hsl(48 40% 92%)",
    type: "daisy", sizeCategory: "small",
  },
  sunflowers: {
    name: "Sunflower",
    petal:      "hsl(44 68% 68%)",
    petalDark:  "hsl(36 60% 50%)",
    petalLight: "hsl(50 74% 84%)",
    center:     "hsl(22 44% 26%)",
    centerDark: "hsl(18 42% 16%)",
    ink:        "hsl(32 34% 20%)",
    wash:       "hsl(46 62% 78%)",
    type: "sunflower", sizeCategory: "large",
  },
  lily: {
    name: "Lily",
    petal:      "hsl(34 44% 84%)",
    petalDark:  "hsl(28 38% 66%)",
    petalLight: "hsl(42 52% 94%)",
    center:     "hsl(30 58% 54%)",
    centerDark: "hsl(24 50% 36%)",
    ink:        "hsl(28 28% 26%)",
    wash:       "hsl(36 44% 88%)",
    type: "lily", sizeCategory: "medium",
  },
  tulips: {
    name: "Tulip",
    petal:      "hsl(340 38% 72%)",
    petalDark:  "hsl(338 32% 54%)",
    petalLight: "hsl(344 48% 86%)",
    center:     "hsl(336 34% 38%)",
    centerDark: "hsl(334 32% 26%)",
    ink:        "hsl(336 26% 22%)",
    wash:       "hsl(342 38% 82%)",
    type: "tulip", sizeCategory: "medium",
  },
  lavender: {
    name: "Lavender",
    petal:      "hsl(262 34% 72%)",
    petalDark:  "hsl(260 28% 54%)",
    petalLight: "hsl(266 44% 86%)",
    center:     "hsl(258 32% 46%)",
    centerDark: "hsl(256 30% 30%)",
    ink:        "hsl(258 22% 24%)",
    wash:       "hsl(264 36% 82%)",
    type: "lavender", sizeCategory: "small",
  },
};

export const getTheme = (key: string) => THEMES[key] || THEMES.roses;
export const getAllThemes = () => Object.entries(THEMES).map(([key, val]) => ({ key, ...val }));
const uid = (base: string, seed: string) => `${base}-${seed.replace(/[^a-z0-9]/g, "")}`;

// ── Sketch helpers ──────────────────────────────────────
// Adds tiny random-ish wobble to make paths look hand-drawn
// (deterministic based on index so SSR-safe)
const sketchOffset = (i: number, mag: number) =>
  ((Math.sin(i * 137.5) * 0.5 + 0.5) - 0.5) * mag;

// Cross-hatch lines inside a rough circle
const CrossHatch = ({ r, ink, n = 6 }: { r: number; ink: string; n?: number }) => (
  <g opacity={0.18}>
    {Array.from({ length: n }).map((_, i) => {
      const y = -r + (2 * r / (n - 1)) * i;
      const hw = Math.sqrt(Math.max(0, r * r - y * y));
      return (
        <line key={i} x1={-hw + sketchOffset(i, 1.5)} y1={y + sketchOffset(i+1, 0.8)}
          x2={hw + sketchOffset(i+2, 1.5)} y2={y + sketchOffset(i+3, 0.8)}
          stroke={ink} strokeWidth={0.55} strokeLinecap="round"/>
      );
    })}
  </g>
);

// Sketch stroke overlay — wobbly lines radiating from centre
const SketchStrokes = ({ r, n, ink }: { r: number; n: number; ink: string }) => (
  <g opacity={0.14}>
    {Array.from({ length: n }).map((_, i) => {
      const a = (360 / n) * i;
      const rad = (a * Math.PI) / 180;
      const ox = sketchOffset(i * 3, 1.2), oy = sketchOffset(i * 3 + 1, 1.0);
      return (
        <line key={i}
          x1={ox} y1={oy}
          x2={Math.sin(rad) * r + ox} y2={-Math.cos(rad) * r + oy}
          stroke={ink} strokeWidth={0.4} strokeLinecap="round"/>
      );
    })}
  </g>
);

// ── Rose (botanical sketch) ─────────────────────────────
const RoseFlower = ({ t, id }: { t: FlowerTheme; id: string }) => {
  const pg = uid("rp", id);
  return (
    <g transform="translate(60 60)">
      <defs>
        <radialGradient id={pg} cx="35%" cy="28%" r="68%">
          <stop offset="0%"   stopColor={t.petalLight} stopOpacity={0.92}/>
          <stop offset="55%"  stopColor={t.wash}       stopOpacity={0.75}/>
          <stop offset="100%" stopColor={t.petalDark}  stopOpacity={0.85}/>
        </radialGradient>
      </defs>

      {/* Outer petals — organic, uneven, slightly overlapping */}
      {[0,42,87,130,175,218,263,308].map((a, i) => {
        const ox = sketchOffset(i, 1.4), oy = sketchOffset(i+5, 1.2);
        const len = 24 + sketchOffset(i*2, 3);
        const wid = 9  + sketchOffset(i*3, 2);
        return (
          <g key={i} transform={`rotate(${a + sketchOffset(i, 4)})`}>
            {/* Watercolour wash fill */}
            <path d={`M${ox} ${oy} C-${wid} -${len*0.5} -${wid*0.7} -${len} ${ox} -${len-2+sketchOffset(i,2)} C${wid*0.7} -${len} ${wid} -${len*0.5} ${ox} ${oy}Z`}
              fill={`url(#${pg})`} opacity={0.82}/>
            {/* Ink outline — slightly wobbly */}
            <path d={`M${ox} ${oy} C-${wid+ox} -${len*0.48} -${wid*0.65} -${len+oy} ${ox} -${len-1} C${wid*0.65+ox} -${len+oy} ${wid+ox} -${len*0.48} ${ox} ${oy}`}
              fill="none" stroke={t.ink} strokeWidth={0.7 + sketchOffset(i, 0.3)} strokeLinecap="round"/>
            {/* Petal midvein — sketch line */}
            <line x1={ox} y1={-4} x2={ox + sketchOffset(i,1.5)} y2={-len+6}
              stroke={t.ink} strokeWidth={0.35} opacity={0.35} strokeLinecap="round"/>
          </g>
        );
      })}

      {/* Mid petals */}
      {[20, 78, 138, 198, 258, 318].map((a, i) => (
        <g key={i} transform={`rotate(${a + sketchOffset(i+8, 5)})`}>
          <path d={`M0 0 C-7 -${12+sketchOffset(i,2)} -6 -${21+sketchOffset(i+1,2)} 0 -${19+sketchOffset(i,1.5)} C6 -${21+sketchOffset(i+1,2)} 7 -${12+sketchOffset(i,2)} 0 0Z`}
            fill={t.wash} stroke={t.ink} strokeWidth={0.65} opacity={0.78}/>
          <line x1={0} y1={-3} x2={sketchOffset(i,1)} y2={-16}
            stroke={t.ink} strokeWidth={0.3} opacity={0.3}/>
        </g>
      ))}

      {/* Inner bud petals */}
      {[0, 55, 115, 175, 235, 295].map((a, i) => (
        <path key={i}
          d={`M0 0 C-${4+sketchOffset(i,1)} -${7+sketchOffset(i,1.5)} -4 -${13+sketchOffset(i,1)} 0 -${11+sketchOffset(i,1)} C4 -${13+sketchOffset(i,1)} ${4+sketchOffset(i,1)} -${7+sketchOffset(i,1.5)} 0 0Z`}
          fill={t.petalLight} stroke={t.ink} strokeWidth={0.55} opacity={0.88}
          transform={`rotate(${a + sketchOffset(i, 5)})`}/>
      ))}

      {/* Centre — sepal/stigma with sketch dots */}
      <circle cx={sketchOffset(1,1)} cy={sketchOffset(2,1)} r={5.5}
        fill={t.center} stroke={t.ink} strokeWidth={0.8} opacity={0.9}/>
      <CrossHatch r={5} ink={t.ink} n={5}/>
      {/* Stamens dots */}
      {[0,60,120,180,240,300].map((a,i) => {
        const rad = a * Math.PI / 180;
        return <circle key={i} cx={Math.sin(rad)*3.5} cy={-Math.cos(rad)*3.5}
          r={0.8} fill={t.centerDark} opacity={0.7}/>;
      })}
    </g>
  );
};

// ── Dahlia (botanical sketch) ───────────────────────────
const DahliaFlower = ({ t, id }: { t: FlowerTheme; id: string }) => {
  const pg = uid("dp", id);
  return (
    <g transform="translate(60 60)">
      <defs>
        <linearGradient id={pg} x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%"   stopColor={t.petalLight} stopOpacity={0.9}/>
          <stop offset="100%" stopColor={t.petalDark}  stopOpacity={0.85}/>
        </linearGradient>
      </defs>
      {/* Outer 18 petals — slightly uneven lengths */}
      {Array.from({ length: 18 }).map((_, i) => {
        const len = 28 + sketchOffset(i * 2, 3);
        const w   =  4 + sketchOffset(i * 3, 1);
        return (
          <g key={i} transform={`rotate(${(360/18)*i + sketchOffset(i,3)})`}>
            <path d={`M-${w} 0 C-${w+1} -${len*0.4} -${w*0.6} -${len} 0 -${len-1+sketchOffset(i,2)} C${w*0.6} -${len} ${w+1} -${len*0.4} ${w} 0Z`}
              fill={`url(#${pg})`} opacity={0.84}/>
            <path d={`M-${w} 0 C-${w+1.5} -${len*0.38} -${w*0.5} -${len+1} 0 -${len} C${w*0.5} -${len+1} ${w+1.5} -${len*0.38} ${w} 0`}
              fill="none" stroke={t.ink} strokeWidth={0.6} strokeLinecap="round"/>
            <line x1={0} y1={-2} x2={sketchOffset(i,0.8)} y2={-len+4}
              stroke={t.ink} strokeWidth={0.3} opacity={0.28}/>
          </g>
        );
      })}
      {/* Mid 12 petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const len = 20 + sketchOffset(i, 2);
        return (
          <g key={i} transform={`rotate(${(360/12)*i + 15 + sketchOffset(i,4)})`}>
            <path d={`M-3.5 0 C-4.5 -${len*0.4} -3 -${len} 0 -${len-1} C3 -${len} 4.5 -${len*0.4} 3.5 0Z`}
              fill={t.wash} stroke={t.ink} strokeWidth={0.55} opacity={0.82}/>
          </g>
        );
      })}
      {/* Inner 8 petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} transform={`rotate(${(360/8)*i + sketchOffset(i,6)})`}>
          <path d={`M-2.5 0 C-3 -6 -2 -13 0 -12 C2 -13 3 -6 2.5 0Z`}
            fill={t.petalLight} stroke={t.ink} strokeWidth={0.5} opacity={0.9}/>
        </g>
      ))}
      {/* Centre disc */}
      <circle cx={0} cy={0} r={7.5} fill={t.center} stroke={t.ink} strokeWidth={0.85}/>
      <CrossHatch r={6.5} ink={t.ink} n={7}/>
      <circle cx={-1.5} cy={-1.5} r={2.2} fill={t.petalLight} opacity={0.28}/>
    </g>
  );
};

// ── Anemone (botanical sketch) ──────────────────────────
const AnemoneFlower = ({ t, id }: { t: FlowerTheme; id: string }) => {
  const pg = uid("ap", id);
  return (
    <g transform="translate(60 60)">
      <defs>
        <radialGradient id={pg} cx="46%" cy="20%" r="80%">
          <stop offset="0%"   stopColor={t.petalLight} stopOpacity={0.88}/>
          <stop offset="70%"  stopColor={t.wash}       stopOpacity={0.78}/>
          <stop offset="100%" stopColor={t.petalDark}  stopOpacity={0.82}/>
        </radialGradient>
      </defs>
      {/* 5 broad petals with veining and organic edges */}
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i} transform={`rotate(${72*i + sketchOffset(i,5)})`}>
          {/* Wash fill */}
          <path d={`M0 0 C-${16+sketchOffset(i,2)} -${13+sketchOffset(i,1.5)} -${17+sketchOffset(i,1.5)} -${28+sketchOffset(i,2)} 0 -${27+sketchOffset(i,1.5)} C${17+sketchOffset(i,1.5)} -${28+sketchOffset(i,2)} ${16+sketchOffset(i,2)} -${13+sketchOffset(i,1.5)} 0 0Z`}
            fill={`url(#${pg})`} opacity={0.88}/>
          {/* Ink outline */}
          <path d={`M${sketchOffset(i,1)} 0 C-${15+sketchOffset(i,2)} -${12} -${17} -${27+sketchOffset(i,2)} ${sketchOffset(i*2,1.5)} -${26} C${17} -${27+sketchOffset(i,2)} ${15+sketchOffset(i,2)} -${12} ${sketchOffset(i,1)} 0`}
            fill="none" stroke={t.ink} strokeWidth={0.8} strokeLinecap="round"/>
          {/* 3 veins per petal */}
          <line x1={0} y1={-4} x2={sketchOffset(i,1.5)} y2={-23} stroke={t.ink} strokeWidth={0.4} opacity={0.32}/>
          <line x1={0} y1={-6} x2={-7+sketchOffset(i,1)} y2={-20} stroke={t.ink} strokeWidth={0.28} opacity={0.22}/>
          <line x1={0} y1={-6} x2={ 7+sketchOffset(i,1)} y2={-20} stroke={t.ink} strokeWidth={0.28} opacity={0.22}/>
        </g>
      ))}
      {/* Dark velvety centre disc */}
      <circle cx={sketchOffset(2,1)} cy={sketchOffset(3,1)} r={13}
        fill={t.center} stroke={t.ink} strokeWidth={0.9} opacity={0.92}/>
      <CrossHatch r={11} ink="hsl(0 0% 100%)" n={8}/>
      {/* Stamen ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (360/24)*i; const rad = a * Math.PI / 180;
        return (
          <g key={i}>
            <line x1={Math.sin(rad)*5} y1={-Math.cos(rad)*5}
              x2={Math.sin(rad)*10.5} y2={-Math.cos(rad)*10.5}
              stroke="hsl(260 40% 72%)" strokeWidth={0.65}/>
            <circle cx={Math.sin(rad)*10.5} cy={-Math.cos(rad)*10.5}
              r={1.4} fill="hsl(260 50% 82%)" opacity={0.9}/>
          </g>
        );
      })}
      <circle cx={0} cy={0} r={3.5} fill={t.centerDark} opacity={0.7}/>
    </g>
  );
};

// ── Daisy (botanical sketch) ────────────────────────────
const DaisyFlower = ({ t, id }: { t: FlowerTheme; id: string }) => {
  return (
    <g transform="translate(60 60)">
      {/* 16 ray petals — varying lengths, organic */}
      {Array.from({ length: 16 }).map((_, i) => {
        const len = 20 + sketchOffset(i * 2, 4);
        const w   =  4 + sketchOffset(i * 3, 1.2);
        return (
          <g key={i} transform={`rotate(${(360/16)*i + sketchOffset(i, 3)})`}>
            {/* Wash fill */}
            <ellipse cx={sketchOffset(i,0.8)} cy={-(len/2+2)} rx={w} ry={len/2+1}
              fill={t.wash} opacity={0.80}/>
            {/* Ink outline */}
            <path d={`M-${w} -2 C-${w+1} -${len*0.4} -${w*0.6} -${len+1} ${sketchOffset(i,1.2)} -${len} C${w*0.6} -${len+1} ${w+1} -${len*0.4} ${w} -2`}
              fill="none" stroke={t.ink} strokeWidth={0.65} strokeLinecap="round"/>
            {/* Midvein */}
            <line x1={sketchOffset(i,0.6)} y1={-3} x2={sketchOffset(i,1.2)} y2={-len+3}
              stroke={t.ink} strokeWidth={0.32} opacity={0.30}/>
          </g>
        );
      })}
      {/* Domed centre — warm ochre */}
      <circle cx={sketchOffset(1,1.5)} cy={sketchOffset(2,1.5)} r={12}
        fill={t.center} stroke={t.ink} strokeWidth={0.9}/>
      <CrossHatch r={10.5} ink={t.ink} n={8}/>
      {/* Floret dots — two rings */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (360/16)*i, rad = a * Math.PI / 180;
        return <circle key={i} cx={Math.sin(rad)*7.5} cy={-Math.cos(rad)*7.5}
          r={1.0} fill={t.centerDark} opacity={0.45}/>;
      })}
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (360/9)*i, rad = a * Math.PI / 180;
        return <circle key={i} cx={Math.sin(rad)*3.8} cy={-Math.cos(rad)*3.8}
          r={0.85} fill={t.centerDark} opacity={0.38}/>;
      })}
      <circle cx={0} cy={0} r={2} fill={t.petalLight} opacity={0.4}/>
    </g>
  );
};

// ── Sunflower (botanical sketch) ────────────────────────
const SunflowerFlower = ({ t, id }: { t: FlowerTheme; id: string }) => {
  const pg = uid("sp", id);
  return (
    <g transform="translate(60 60)">
      <defs>
        <linearGradient id={pg} x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor={t.petalLight} stopOpacity={0.9}/>
          <stop offset="100%" stopColor={t.petalDark}  stopOpacity={0.85}/>
        </linearGradient>
      </defs>
      {/* 20 ray petals — drooping slightly, organic */}
      {Array.from({ length: 20 }).map((_, i) => {
        const len = 30 + sketchOffset(i * 2, 4);
        const w   =  5 + sketchOffset(i * 3, 1.5);
        const droop = sketchOffset(i, 3);
        return (
          <g key={i} transform={`rotate(${(360/20)*i + sketchOffset(i, 2)})`}>
            <path d={`M-${w} -2 C-${w+2} -${len*0.35} ${droop} -${len+1} ${sketchOffset(i,1.2)} -${len} C${w*0.8} -${len+1} ${w+2} -${len*0.35} ${w} -2`}
              fill={`url(#${pg})`} opacity={0.86}/>
            <path d={`M-${w} -2 C-${w+2.5} -${len*0.33} ${droop-1} -${len+2} ${sketchOffset(i,1)} -${len-1} C${w*0.8+1} -${len+2} ${w+2.5} -${len*0.33} ${w} -2`}
              fill="none" stroke={t.ink} strokeWidth={0.7} strokeLinecap="round"/>
            <line x1={sketchOffset(i,0.8)} y1={-3} x2={sketchOffset(i,1.5)+droop*0.3} y2={-len+5}
              stroke={t.ink} strokeWidth={0.35} opacity={0.28}/>
          </g>
        );
      })}
      {/* Inner petal ring — offset */}
      {Array.from({ length: 13 }).map((_, i) => (
        <g key={i} transform={`rotate(${(360/13)*i + 9 + sketchOffset(i,5)})`}>
          <path d={`M-4 -2 C-5 -12 -3.5 -22 0 -20 C3.5 -22 5 -12 4 -2Z`}
            fill={t.wash} stroke={t.ink} strokeWidth={0.55} opacity={0.65}/>
        </g>
      ))}
      {/* Large dark seed disc */}
      <circle cx={0} cy={0} r={20} fill={t.center} stroke={t.ink} strokeWidth={1.1}/>
      {/* Fibonacci seed pattern */}
      {Array.from({ length: 34 }).map((_, i) => {
        const a = i * 137.5, rad = a * Math.PI / 180;
        const r = Math.sqrt(i) * 3.2;
        if (r > 18) return null;
        return <ellipse key={i} cx={Math.sin(rad)*r} cy={-Math.cos(rad)*r}
          rx={1.6} ry={1.1} fill={t.centerDark} opacity={0.55}
          transform={`rotate(${a} ${Math.sin(rad)*r} ${-Math.cos(rad)*r})`}/>;
      })}
      <CrossHatch r={18} ink="hsl(30 30% 60%)" n={10}/>
      <circle cx={-4} cy={-4} r={5} fill="hsl(30 40% 40%)" opacity={0.18}/>
    </g>
  );
};

// ── Lily (botanical sketch) ─────────────────────────────
const LilyFlower = ({ t, id }: { t: FlowerTheme; id: string }) => {
  return (
    <g transform="translate(60 60)">
      {/* 6 recurved petals — asymmetric */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = 60*i + sketchOffset(i, 6);
        const len = 34 + sketchOffset(i, 3);
        const w   = 12 + sketchOffset(i, 2);
        return (
          <g key={i} transform={`rotate(${a})`}>
            <path d={`M0 0 C-${w} -${len*0.42} -${w*0.9} -${len} 0 -${len+1} C${w*0.9} -${len} ${w} -${len*0.42} 0 0Z`}
              fill={t.wash} opacity={0.82}/>
            <path d={`M${sketchOffset(i,1)} 0 C-${w+1} -${len*0.40} -${w*0.8} -${len+2} ${sketchOffset(i,1.5)} -${len} C${w*0.8} -${len+2} ${w+1} -${len*0.40} ${sketchOffset(i,1)} 0`}
              fill="none" stroke={t.ink} strokeWidth={0.75} strokeLinecap="round"/>
            {/* Midvein */}
            <line x1={sketchOffset(i,0.8)} y1={-3} x2={sketchOffset(i,1.5)} y2={-len+5}
              stroke={t.ink} strokeWidth={0.45} opacity={0.38}/>
            {/* Freckle spots — 4 per petal */}
            {[12,18,24,28].map((d, j) => (
              <circle key={j} cx={sketchOffset(i*4+j, 3.5)} cy={-d}
                r={1.2} fill={t.center} opacity={0.48}/>
            ))}
          </g>
        );
      })}
      {/* 6 long curving stamens */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (60*i) * Math.PI/180;
        const ex = Math.sin(a)*20 + sketchOffset(i, 2);
        const ey = -Math.cos(a)*20 + sketchOffset(i+1, 2);
        return (
          <g key={i}>
            <path d={`M${sketchOffset(i,1)} ${sketchOffset(i+1,1)} Q${ex*0.5+sketchOffset(i,2)} ${ey*0.5} ${ex} ${ey}`}
              fill="none" stroke={t.ink} strokeWidth={0.8} strokeLinecap="round"/>
            <ellipse cx={ex} cy={ey} rx={2.8} ry={1.5}
              fill={t.center} stroke={t.ink} strokeWidth={0.45}
              transform={`rotate(${60*i} ${ex} ${ey})`}/>
          </g>
        );
      })}
      <circle cx={0} cy={0} r={3.5} fill={t.centerDark} stroke={t.ink} strokeWidth={0.6}/>
    </g>
  );
};

// ── Tulip (botanical sketch) ────────────────────────────
const TulipFlower = ({ t, id }: { t: FlowerTheme; id: string }) => {
  const pg = uid("tp", id);
  return (
    <g transform="translate(60 66)">
      <defs>
        <linearGradient id={pg} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%"   stopColor={t.petalLight} stopOpacity={0.9}/>
          <stop offset="100%" stopColor={t.petalDark}  stopOpacity={0.85}/>
        </linearGradient>
      </defs>
      {/* 3 outer petals */}
      {[0, 118, 242].map((a, i) => (
        <g key={i} transform={`rotate(${a + sketchOffset(i, 6)})`}>
          <path d={`M0 -6 C-${14+sketchOffset(i,2)} -${20+sketchOffset(i,2)} -${16+sketchOffset(i,1.5)} -${34+sketchOffset(i,2)} -${9+sketchOffset(i,1)} -${42+sketchOffset(i,1.5)} C-${3} -${48+sketchOffset(i,1)} ${3} -${48+sketchOffset(i,1)} ${9+sketchOffset(i,1)} -${42+sketchOffset(i,1.5)} C${16+sketchOffset(i,1.5)} -${34+sketchOffset(i,2)} ${14+sketchOffset(i,2)} -${20+sketchOffset(i,2)} 0 -6Z`}
            fill={`url(#${pg})`} opacity={0.87}/>
          <path d={`M${sketchOffset(i,1)} -6 C-${13+sketchOffset(i,2)} -${19} -${15+sketchOffset(i,1.5)} -${33} -${8+sketchOffset(i,1)} -${41} C-2 -${47} 2 -${47} ${8+sketchOffset(i,1)} -${41} C${15+sketchOffset(i,1.5)} -${33} ${13+sketchOffset(i,2)} -${19} ${sketchOffset(i,1)} -6`}
            fill="none" stroke={t.ink} strokeWidth={0.8} strokeLinecap="round"/>
          {/* Highlight stripe */}
          <line x1={sketchOffset(i,0.6)} y1={-10} x2={sketchOffset(i,1)} y2={-38}
            stroke={t.petalLight} strokeWidth={1.2} opacity={0.3} strokeLinecap="round"/>
          <line x1={sketchOffset(i,0.4)} y1={-10} x2={sketchOffset(i,0.8)} y2={-38}
            stroke={t.ink} strokeWidth={0.35} opacity={0.22}/>
        </g>
      ))}
      {/* 3 inner petals — narrower */}
      {[59, 178, 300].map((a, i) => (
        <g key={i} transform={`rotate(${a + sketchOffset(i+3, 5)})`}>
          <path d={`M0 -5 C-${10+sketchOffset(i,1.5)} -${17+sketchOffset(i,2)} -${11+sketchOffset(i,1)} -${30+sketchOffset(i,1.5)} -${6+sketchOffset(i,1)} -${37+sketchOffset(i,1)} C-1 -${42+sketchOffset(i,1)} 1 -${42+sketchOffset(i,1)} ${6+sketchOffset(i,1)} -${37+sketchOffset(i,1)} C${11+sketchOffset(i,1)} -${30+sketchOffset(i,1.5)} ${10+sketchOffset(i,1.5)} -${17+sketchOffset(i,2)} 0 -5Z`}
            fill={t.wash} stroke={t.ink} strokeWidth={0.72} opacity={0.92}/>
        </g>
      ))}
      <ellipse cx={0} cy={-4} rx={5} ry={3.5} fill={t.centerDark} opacity={0.30}/>
    </g>
  );
};

// ── Lavender (botanical sketch) ─────────────────────────
const LavenderFlower = ({ t, id }: { t: FlowerTheme; id: string }) => {
  return (
    <g transform="translate(60 72)">
      {/* Main stem — slightly curved */}
      <path d={`M0 0 C${sketchOffset(1,2)} -20 ${sketchOffset(2,2)} -40 ${sketchOffset(3,1.5)} -60`}
        stroke={t.ink} strokeWidth={1.8} fill="none" strokeLinecap="round"/>
      {/* Two sub-stems */}
      <path d={`M${sketchOffset(3,1)} -38 C${-6+sketchOffset(4,1)} -46 ${-9+sketchOffset(5,1)} -54 ${-8+sketchOffset(6,1)} -58`}
        stroke={t.ink} strokeWidth={1.1} fill="none" strokeLinecap="round"/>
      <path d={`M${sketchOffset(3,1)} -38 C${6+sketchOffset(4,1)} -46 ${9+sketchOffset(5,1)} -54 ${8+sketchOffset(6,1)} -58`}
        stroke={t.ink} strokeWidth={1.1} fill="none" strokeLinecap="round"/>

      {/* Floret nodes — alternating, getting smaller toward tip */}
      {[54, 46, 38, 30, 22, 14].map((y, i) => (
        <g key={i} transform={`translate(${sketchOffset(i,1.5)} ${-y})`}>
          {/* Left floret */}
          <path d={`M0 0 C-${7+sketchOffset(i,1)} -${2+sketchOffset(i,0.8)} -${9+sketchOffset(i,1)} -${8+sketchOffset(i,1)} -${6+sketchOffset(i,0.8)} -${10+sketchOffset(i,0.8)} C-${2} -${12+sketchOffset(i,0.8)} 0 -${9+sketchOffset(i,0.6)} 0 -${5+sketchOffset(i,0.5)}Z`}
            fill={t.wash} stroke={t.ink} strokeWidth={0.5} opacity={0.86}/>
          {/* Right floret */}
          <path d={`M0 0 C${7+sketchOffset(i+3,1)} -${2+sketchOffset(i+3,0.8)} ${9+sketchOffset(i+3,1)} -${8+sketchOffset(i+3,1)} ${6+sketchOffset(i+3,0.8)} -${10+sketchOffset(i+3,0.8)} C${2} -${12+sketchOffset(i+3,0.8)} 0 -${9+sketchOffset(i+3,0.6)} 0 -${5+sketchOffset(i+3,0.5)}Z`}
            fill={t.wash} stroke={t.ink} strokeWidth={0.5} opacity={0.86}/>
          {/* Central bud */}
          <ellipse cx={sketchOffset(i*2,0.8)} cy={-(8 + i*0.4)} rx={2.2 - i*0.18} ry={3.6 - i*0.28}
            fill={t.petalDark} stroke={t.ink} strokeWidth={0.42} opacity={0.9}/>
        </g>
      ))}
      {/* Tip bud */}
      <ellipse cx={sketchOffset(7,1)} cy={-63} rx={1.8} ry={3.2}
        fill={t.centerDark} stroke={t.ink} strokeWidth={0.42} opacity={0.92}/>

      {/* Sub-stem florets */}
      {[[-8,-54],[-7,-50],[8,-54],[7,-50]].map(([x,y],i)=>(
        <ellipse key={i} cx={x+sketchOffset(i+10,1)} cy={y} rx={1.8} ry={2.8}
          fill={t.wash} stroke={t.ink} strokeWidth={0.4} opacity={0.82}/>
      ))}
    </g>
  );
};

// ── Shared render helper ────────────────────────────────
const renderFlowerG = (t: FlowerTheme, id: string) => {
  switch (t.type) {
    case "rose":      return <RoseFlower t={t} id={id}/>;
    case "dahlia":    return <DahliaFlower t={t} id={id}/>;
    case "anemone":   return <AnemoneFlower t={t} id={id}/>;
    case "daisy":     return <DaisyFlower t={t} id={id}/>;
    case "sunflower": return <SunflowerFlower t={t} id={id}/>;
    case "lily":      return <LilyFlower t={t} id={id}/>;
    case "tulip":     return <TulipFlower t={t} id={id}/>;
    case "lavender":  return <LavenderFlower t={t} id={id}/>;
    default:          return <RoseFlower t={t} id={id}/>;
  }
};

/**
 * InlineFlower — places flower <g> inside a parent SVG.
 * Flower artwork is centred at (60,60) in 120×120 local space.
 * Use translate(cx,cy) scale(s) to position in parent coordinates.
 */
export const InlineFlower = ({
  theme, cx, cy, scale = 1, rotate = 0, idSuffix = "0",
}: {
  theme: string; cx: number; cy: number;
  scale?: number; rotate?: number; idSuffix?: string;
}) => {
  const t = getTheme(theme);
  const id = `${theme}-${idSuffix}`;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale}) translate(-60 -60)`}>
      {renderFlowerG(t, id)}
    </g>
  );
};

// ── Standalone FlowerEmoji component ───────────────────
const FlowerEmoji = ({
  theme, size = 72, className = "", idSuffix = "0",
}: {
  theme: string; size?: number; className?: string; idSuffix?: string;
}) => {
  const t = getTheme(theme);
  const id = `${theme}-${idSuffix}`;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120"
      role="img" aria-label={t.name}
      className={`animate-bloom inline-block ${className}`}>
      {renderFlowerG(t, id)}
    </svg>
  );
};

export default FlowerEmoji;