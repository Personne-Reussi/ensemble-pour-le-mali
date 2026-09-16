export default function Logo({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="21" fill="#27AE60" />
      <path d="M21 10c-3 4-3 7 0 10 3-3 3-6 0-10z" fill="#F2C94C" />
      <path d="M12 24c4-2 7-1 9 2-3 2-6 2-9-2z" fill="#fff" />
      <path d="M30 24c-4-2-7-1-9 2 3 2 6 2 9-2z" fill="#fff" />
    </svg>
  );
}
