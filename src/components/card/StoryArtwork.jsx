/* eslint-disable react/prop-types */
import { useId } from "react";
import {
  FaCarSide,
  FaChartLine,
  FaEarthAsia,
  FaFutbol,
  FaHeartPulse,
  FaLandmark,
  FaLeaf,
  FaMicrochip,
  FaPaw,
  FaTriangleExclamation,
} from "react-icons/fa6";
import "./story-artwork.css";

const palettes = [
  ["#e9d2bc", "#cf765d", "#6d5149"],
  ["#d1d9d4", "#738b7d", "#354c45"],
  ["#e5d5a8", "#b88948", "#634c31"],
  ["#d9cee4", "#907cae", "#514462"],
  ["#c9d9e3", "#63879b", "#344f60"],
];

function getIcon(article) {
  const category = (article.category || "").toLowerCase();
  const topic = `${category} ${article.title || ""}`.toLowerCase();
  if (category === "cars") return FaCarSide;
  if (category === "animals") return FaPaw;
  if (category === "delhi") return FaLandmark;
  if (category === "accidents") return FaTriangleExclamation;
  if (/animal|wildlife|bird|dog|cat|cockroach/.test(topic)) return FaPaw;
  if (/car|auto|vehicle|tesla|motor/.test(topic)) return FaCarSide;
  if (/accident|crash|emergency|protest|police/.test(topic)) return FaTriangleExclamation;
  if (/delhi|india|government|politic|election|parliament/.test(topic)) return FaLandmark;
  if (/sport|football|cricket|match|tournament/.test(topic)) return FaFutbol;
  if (/health|hospital|medical|disease/.test(topic)) return FaHeartPulse;
  if (/climate|environment|forest|earth|weather/.test(topic)) return FaLeaf;
  if (/tech|ai\b|internet|satellite|chip|software/.test(topic)) return FaMicrochip;
  if (/market|business|stock|econom|company|trade/.test(topic)) return FaChartLine;
  return FaEarthAsia;
}

function getPalette(article) {
  const text = `${article.category || ""}${article.title || ""}`;
  const hash = [...text].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
  return palettes[hash % palettes.length];
}

function StoryArtwork({ article }) {
  const Icon = getIcon(article);
  const [paper, accent, ink] = getPalette(article);
  const id = useId().replaceAll(":", "");
  const label = article.category && article.category !== "Search" ? article.category : "The daily brief";
  return (
    <div className="story-artwork" role="img" aria-label={`Editorial illustration for: ${article.title}`}>
      <svg viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`artwork-paper-${id}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor={paper} /><stop offset="1" stopColor="#f6f1e8" /></linearGradient>
          <linearGradient id={`artwork-accent-${id}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor={accent} /><stop offset="1" stopColor={ink} /></linearGradient>
          <pattern id={`artwork-grid-${id}`} width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke={ink} strokeOpacity=".07" strokeWidth="1" /></pattern>
        </defs>
        <rect width="960" height="600" fill={`url(#artwork-paper-${id})`} />
        <rect width="960" height="600" fill={`url(#artwork-grid-${id})`} />
        <circle cx="748" cy="110" r="205" fill={accent} opacity=".22" />
        <circle cx="154" cy="518" r="226" fill={accent} opacity=".16" />
        <path d="M0 467c146-72 236 31 386-8 158-41 238-155 574-87v228H0Z" fill={ink} opacity=".10" />
        <path d="M0 518c194-64 320 22 474-13 178-40 321-75 486-19v114H0Z" fill={ink} opacity=".11" />
        <rect x="268" y="86" width="424" height="424" rx="212" fill={`url(#artwork-accent-${id})`} />
        <circle cx="480" cy="298" r="154" fill="none" stroke="#fff" strokeOpacity=".42" strokeWidth="1.5" />
        <circle cx="480" cy="298" r="181" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="1" strokeDasharray="3 10" />
        <g fill="none" stroke="#fff" strokeOpacity=".24" strokeWidth="1"><path d="M64 115h144M64 130h82M752 434h144M812 449h84" /><path d="M118 82v80M842 381v80" /></g>
      </svg>
      <span className="artwork-icon" style={{ color: "#fff" }}><Icon aria-hidden="true" /></span>
      <span className="artwork-label"><span>NEW-Z</span><span>{label} · Illustration</span></span>
    </div>
  );
}

export default StoryArtwork;
