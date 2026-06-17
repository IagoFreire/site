interface BlurTextProps {
  text: string;
  className?: string;
  delayMs?: number;
}

export function BlurText({ text, className = '', delayMs = 25 }: BlurTextProps) {
  return (
    <span className={className}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          className="blur-char"
          style={{ animationDelay: `${i * delayMs}ms` }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
}
