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
  MOCK_BASELINE_OVERVIEW,
  MOCK_BASELINE_FORM_DATA,
  MOCK_BASELINE_COMPARISON_DETAILED,
  MOCK_BASELINE_HISTORY,
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

/**
 * Health Baseline Service API Methods
 */

export async function fetchBaselineOverview(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder:
      // const { data } = await supabase.from('baseline_overviews').select('*').single();
      // if (data) return data;
    } catch (err) {
      console.warn("Error fetching baseline overview:", err);
    }
  }

  if (isDemo) {
    return MOCK_BASELINE_OVERVIEW;
  }

  return {
    status: "Not Started",
    establishedDate: null,
    lastUpdatedDate: null,
    calibrationWindowDays: 0,
    recordedMeasurementsCount: 0,
    cognitiveSessionsCount: 0,
    completedFieldsCount: 0,
    totalOptionalFieldsCount: 7,
    completenessPercentage: 0,
    completenessNote: "No baseline measurements have been established yet. Use the setup form below or pair a device to start.",
  };
}

export async function fetchBaselineFormData(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder for user's active baseline draft / record
    } catch (err) {
      console.warn("Error fetching baseline form data:", err);
    }
  }

  if (isDemo) {
    return MOCK_BASELINE_FORM_DATA;
  }

  return {
    general: {
      ageRange: "",
      preferredUnits: "metric",
      notes: "",
    },
    measurements: {
      heartRate: { value: "", unit: "BPM", date: "", source: "", isDevice: false },
      sleepDuration: { value: "", unit: "hours", date: "", source: "", isDevice: false },
      dailySteps: { value: "", unit: "steps", date: "", source: "", isDevice: false },
      bloodPressureSys: { value: "", unit: "mmHg", date: "", source: "", isDevice: false },
      bloodPressureDia: { value: "", unit: "mmHg", date: "", source: "", isDevice: false },
    },
    cognitive: {
      reactionTime: { value: null, unit: "ms", taskName: "Symbol-Digit Matching Latency", date: null, method: "10-trial visual reaction battery", completed: false },
      attention: { value: null, unit: "%", taskName: "Sustained Attention Index", date: null, method: "Color-Word Stroop Battery", completed: false },
      memory: { value: null, unit: "%", taskName: "Working Memory Accuracy", date: null, method: "Dual 2-Back Spatial Recall", completed: false },
      motorCoordination: { value: null, unit: "taps/10s", taskName: "Motor Coordination & Cadence", date: null, method: "Finger Tapping Test", completed: false },
    },
    conditions: {
      timeOfDay: "",
      sleepPriorHours: "",
      sourceType: "manual",
      conditionNotes: "",
    },
  };
}

export async function fetchBaselineDetailedComparison(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder
    } catch (err) {
      console.warn("Error fetching baseline comparisons:", err);
    }
  }

  if (isDemo) {
    return MOCK_BASELINE_COMPARISON_DETAILED;
  }

  return [];
}

export async function fetchBaselineHistory(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder
    } catch (err) {
      console.warn("Error fetching baseline history:", err);
    }
  }

  if (isDemo) {
    return MOCK_BASELINE_HISTORY;
  }

  return [];
}

export async function saveBaselineRecord(payload) {
  if (isSupabaseConfigured && supabase) {
    try {
      // const { data, error } = await supabase.from('baselines').insert(payload).select().single();
      // if (error) throw error;
      // return { success: true, data };
    } catch (err) {
      console.error("Failed to save baseline record to Supabase:", err);
      return { success: false, error: err.message };
    }
  }

  // Simulation mode response
  return {
    success: true,
    message: "Baseline saved in simulated session. Connect Supabase for persistent cloud storage.",
    data: payload,
  };
}

export async function saveBaselineDraft(payload) {
  // Safe session draft placeholder
  return {
    success: true,
    message: "Draft saved in active session memory.",
    data: payload,
  };
}
