/**
 * Utility functions for calculating SVG wheel/spoke geometry
 */

export interface WheelDimensions {
  size: number;
  cx: number;
  cy: number;
  outerRadius: number;
  innerRadius: number;
}

export interface SpokeCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
}

/**
 * Create default wheel dimensions
 */
export function createWheelDimensions(
  size: number,
  outerRadiusFactor: number = 0.9,
  innerRadiusFactor: number = 0.2
): WheelDimensions {
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = (size / 2) * outerRadiusFactor;
  const innerRadius = (size / 2) * innerRadiusFactor;
  
  return { size, cx, cy, outerRadius, innerRadius };
}

/**
 * Calculate spoke path coordinates for a circular segment
 */
export function calculateSpokeCoordinates(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  segmentIndex: number,
  totalSegments: number
): SpokeCoordinates {
  const startAngle = (segmentIndex * 360) / totalSegments - 90;
  const endAngle = ((segmentIndex + 1) * 360) / totalSegments - 90;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  return {
    x1: cx + Math.cos(startRad) * innerRadius,
    y1: cy + Math.sin(startRad) * innerRadius,
    x2: cx + Math.cos(startRad) * outerRadius,
    y2: cy + Math.sin(startRad) * outerRadius,
    x3: cx + Math.cos(endRad) * outerRadius,
    y3: cy + Math.sin(endRad) * outerRadius,
    x4: cx + Math.cos(endRad) * innerRadius,
    y4: cy + Math.sin(endRad) * innerRadius,
  };
}

/**
 * Generate SVG path string for a circular segment
 */
export function generateSpokePath(coords: SpokeCoordinates, innerRadius: number, outerRadius: number): string {
  return `M ${coords.x1} ${coords.y1} L ${coords.x2} ${coords.y2} A ${outerRadius} ${outerRadius} 0 0 1 ${coords.x3} ${coords.y3} L ${coords.x4} ${coords.y4} A ${innerRadius} ${innerRadius} 0 0 0 ${coords.x1} ${coords.y1}`;
}

/**
 * Calculate label position for a spoke
 */
export function calculateLabelPosition(
  cx: number,
  cy: number,
  radius: number,
  segmentIndex: number,
  totalSegments: number
): { x: number; y: number; angle: number } {
  const angle = (segmentIndex * 360) / totalSegments + (360 / totalSegments / 2) - 90;
  const rad = (angle * Math.PI) / 180;
  
  return {
    x: cx + Math.cos(rad) * radius,
    y: cy + Math.sin(rad) * radius,
    angle: angle + 90,
  };
}
