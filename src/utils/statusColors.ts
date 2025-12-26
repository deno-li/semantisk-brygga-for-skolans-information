/**
 * Utility functions for status-based color calculations
 */

/**
 * Get color based on status level (1-5 scale)
 * 1 = Red (Critical)
 * 2 = Orange (Poor)
 * 3 = Yellow (Fair)
 * 4 = Light Green (Good)
 * 5 = Green (Excellent)
 */
export function getStatusColor(status: number): string {
  if (status >= 5) return '#22c55e'; // Green
  if (status >= 4) return '#86efac'; // Light Green
  if (status >= 3) return '#eab308'; // Yellow
  if (status >= 2) return '#fb923c'; // Orange
  return '#ef4444'; // Red
}

/**
 * Get status label based on status level
 */
export function getStatusLabel(status: number): string {
  if (status >= 5) return 'Utmärkt';
  if (status >= 4) return 'Bra';
  if (status >= 3) return 'OK';
  if (status >= 2) return 'Behöver uppmärksamhet';
  return 'Behöver åtgärd';
}

/**
 * Get status emoji based on status level
 * Different emojis for each level to improve user experience
 */
export function getStatusEmoji(status: number): string {
  if (status >= 5) return '✅'; // Checkmark for excellent
  if (status >= 4) return '🟢'; // Green for good
  if (status >= 3) return '🟡'; // Yellow for OK
  if (status >= 2) return '🟠'; // Orange for needs attention
  return '🔴'; // Red for critical
}

/**
 * Determine if a status needs attention (below threshold)
 * @param status - The status value to check
 * @param threshold - The threshold below which status needs attention (default: 3)
 * @returns True if status is below threshold
 */
export function statusNeedsAttention(status: number, threshold: number = 3): boolean {
  return status < threshold;
}
