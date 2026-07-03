interface SectionHeadingProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  children,
  label,
  description,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-6 sm:mb-8 flex flex-col min-w-0 max-w-full w-full ${centered ? "items-center" : "items-start"}`}
    >
      {label && (
        <p className="mb-3 sm:mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-[#C9A961] animate-fade-in-up">
          {label}
        </p>
      )}

      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A2E] leading-tight break-words [overflow-wrap:anywhere] animate-fade-in-up animation-delay-100 ${centered ? "text-center" : ""} ${className}`}
      >
        {children}
      </h2>

      {description && (
        <p
          className={`mt-3 sm:mt-4 max-w-2xl font-sans text-base sm:text-lg leading-relaxed text-gray-500 break-words [overflow-wrap:anywhere] animate-fade-in-up animation-delay-200 ${centered ? "text-center" : ""}`}
        >
          {description}
        </p>
      )}

      <div className="h-[3px] bg-gradient-to-r from-[#C9A961] to-[#D4AF7C] rounded-full mt-4 sm:mt-6 w-20 animate-grow-width animation-delay-300" />
    </div>
  );
}
