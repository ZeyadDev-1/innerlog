export default function InnerLogLogo({ className = "", size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M32 55C31.5 54.5 30.8 54 30 53.4C17.2 43.5 9 35.9 9 25.3C9 17.2 15.2 11 23.3 11C27.9 11 32.2 13.1 35 16.5C37.8 13.1 42.1 11 46.7 11C54.8 11 61 17.2 61 25.3C61 35.9 52.8 43.5 40 53.4C39.2 54 38.5 54.5 38 55L35 57.5L32 55Z"
        className="innerlog-logo-heart"
      />
      <path
        d="M14 33H24L28 27L32 38L37 22L41 33H50"
        className="innerlog-logo-line"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
