import Icon from '@/components/ui/Icon';

/**
 * StatCard component
 * @description Displays an overview statistic with a title, value, and a percentage trend indicator.
 * Pure presentational — no hooks required.
 */
const StatCard = ({
  title,
  value,
  trendValue,
  icon = 'trending_up',
  trendColor = 'text-[#34D399]',
  bgColor = 'bg-[#34D399]/10',
}) => {
  return (
    <div className="glass-card p-8 rounded-2xl floating-anim group cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-widest opacity-60">{title}</span>
        {trendValue && (
          <span className={`flex items-center ${trendColor} text-[10px] font-bold ${bgColor} px-3 py-1 rounded-full border border-white/5`}>
            <Icon name={icon} size="sm" className="mr-1 group-hover:animate-bounce" />
            {trendValue}
          </span>
        )}
      </div>
      <div className="text-4xl font-headline font-light text-on-surface group-hover:text-primary transition-colors">{value}</div>
    </div>
  );
};

export default StatCard;
