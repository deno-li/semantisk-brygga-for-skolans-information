import React, { memo } from 'react';
import { ShanarriIndicator } from '../types/types';
import { createWheelDimensions, calculateSpokeCoordinates, generateSpokePath, getStatusColor } from '../utils';

interface MiniWellBeingWheelProps {
  data: ShanarriIndicator[];
  size?: number;
  className?: string;
}

/**
 * Simplified mini welfare wheel component for compact displays
 * Shows status colors in a circular format
 */
const MiniWellBeingWheel: React.FC<MiniWellBeingWheelProps> = memo(({ 
  data, 
  size = 160,
  className = 'w-full h-full max-h-[160px]'
}) => {
  const { cx, cy, outerRadius, innerRadius } = createWheelDimensions(size, 0.875, 0.2);
  const n = data.length;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className}>
      {data.map((dim, i) => {
        const coords = calculateSpokeCoordinates(cx, cy, innerRadius, outerRadius, i, n);
        const path = generateSpokePath(coords, innerRadius, outerRadius);
        const color = getStatusColor(dim.status);

        return (
          <path 
            key={dim.id} 
            d={path} 
            fill={color} 
            stroke="white" 
            strokeWidth="1.5" 
          />
        );
      })}
      <circle cx={cx} cy={cy} r={innerRadius} fill="white" />
    </svg>
  );
});

MiniWellBeingWheel.displayName = 'MiniWellBeingWheel';

export default MiniWellBeingWheel;
