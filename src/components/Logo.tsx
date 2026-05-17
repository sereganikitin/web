type Props = {
  className?: string;
  /** Tailwind text-size class, e.g. "text-lg" / "text-xl" */
  size?: string;
};

export default function Logo({ className = "", size = "text-lg" }: Props) {
  return (
    <span
      className={`relative inline-block font-serif italic leading-none text-accent ${size} ${className}`}
    >
      sn.
      <svg
        aria-hidden="true"
        viewBox="0 0 40 6"
        preserveAspectRatio="none"
        className="absolute left-0 -bottom-1 h-[5px] w-full text-accent/70"
      >
        <path
          d="M0 3 Q5 0.5 10 3 T20 3 T30 3 T40 3"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
