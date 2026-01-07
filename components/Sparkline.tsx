'use client';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  showDot?: boolean;
}

export default function Sparkline({ data, color = '#1db954', height = 32, showDot = true }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  // Normalize data to 0-1 range
  const normalized = data.map(val => (val - min) / range);
  
  // Create SVG path
  const width = 80;
  const padding = 2;
  const step = (width - padding * 2) / (data.length - 1);
  
  const points = normalized.map((val, i) => ({
    x: padding + i * step,
    y: height - padding - val * (height - padding * 2)
  }));
  
  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const lastPoint = points[points.length - 1];
  const trend = data[data.length - 1] - data[0];
  const trendColor = trend >= 0 ? '#1db954' : '#ef4444';

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        {/* Fill area under line */}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Area */}
        <path
          d={`${pathData} L ${width - padding} ${height} L ${padding} ${height} Z`}
          fill={`url(#gradient-${color})`}
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* End dot */}
        {showDot && (
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="3"
            fill={trendColor}
            stroke="#000"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
}



