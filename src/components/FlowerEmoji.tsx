import { useMemo } from "react";
import FlowerEmoji, { getTheme } from "@/components/FlowerEmoji";

interface BouquetArrangementProps {
  flowers: string[];
  size?: "sm" | "md" | "lg";
  layoutSeed?: number;
  greeneryStyle?: "classic" | "wild" | "eucalyptus";
}

const sizeMap = {
  sm: { container: "w-52 h-64",  flower: 52 },
  md: { container: "w-72 h-80",  flower: 62 },
  lg: { container: "w-80 h-96",  flower: 72 },
};

const seeded = (seed: number, n: number) => {
  const x = Math.sin(seed * 97.11 + n * 41.23) * 10000;
  return x - Math.floor(x);
};

// Dome-shaped slot positions — realistic bouquet arrangement
// y goes from top (back flowers) downward (front flowers)
// x is centered around 50%
const ALL_SLOTS = [
  // Crown — tallest, back center
  { x: 50, y: 12, z: 10, tier: 0 },
  // Second row
  { x: 36, y: 18, z: 12, tier: 1 },
  { x: 64, y: 18, z: 12, tier: 1 },
  // Third row — widening dome
  { x: 50, y: 24, z: 16, tier: 2 },
  { x: 27, y: 26, z: 14, tier: 2 },
  { x: 73, y: 26, z: 14, tier: 2 },
  // Fourth row — front
  { x: 38, y: 33, z: 22, tier: 3 },
  { x: 62, y: 33, z: 22, tier: 3 },
  // Fifth row — foreground
  { x: 50, y: 40, z: 28, tier: 4 },
  { x: 24, y: 36, z: 18, tier: 4 },
  { x: 76, y: 36, z: 18, tier: 4 },
];

