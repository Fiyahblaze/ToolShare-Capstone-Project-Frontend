interface ToolIllustrationProps {
  category?: string;
}

export default function ToolIllustration({
  category = "Power Tools",
}: ToolIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 260"
      className="tool-illustration"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="260" fill="#eaf1e8" />
      <circle cx="310" cy="65" r="65" fill="#d8e7d4" />
      <circle cx="70" cy="220" r="90" fill="#dfeadb" />
      <ellipse cx="200" cy="220" rx="105" ry="12" fill="#c6d8c2" />

      {category === "Hand Tools" ? (
        <g transform="rotate(-25 200 130)">
          <rect
            x="183"
            y="88"
            width="30"
            height="130"
            rx="10"
            fill="#b78048"
          />
          <rect
            x="137"
            y="55"
            width="110"
            height="48"
            rx="10"
            fill="#52665c"
          />
          <path
            d="M247 55 L282 75 L247 103 Z"
            fill="#52665c"
          />
          <rect x="147" y="62" width="22" height="34" rx="5" fill="#82968a" />
        </g>
      ) : category === "Garden Tools" ? (
        <g transform="rotate(20 200 130)">
          <rect x="191" y="55" width="18" height="115" rx="8" fill="#b78048" />
          <rect
            x="174"
            y="30"
            width="52"
            height="40"
            rx="16"
            fill="none"
            stroke="#246443"
            strokeWidth="12"
          />
          <path
            d="M164 158 H236 V185 Q230 225 200 240 Q170 225 164 185 Z"
            fill="#52665c"
          />
          <path d="M200 168 V220" stroke="#82968a" strokeWidth="5" />
        </g>
      ) : category === "Ladders" ? (
        <g stroke="#52665c" strokeWidth="13" strokeLinecap="round">
          <path d="M145 220 L175 40 M255 220 L225 40" />
          <path d="M169 75 H231 M163 115 H237 M156 155 H244 M150 195 H250" />
        </g>
      ) : (
        <g transform="rotate(-10 200 130)">
          <rect x="110" y="65" width="145" height="75" rx="20" fill="#246443" />
          <rect x="245" y="80" width="40" height="45" rx="6" fill="#52665c" />
          <path d="M285 102 H325" stroke="#82968a" strokeWidth="12" />
          <path d="M166 130 H219 L208 203 H177 Z" fill="#194d32" />
          <rect x="162" y="193" width="65" height="27" rx="7" fill="#52665c" />
          <rect x="126" y="80" width="70" height="12" rx="6" fill="#80a982" />
          <path d="M220 143 H234 V166 H215" fill="none" stroke="#52665c" strokeWidth="9" />
        </g>
      )}
    </svg>
  );
}