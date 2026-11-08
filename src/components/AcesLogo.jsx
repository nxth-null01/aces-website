export default function AcesLogo({ className = '', label }) {
  return (
    <span
      className={`aces-logo ${className}`.trim()}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
