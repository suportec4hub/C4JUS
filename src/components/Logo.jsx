export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", flexShrink:0 }}>
      <rect width="36" height="36" rx="8" fill="#1a3a6b"/>
      <text x="18" y="25" textAnchor="middle" fontSize="19" fill="#d4a017" fontFamily="serif">⚖</text>
    </svg>
  );
}
