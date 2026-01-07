/**
 * Process raw analytics data into formatted structures for charts
 * @param {Object} analytics - Raw analytics data from API
 * @returns {Object} Processed data ready for visualization
 */
export function processAnalyticsData(analytics) {
  if (!analytics) return null;

  return {
    // Time series data for line/area charts
    timeSeries: analytics.clicksByDate?.map(item => ({
      date: item.label,
      clicks: item.count
    })) || [],

    // Clicks by hour (0-23)
    clicksByHour: analytics.clicksByHour?.map(item => ({
      hour: item.label,
      clicks: item.count
    })) || [],

    // Clicks by day of week (Mon-Sun)
    clicksByDay: analytics.clicksByDayOfWeek?.map(item => ({
      day: item.label,
      clicks: item.count
    })) || [],

    // Top 10 cities
    cities: analytics.clicksByCity?.slice(0, 10).map(item => ({
      name: item.label,
      count: item.count,
      percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
    })) || [],

    // Device breakdown
    devices: analytics.clicksByDevice?.map(item => ({
      name: item.label,
      count: item.count,
      percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
    })) || [],

    // Countries with percentages
    countries: analytics.clicksByCountry?.map(item => ({
      name: item.label,
      code: item.country,
      count: item.count,
      percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
    })) || [],

    // Top 5 browsers
    browsers: analytics.clicksByBrowser?.slice(0, 5).map(item => ({
      name: item.label,
      count: item.count,
      percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
    })) || [],

    // Top 5 operating systems
    os: analytics.clicksByOS?.slice(0, 5).map(item => ({
      name: item.label,
      count: item.count,
      percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
    })) || [],

    // Top 8 referrers
    referrers: analytics.topReferrers?.slice(0, 8).map(item => ({
      name: item.label || 'Direct',
      count: item.count,
      percentage: ((item.count / (analytics.totalClicks || 1)) * 100).toFixed(1)
    })) || [],

    // Engagement radar chart data
    engagement: [
      { 
        metric: 'Clicks', 
        value: Math.min(100, (analytics.totalClicks || 0) / 10) 
      },
      { 
        metric: 'Unique', 
        value: analytics.uniqueVisitors 
          ? ((analytics.uniqueVisitors / analytics.totalClicks) * 100) 
          : 0 
      },
      { 
        metric: 'Mobile', 
        value: parseFloat(analytics.mobilePercentage || 0) 
      },
      { 
        metric: 'Quality', 
        value: analytics.botClicks 
          ? (100 - ((analytics.botClicks / analytics.totalClicks) * 100)) 
          : 100 
      },
      { 
        metric: 'Return', 
        value: analytics.returningVisitors && analytics.uniqueVisitors
          ? ((analytics.returningVisitors / analytics.uniqueVisitors) * 100) 
          : 0 
      }
    ],

    // Summary statistics
    stats: {
      totalClicks: analytics.totalClicks || 0,
      uniqueVisitors: analytics.uniqueVisitors || 0,
      returningVisitors: analytics.returningVisitors || 0,
      countries: analytics.clicksByCountry?.length || 0,
      mobilePercentage: analytics.mobilePercentage || 0
    }
  };
}