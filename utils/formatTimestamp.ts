/**
 * Converts an ISO date string into a human-readable relative time format.
 * e.g., "2 hours ago", "3 days ago", "Just now"
 * @param dateString - The ISO 8601 date string from the API.
 * @returns A formatted string representing the relative time.
 */
export function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 5) return "Just now";
  
  let interval = seconds / 31536000; // Years
  if (interval > 1) {
    const years = Math.floor(interval);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
  
  interval = seconds / 2592000; // Months
  if (interval > 1) {
    const months = Math.floor(interval);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  interval = seconds / 86400; // Days
  if (interval > 1) {
    const days = Math.floor(interval);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  interval = seconds / 3600; // Hours
  if (interval > 1) {
    const hours = Math.floor(interval);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  interval = seconds / 60; // Minutes
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  return `${Math.floor(seconds)} seconds ago`;
}
