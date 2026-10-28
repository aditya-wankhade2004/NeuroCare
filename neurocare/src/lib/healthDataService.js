import { supabase, isSupabaseConfigured } from './supabase';
import {
  MOCK_USER_PROFILE,
  MOCK_NOTIFICATIONS,
  MOCK_SUMMARY_CARDS,
  MOCK_TREND_METRICS,
  MOCK_BASELINE_COMPARISON,
  MOCK_CHANGE_INSIGHTS,
  MOCK_RECENT_ACTIVITY,
  MOCK_DEVICES,
} from './mockData';

/**
 * Health Data Service Layer
 * Abstracts data access for NeuroSense 2.0.
 * Can read from live Supabase tables or provide strictly labeled Demo Data / Empty States.
 */

export async function fetchUserProfile(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return {
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
          initials: (user.user_metadata?.full_name || "NS").slice(0, 2).toUpperCase(),
          memberId: `NS-${user.id.slice(0, 6)}`,
          tier: "NeuroSense Standard",
          avatarUrl: user.user_metadata?.avatar_url || null,
          lastLogin: "Active Now",
        };
      }
    } catch (err) {
      console.warn("Supabase auth check failed, falling back:", err);
    }
  }

  if (isDemo) {
    return MOCK_USER_PROFILE;
  }

  return {
    name: "Guest User",
    initials: "GU",
    memberId: "Unregistered",
    tier: "Setup Pending",
    avatarUrl: null,
    lastLogin: "Never",
  };
}

export async function fetchSummaryMetrics(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder:
      // const { data, error } = await supabase.from('daily_summaries').select('*').order('recorded_at', { ascending: false }).limit(1).single();
      // if (data) return transformSupabaseMetrics(data);
    } catch (err) {
      console.warn("Error fetching live metrics:", err);
    }
  }

  if (isDemo) {
    return MOCK_SUMMARY_CARDS;
  }

  // Return empty structure when demo data is disabled
  return {
    heartRate: null,
    sleep: null,
    cognitive: null,
    activity: null,
  };
}

export async function fetchTrendData(metricKey = null, isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder for trend series
    } catch (err) {
      console.warn("Error fetching live trend data:", err);
    }
  }

  if (isDemo) {
    if (metricKey && MOCK_TREND_METRICS[metricKey]) {
      return MOCK_TREND_METRICS[metricKey];
    }
    return MOCK_TREND_METRICS;
  }

  return null;
}

export async function fetchBaselineData(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder
    } catch (err) {
      console.warn("Error fetching live baseline data:", err);
    }
  }

  if (isDemo) {
    return MOCK_BASELINE_COMPARISON;
  }

  return null;
}

export async function fetchChangeInsights(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder
    } catch (err) {
      console.warn("Error fetching live insights:", err);
    }
  }

  if (isDemo) {
    return MOCK_CHANGE_INSIGHTS;
  }

  return [];
}

export async function fetchRecentActivities(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder
    } catch (err) {
      console.warn("Error fetching live activities:", err);
    }
  }

  if (isDemo) {
    return MOCK_RECENT_ACTIVITY;
  }

  return [];
}

export async function fetchConnectedDevices(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder
    } catch (err) {
      console.warn("Error fetching live devices:", err);
    }
  }

  if (isDemo) {
    return MOCK_DEVICES;
  }

  return [];
}

export async function fetchNotifications(isDemo = true) {
  if (isDemo) {
    return MOCK_NOTIFICATIONS;
  }
  return [];
}
