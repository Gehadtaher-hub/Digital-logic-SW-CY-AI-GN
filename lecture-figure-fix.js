/* Lecture 1 figure correction patch: clocked timing + clear serial/parallel animation */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .serial-bit { opacity:.15; animation:serialStep 3.2s ease infinite; }
    .serial-runner { stroke-dasharray:14 620; animation:serialTravel 3.2s linear infinite; }
    .parallel-bit { opacity:.2; animation:parallelTogether 3.2s ease infinite; }
    .clock-wave { stroke-dasharray:1500; stroke-dashoffset:1500; animation:clockDraw 2.2s linear forwards; }
    @keyframes clockDraw { to { stroke-dashoffset:0; } }
    @keyframes serialStep {
      0%,8% { opacity:.12; transform:translateY(-5px); }
      14%,34% { opacity:1; transform:translateY(0); }
      43%,100% { opacity:.12; }
    }
    @keyframes serialTravel { from { stroke-dashoffset:0; } to { stroke-dashoffset:-620; } }
    @keyframes parallelTogether {
      0%,14% { opacity:.2; }
      24%,66% { opacity:1; }
      76%,100% { opacity:.2; }
    }
    @media (prefers-reduced-motion: reduce) {
      .serial-bit,.serial-runner,.parallel-bit,.clock-wave { animation:none!important; opacity:1!important; stroke-dashoffset:0!important; }
    }
  `;
  document.head.appendChild(style);

  const originalSvg = window.svg;
  if (typeof originalSvg !== 'function') return;

  window.svg = function(t) {
    const C = `viewBox="0 0 800 320" role="img" aria-label="${t.t} diagram"`;

    if (t.d === 'timing') {
      const guides = [70,110,150,190,230,270,310,350,390,430,470,510,550,590,630,670,710,750]
        .map((x,i)=>`<line x1="${x}" y1="18" x2="${x}" y2="270" stroke="${i%2 ? '#f0b23b' : '#d7dfe2'}" stroke-width="${i%2 ? 2 : 1}" stroke-dasharray="4 5"/>`).join('');
      return `<svg ${C}>
        <g font-size="16" font-weight="700"><text x="18" y="52">CLK</text><text x="25" y="116">A</text><text x="25" y="180">B</text><text x="18" y="244">A·B</text></g>
        ${guides}
        <path class="clock-wave" d="M70 68 H110 V28 H150 V68 H190 V28 H230 V68 H270 V28 H310 V68 H350 V28 H390 V68 H430 V28 H470 V68 H510 V28 H550 V68 H590 V28 H630 V68 H670 V28 H710 V68 H750" fill="none" stroke="#123b56" stroke-width="4"/>
        <path d="M70 132 H150 V92 H310 V132 H470 V92 H630 V132 H750" fill="none" stroke="#197d91" stroke-width="5"/>
        <path d="M70 196 H230 V156 H390 V196 H550 V156 H710 V196 H750" fill="none" stroke="#6555ad" stroke-width="5"/>
        <path d="M70 260 H230 V220 H310 V260 H550 V220 H630 V260 H750" fill="none" stroke="#ed625e" stroke-width="5"/>
        <text x="400" y="300" text-anchor="middle" font-size="16">Clock edges are the time reference. A·B is HIGH only where A and B overlap at HIGH.</text>
      </svg>`;
    }

    if (t.d === 'transfer') {
      const bits=['1','0','1','1','0','0','1','0'];
      const serial=bits.map((b,i)=>`<g class="serial-bit" style="animation-delay:${i*.38}s"><rect x="${135+i*72}" y="54" width="50" height="54" rx="7" fill="${b==='1'?'#ded8ff':'#eef9f8'}" stroke="#6555ad" stroke-width="2"/><text x="${160+i*72}" y="88" text-anchor="middle" font-size="20">${b}</text><text x="${160+i*72}" y="125" text-anchor="middle" font-size="12">t${i+1}</text></g>`).join('');
      const parallel=bits.map((b,i)=>`<g class="parallel-bit"><text x="72" y="${177+i*16}" font-size="13">b${7-i}=${b}</text><line x1="120" y1="${173+i*16}" x2="665" y2="${173+i*16}" stroke="${b==='1'?'#6555ad':'#197d91'}" stroke-width="3"/><circle cx="690" cy="${173+i*16}" r="7" fill="${b==='1'?'#6555ad':'#197d91'}"/></g>`).join('');
      return `<svg ${C}>
        <text x="25" y="34" font-size="20" font-weight="700">Serial: one wire, one bit in each time slot</text>
        <line x1="115" y1="81" x2="735" y2="81" stroke="#b9cacc" stroke-width="5"/>
        ${serial}
        <path class="serial-runner" d="M115 81 H735" fill="none" stroke="#ed625e" stroke-width="8" stroke-linecap="round"/>
        <text x="25" y="151" font-size="20" font-weight="700">Parallel: eight wires, all bits in the same time slot</text>
        ${parallel}
        <line x1="715" y1="163" x2="715" y2="292" stroke="#ed625e" stroke-width="4"/>
        <text x="741" y="227" text-anchor="middle" font-size="13" transform="rotate(90 741 227)">same transfer instant</text>
        <text x="400" y="313" text-anchor="middle" font-size="15">Serial needs 8 time slots; parallel transfers the 8-bit word simultaneously.</text>
      </svg>`;
    }

    return originalSvg(t);
  };

  /* Re-render the currently selected topic so the correction appears immediately. */
  if (typeof window.render === 'function') window.render();
})();