const BouquetArrangement = ({
  flowers,
  size = "md",
  layoutSeed = 7,
  greeneryStyle = "classic",
}: BouquetArrangementProps) => {
  const positions = useMemo(() => {
    if (!flowers.length) return [] as Array<{
      x: number; y: number; rotate: number; scale: number; z: number; flower: string;
    }>;

    // Sort: large flowers to center/crown, small to edges
    const weighted = [...flowers].sort((a, b) => {
      const w = { large: 3, medium: 2, small: 1 } as const;
      return w[getTheme(b).sizeCategory] - w[getTheme(a).sizeCategory];
    });

    return weighted.map((flower, i) => {
      const slot = ALL_SLOTS[i % ALL_SLOTS.length];
      const jitterX = (seeded(layoutSeed, i) - 0.5) * 5;
      const jitterY = (seeded(layoutSeed + 13, i) - 0.5) * 3;
      // Gentle tilt — back flowers more upright, front flowers tilt outward
      const tiltBase = (slot.x - 50) * 0.3;
      const rotate = tiltBase + (seeded(layoutSeed + 77, i) - 0.5) * 18;
      // Back flowers slightly smaller (perspective), front larger
      const scaleBase = slot.tier === 0 ? 1.0 : slot.tier === 1 ? 1.0 : slot.tier === 2 ? 1.05 : slot.tier === 3 ? 1.08 : 1.05;
      const scaleJitter = (seeded(layoutSeed + 99, i) - 0.5) * 0.08;

      return {
        x: slot.x + jitterX,
        y: slot.y + jitterY,
        rotate,
        scale: scaleBase + scaleJitter,
        z: slot.z,
        flower,
      };
    });
  }, [flowers, layoutSeed]);

  if (!flowers.length) return null;

  // Compute how many stems to draw (one per flower, fanning from wrap point)
  const stemCount = Math.min(flowers.length, 8);

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeMap[size].container} relative`}>

        {/* ── Greenery layer (behind everything) ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <svg viewBox="0 0 280 320" className="w-full h-full" aria-hidden>
            <defs>
              {/* Fern gradient */}
              <linearGradient id="fern-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(138 42% 52%)" />
                <stop offset="100%" stopColor="hsl(130 36% 32%)" />
              </linearGradient>
              {/* Eucalyptus gradient */}
              <linearGradient id="euc-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(158 38% 58%)" />
                <stop offset="100%" stopColor="hsl(152 30% 36%)" />
              </linearGradient>
            </defs>

            {/* ── Stems fanning up from wrap point ── */}
            <g stroke="hsl(132 30% 30%)" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M140 290 C132 240 110 180 72 100" opacity="0.9"/>
              <path d="M140 290 C137 238 130 175 118 95" opacity="0.9"/>
              <path d="M140 290 C140 235 140 170 140 85" opacity="0.9"/>
              <path d="M140 290 C143 238 150 175 162 95" opacity="0.9"/>
              <path d="M140 290 C148 240 170 180 208 100" opacity="0.9"/>
              {stemCount >= 6 && <path d="M140 290 C126 238 96 178 58 115" opacity="0.8"/>}
              {stemCount >= 7 && <path d="M140 290 C154 238 184 178 222 115" opacity="0.8"/>}
              {stemCount >= 8 && <path d="M140 290 C140 237 138 180 130 108" opacity="0.7"/>}
            </g>

            {/* ── Classic: elegant ruscus + fern fronds ── */}
            {greeneryStyle === "classic" && (
              <g opacity="0.88">
                {/* Left large frond */}
                <g stroke="hsl(136 34% 36%)" strokeWidth="1" fill="none">
                  <path d="M100 175 C80 155 60 130 48 100" strokeWidth="1.4"/>
                  {/* Leaflets along frond */}
                  {[[96,168,-30],[88,155,-25],[78,142,-20],[68,128,-18],[58,114,-15]].map(([x,y,r],i)=>(
                    <ellipse key={i} cx={x} cy={y} rx={8} ry={4}
                      fill="hsl(136 38% 40%)" stroke="none" opacity={0.7}
                      transform={`rotate(${r} ${x} ${y})`} />
                  ))}
                  {[[104,168,30],[98,157,28],[90,145,24],[80,130,20],[70,116,16]].map(([x,y,r],i)=>(
                    <ellipse key={i} cx={x} cy={y} rx={8} ry={4}
                      fill="hsl(138 40% 44%)" stroke="none" opacity={0.65}
                      transform={`rotate(${r} ${x} ${y})`} />
                  ))}
                </g>
                {/* Right large frond */}
                <g stroke="hsl(136 34% 36%)" strokeWidth="1" fill="none">
                  <path d="M180 175 C200 155 220 130 232 100" strokeWidth="1.4"/>
                  {[[184,168,30],[192,155,25],[202,142,20],[212,128,18],[222,114,15]].map(([x,y,r],i)=>(
                    <ellipse key={i} cx={x} cy={y} rx={8} ry={4}
                      fill="hsl(136 38% 40%)" stroke="none" opacity={0.7}
                      transform={`rotate(${r} ${x} ${y})`} />
                  ))}
                  {[[176,168,-30],[182,157,-28],[190,145,-24],[200,130,-20],[210,116,-16]].map(([x,y,r],i)=>(
                    <ellipse key={i} cx={x} cy={y} rx={8} ry={4}
                      fill="hsl(138 40% 44%)" stroke="none" opacity={0.65}
                      transform={`rotate(${r} ${x} ${y})`} />
                  ))}
                </g>
                {/* Center upright frond */}
                <g>
                  <path d="M140 200 C140 170 140 140 140 100" stroke="hsl(136 34% 36%)" strokeWidth="1.4" fill="none"/>
                  {[[132,185,-8],[148,185,8],[130,165,-12],[150,165,12],[132,148,-10],[148,148,10]].map(([x,y,r],i)=>(
                    <ellipse key={i} cx={x} cy={y} rx={7} ry={3.5}
                      fill="hsl(137 40% 42%)" stroke="none" opacity={0.7}
                      transform={`rotate(${r} ${x} ${y})`} />
                  ))}
                </g>
                {/* Accent small leaves */}
                <ellipse cx="70" cy="148" rx="10" ry="5" fill="hsl(135 36% 44%)" opacity="0.6" transform="rotate(-35 70 148)"/>
                <ellipse cx="210" cy="148" rx="10" ry="5" fill="hsl(135 36% 44%)" opacity="0.6" transform="rotate(35 210 148)"/>
                <ellipse cx="100" cy="118" rx="9" ry="4" fill="hsl(138 38% 46%)" opacity="0.55" transform="rotate(-20 100 118)"/>
                <ellipse cx="180" cy="118" rx="9" ry="4" fill="hsl(138 38% 46%)" opacity="0.55" transform="rotate(20 180 118)"/>
              </g>
            )}

            {/* ── Wild: baby's breath + loose foliage ── */}
            {greeneryStyle === "wild" && (
              <g opacity="0.9">
                {/* Broad outer leaves */}
                <ellipse cx="52" cy="145" rx="18" ry="8" fill="hsl(128 38% 36%)" opacity="0.65" transform="rotate(-42 52 145)"/>
                <ellipse cx="228" cy="145" rx="18" ry="8" fill="hsl(128 38% 36%)" opacity="0.65" transform="rotate(42 228 145)"/>
                <ellipse cx="72" cy="112" rx="15" ry="7" fill="hsl(130 40% 40%)" opacity="0.6" transform="rotate(-28 72 112)"/>
                <ellipse cx="208" cy="112" rx="15" ry="7" fill="hsl(130 40% 40%)" opacity="0.6" transform="rotate(28 208 112)"/>
                <ellipse cx="96" cy="92" rx="12" ry="5" fill="hsl(132 38% 42%)" opacity="0.55" transform="rotate(-14 96 92)"/>
                <ellipse cx="184" cy="92" rx="12" ry="5" fill="hsl(132 38% 42%)" opacity="0.55" transform="rotate(14 184 92)"/>

                {/* Baby's breath — clusters of tiny white florets */}
                {[
                  [62,130],[80,108],[50,118],[100,100],[118,88],
                  [162,88],[180,100],[200,108],[218,118],[240,130],
                  [130,78],[150,78],[140,72],
                ].map(([cx, cy], i) => (
                  <g key={i} transform={`translate(${cx} ${cy})`}>
                    {[0,72,144,216,288].map((a, j) => {
                      const rad = (a * Math.PI) / 180;
                      return (
                        <circle key={j}
                          cx={Math.cos(rad) * 4} cy={Math.sin(rad) * 4}
                          r={2.2} fill="hsl(0 0% 97%)" opacity={0.85} />
                      );
                    })}
                    <circle cx={0} cy={0} r={2} fill="hsl(60 40% 90%)" opacity={0.9} />
                    {/* Tiny stem to floret cluster */}
                    <line x1={0} y1={0} x2={0} y2={8}
                      stroke="hsl(130 28% 42%)" strokeWidth={0.7} opacity={0.6} />
                  </g>
                ))}

                {/* Wispy secondary stems */}
                <path d="M140 290 C120 250 88 200 60 160" stroke="hsl(130 28% 38%)" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="2 3"/>
                <path d="M140 290 C160 250 192 200 220 160" stroke="hsl(130 28% 38%)" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="2 3"/>
              </g>
            )}

            {/* ── Eucalyptus: round coin leaves on arching branches ── */}
            {greeneryStyle === "eucalyptus" && (
              <g opacity="0.88">
                {/* Left arching branch */}
                <path d="M120 250 C100 210 72 172 48 130"
                  stroke="hsl(158 26% 38%)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {/* Right arching branch */}
                <path d="M160 250 C180 210 208 172 232 130"
                  stroke="hsl(158 26% 38%)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {/* Left sub-branch */}
                <path d="M92 192 C78 175 62 158 52 140"
                  stroke="hsl(158 26% 38%)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* Right sub-branch */}
                <path d="M188 192 C202 175 218 158 228 140"
                  stroke="hsl(158 26% 38%)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

                {/* Left branch coin leaves — pairs along stem */}
                {[[78,240],[68,218],[60,196],[52,174],[46,152],[42,132]].map(([x,y],i)=>(
                  <g key={i}>
                    <ellipse cx={x-8} cy={y} rx={9} ry={7}
                      fill="hsl(158 32% 46%)" stroke="hsl(156 26% 36%)" strokeWidth={0.7}
                      opacity={0.75} transform={`rotate(-${10+i*3} ${x-8} ${y})`}/>
                    <ellipse cx={x+8} cy={y-4} rx={9} ry={7}
                      fill="hsl(160 36% 50%)" stroke="hsl(156 26% 36%)" strokeWidth={0.7}
                      opacity={0.7} transform={`rotate(${8+i*3} ${x+8} ${y-4})`}/>
                    {/* Vein lines */}
                    <line x1={x-8} y1={y-4} x2={x-8} y2={y+4}
                      stroke="hsl(158 26% 36%)" strokeWidth={0.5} opacity={0.4}
                      transform={`rotate(-${10+i*3} ${x-8} ${y})`}/>
                  </g>
                ))}

                {/* Right branch coin leaves */}
                {[[202,240],[212,218],[220,196],[228,174],[234,152],[238,132]].map(([x,y],i)=>(
                  <g key={i}>
                    <ellipse cx={x+8} cy={y} rx={9} ry={7}
                      fill="hsl(158 32% 46%)" stroke="hsl(156 26% 36%)" strokeWidth={0.7}
                      opacity={0.75} transform={`rotate(${10+i*3} ${x+8} ${y})`}/>
                    <ellipse cx={x-8} cy={y-4} rx={9} ry={7}
                      fill="hsl(160 36% 50%)" stroke="hsl(156 26% 36%)" strokeWidth={0.7}
                      opacity={0.7} transform={`rotate(-${8+i*3} ${x-8} ${y-4})`}/>
                    <line x1={x+8} y1={y-4} x2={x+8} y2={y+4}
                      stroke="hsl(158 26% 36%)" strokeWidth={0.5} opacity={0.4}
                      transform={`rotate(${10+i*3} ${x+8} ${y})`}/>
                  </g>
                ))}

                {/* Top center sprigs */}
                <path d="M140 190 C136 165 132 140 128 112"
                  stroke="hsl(158 26% 38%)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                <path d="M140 190 C144 165 148 140 152 112"
                  stroke="hsl(158 26% 38%)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                {[[130,178],[126,160],[124,143],[122,126]].map(([x,y],i)=>(
                  <ellipse key={i} cx={x} cy={y} rx={8} ry={6}
                    fill="hsl(158 34% 48%)" stroke="hsl(156 26% 36%)" strokeWidth={0.6}
                    opacity={0.7} transform={`rotate(-12 ${x} ${y})`}/>
                ))}
                {[[150,178],[154,160],[156,143],[158,126]].map(([x,y],i)=>(
                  <ellipse key={i} cx={x} cy={y} rx={8} ry={6}
                    fill="hsl(160 36% 50%)" stroke="hsl(156 26% 36%)" strokeWidth={0.6}
                    opacity={0.7} transform={`rotate(12 ${x} ${y})`}/>
                ))}

                {/* Silver-blue highlight veins on some leaves */}
                {[[62,196],[220,196],[128,143]].map(([x,y],i)=>(
                  <ellipse key={i} cx={x} cy={y} rx={4} ry={3}
                    fill="hsl(175 40% 72%)" opacity={0.25} />
                ))}
              </g>
            )}
          </svg>
        </div>

        {/* ── Flowers ── */}
        {positions.map((pos, i) => (
          <div
            key={`${pos.flower}-${i}`}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
              zIndex: pos.z + 2,
            }}
          >
            <FlowerEmoji theme={pos.flower} size={sizeMap[size].flower} />
          </div>
        ))}

        {/* ── Wrap / bow at base ── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ zIndex: 40 }}>
          <svg width="90" height="80" viewBox="0 0 90 80" aria-hidden>
            <defs>
              <linearGradient id="wrap-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--muted))" />
                <stop offset="100%" stopColor="hsl(var(--muted) / 0.6)" />
              </linearGradient>
            </defs>
            {/* Main cone wrap */}
            <path d="M14 4 L45 74 L76 4 Z"
              fill="url(#wrap-g)" stroke="hsl(var(--border))" strokeWidth="1.2" />
            {/* Wrap fold crease */}
            <path d="M28 4 L45 74 L62 4"
              fill="none" stroke="hsl(var(--border))" strokeWidth="0.7" opacity="0.4"/>
            {/* Ribbon band */}
            <path d="M14 26 Q45 32 76 26"
              fill="none" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="2" strokeLinecap="round"/>
            {/* Bow loops */}
            <path d="M36 26 C28 18 20 14 24 20 C27 24 34 26 36 26Z"
              fill="hsl(var(--foreground) / 0.12)" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="0.8"/>
            <path d="M54 26 C62 18 70 14 66 20 C63 24 56 26 54 26Z"
              fill="hsl(var(--foreground) / 0.12)" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="0.8"/>
            <circle cx="45" cy="26" r="3" fill="hsl(var(--foreground) / 0.2)" />
          </svg>
        </div>

      </div>
    </div>
  );
};

export default BouquetArrangement;