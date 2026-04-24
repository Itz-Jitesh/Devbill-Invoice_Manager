'use client';

import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';

/**
 * StatCard component
 * @description Displays an overview statistic with a title, value, and a percentage trend indicator.
 */
const StatCard = ({
  title,
  value,
  trendValue,
  icon = 'trending_up',
  trendColor = 'text-[var(--color-success)]',
  bgColor = 'bg-[var(--color-success)]/10',
}) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="surface-card p-6 rounded-xl group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <span className="text-[var(--color-on-surface-variant)] font-medium text-xs uppercase tracking-wider">{title}</span>
        {trendValue && (
          <span className={`flex items-center ${trendColor} text-[10px] font-bold ${bgColor} px-2.5 py-1 rounded-md`}>
            <Icon name={icon} size="sm" className="mr-1" />
            {trendValue}
          </span>
        )}
      </div>
      <div className="text-3xl font-headline font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{value}</div>
    </motion.div>
  );
};

export default StatCard;
