interface RatingDotsProps {
  value: number;
  max?: number;
  variant?: 'default' | 'vibe';
}

const RatingDots = ({ value, max = 5, variant = 'default' }: RatingDotsProps) => {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < value
              ? variant === 'vibe'
                ? 'bg-gold shadow-[0_0_6px_hsl(var(--gold)/0.5)]'
                : 'bg-primary'
              : 'bg-border'
          }`}
        />
      ))}
    </div>
  );
};

export default RatingDots;
