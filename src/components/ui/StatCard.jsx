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
    <div className="glass-card p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(108,99,255,0.04)] hover:shadow-primary/5 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <span className="text-on-surface-variant font-medium text-sm">{title}</span>
        {trendValue && (
          <span className={`flex items-center ${trendColor} text-xs font-bold ${bgColor} px-2 py-1 rounded-full`}>
            <Icon name={icon} size="sm" className="mr-1" />
            {trendValue}
          </span>
        )}
      </div>
      <div className="text-3xl font-headline font-light text-on-surface">{value}</div>
    </div>
  );
};

export default StatCard;
