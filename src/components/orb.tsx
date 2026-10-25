/** A lightweight, decorative glass sculpture. No canvas or rendering runtime. */
export function Orb() {
  return (
    <div className="hero-orb" aria-hidden="true">
      <div className="orb-art">
        <div className="orb-aura" />
        <svg viewBox="0 0 400 400" fill="none">
          <defs>
            <radialGradient id="orb-fill" cx=".32" cy=".25" r=".9">
              <stop stopColor="#a6e5d8" stopOpacity=".22" />
              <stop offset=".45" stopColor="#304957" stopOpacity=".2" />
              <stop offset="1" stopColor="#10161d" stopOpacity=".8" />
            </radialGradient>
            <linearGradient
              id="orb-edge"
              x1="100"
              y1="60"
              x2="300"
              y2="330"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#caeee6" stopOpacity=".7" />
              <stop offset=".45" stopColor="#83a1bd" stopOpacity=".12" />
              <stop offset="1" stopColor="#829bb9" stopOpacity=".5" />
            </linearGradient>
            <linearGradient
              id="core-fill"
              x1="160"
              y1="145"
              x2="260"
              y2="260"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#bddfd5" stopOpacity=".19" />
              <stop offset="1" stopColor="#5b7f9f" stopOpacity=".03" />
            </linearGradient>
          </defs>
          <circle
            cx="200"
            cy="200"
            r="142"
            stroke="#607785"
            strokeOpacity=".12"
            strokeDasharray="2 8"
          />
          <g className="orb-rings">
            <ellipse
              cx="200"
              cy="200"
              rx="172"
              ry="68"
              transform="rotate(-35 200 200)"
              stroke="url(#orb-edge)"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="153"
              ry="73"
              transform="rotate(35 200 200)"
              stroke="url(#orb-edge)"
            />
            <circle
              cx="200"
              cy="200"
              r="109"
              fill="url(#orb-fill)"
              stroke="url(#orb-edge)"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="109"
              ry="38"
              transform="rotate(-35 200 200)"
              stroke="#a4c8cc"
              strokeOpacity=".13"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="44"
              ry="109"
              transform="rotate(-35 200 200)"
              stroke="#a4c8cc"
              strokeOpacity=".13"
            />
            <circle cx="65" cy="278" r="4" fill="#a6d5ca" />
            <circle cx="328" cy="279" r="2.5" fill="#8ba7c1" />
          </g>
          <path
            d="m200 145 49 28v56l-49 28-49-28v-56l49-28Z"
            fill="url(#core-fill)"
            stroke="#badad5"
            strokeOpacity=".65"
          />
          <path
            d="m151 173 49 28 49-28m-49 28v56m-49-84 49-28 49 28"
            stroke="#a8d1c7"
            strokeOpacity=".45"
          />
          <path
            d="m169 181 17 10m28 0 17-10m-31 32v20"
            stroke="#c1e1d9"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="orb-caption">
        <span />
        AI · WEB · MOBILE
      </div>
    </div>
  );
}
