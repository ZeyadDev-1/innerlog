export default function InnerLogLogo({ className = "", size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`innerlog-logo ${className}`.trim()}
    >
      <path
        d="M32 55C31.4 54.4 30.6 53.8 29.7 53.1C17 43.2 8.5 35.6 8.5 24.7C8.5 16.3 14.9 9.9 23.2 9.9C28 9.9 32.4 12.1 35.3 15.7C38.2 12.1 42.6 9.9 47.4 9.9C55.8 9.9 62.1 16.3 62.1 24.7C62.1 35.6 53.6 43.2 40.9 53.1C40 53.8 39.2 54.4 38.6 55L35.3 58L32 55Z"
        className="innerlog-logo-heart"
      />
      <path
        d="M24 13.2C22.4 15.2 21.3 17.9 21.3 20.8C21.3 27.8 27.1 33.2 35.3 40.3C43.5 33.2 49.3 27.8 49.3 20.8C49.3 17.9 48.2 15.2 46.5 13.2C44.7 11 42.1 9.9 39.4 9.9C37.8 9.9 36.3 10.3 35 11.1C33.6 10.3 32.2 9.9 30.6 9.9C27.9 9.9 25.2 11 24 13.2Z"
        className="innerlog-logo-heart-shade"
      />
      <path
        d="M14.5 33.4H23.4L28.2 27.3L32.8 38.6L37.9 22.6L42.4 33.4H50.4"
        className="innerlog-logo-line"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 55C31.4 54.4 30.6 53.8 29.7 53.1C17 43.2 8.5 35.6 8.5 24.7C8.5 16.3 14.9 9.9 23.2 9.9C28 9.9 32.4 12.1 35.3 15.7C38.2 12.1 42.6 9.9 47.4 9.9C55.8 9.9 62.1 16.3 62.1 24.7C62.1 35.6 53.6 43.2 40.9 53.1C40 53.8 39.2 54.4 38.6 55L35.3 58L32 55Z"
        className="innerlog-logo-outline"
      />
    </svg>
  );
}
