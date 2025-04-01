
/**
 * Utility functions for exporting data
 */

/**
 * Convert data to CSV format and trigger download
 * @param data Array of objects to convert to CSV
 * @param filename Filename for the downloaded file
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle special cases like arrays, objects, nulls, etc.
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value).replace(/,/g, ';').replace(/"/g, '""');
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return value;
      }).join(',')
    )
  ].join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date for display or export
 * @param dateString Date string to format
 * @param includeTime Whether to include time in the formatted string
 */
export const formatDate = (dateString: string, includeTime = false) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };
  
  return date.toLocaleDateString('en-US', options);
};
