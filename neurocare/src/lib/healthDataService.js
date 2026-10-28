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
  MOCK_ASSESSMENTS_OVERVIEW,
  MOCK_ASSESSMENT_HISTORY,
  MOCK_ASSESSMENT_TRENDS,
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

/**
 * Cognitive Assessments Service Methods
 */

export async function fetchAssessmentOverview(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder
    } catch (err) {
      console.warn("Error fetching assessment overview:", err);
    }
  }

  if (isDemo) {
    return MOCK_ASSESSMENTS_OVERVIEW;
  }

  return {
    totalCompletedSessions: 0,
    mostRecentDate: "Not yet assessed",
    baselineAvailable: false,
    baselineEstablishedDate: null,
    cards: {
      reaction: {
        id: "neuro-reaction",
        title: "NeuroReaction",
        badge: "Processing Speed",
        description: "Measures visual stimulus detection latency, motor response time, and trial-by-trial variance.",
        lastCompletedDate: "Not yet assessed",
        latestMedianMs: null,
        unit: "ms",
        completedSessionsCount: 0,
        baselineMedianMs: null,
        differenceVsBaseline: null,
        status: "Available",
      },
      attention: {
        id: "neuro-attention",
        title: "NeuroAttention",
        badge: "Sustained Attention",
        description: "Target-detection task measuring vigilance, hit accuracy, and omission errors across rapid trials.",
        lastCompletedDate: "Not yet assessed",
        latestAccuracy: null,
        correctResponses: 0,
        missedResponses: 0,
        unit: "%",
        completedSessionsCount: 0,
        baselineAccuracy: null,
        differenceVsBaseline: null,
        status: "Available",
      },
      memory: {
        id: "neuro-memory",
        title: "NeuroMemory",
        badge: "Working Memory",
        description: "Sequential tile pattern recall measuring short-term spatial span and active recall fidelity.",
        lastCompletedDate: "Not yet assessed",
        latestAccuracy: null,
        longestSequence: null,
        unit: "tiles",
        completedSessionsCount: 0,
        baselineLongestSequence: null,
        differenceVsBaseline: null,
        status: "Available",
      },
      motion: {
        id: "neuro-motion",
        title: "NeuroMotion",
        badge: "Motor Coordination",
        description: "Rapid finger-tapping task measuring motor cadence, rhythm consistency, and motor fatigue.",
        lastCompletedDate: "Not yet assessed",
        latestTapsPerSec: null,
        completionTime: null,
        unit: "taps/s",
        completedSessionsCount: 0,
        baselineTapsPerSec: null,
        differenceVsBaseline: null,
        status: "Available",
      },
    },
  };
}

export async function fetchAssessmentHistory(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder:
      // const { data } = await supabase.from('assessment_sessions').select('*').order('created_at', { ascending: false });
    } catch (err) {
      console.warn("Error fetching assessment history:", err);
    }
  }

  if (isDemo) {
    return MOCK_ASSESSMENT_HISTORY;
  }

  return [];
}

export async function fetchAssessmentTrends(isDemo = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Future Supabase query placeholder
    } catch (err) {
      console.warn("Error fetching assessment trends:", err);
    }
  }

  if (isDemo) {
    return MOCK_ASSESSMENT_TRENDS;
  }

  return {
    reaction: { metricName: "Reaction Speed (ms)", unit: "ms", description: "Median reaction time across completed test sessions.", baselineValue: 226, yDomain: [180, 260], data: [] },
    attention: { metricName: "Target Detection Accuracy (%)", unit: "%", description: "Target stimuli detection accuracy percentage.", baselineValue: 91, yDomain: [70, 100], data: [] },
    memory: { metricName: "Longest Sequence Recalled", unit: "items", description: "Maximum sequence length successfully reproduced.", baselineValue: 5, yDomain: [2, 8], data: [] },
    motion: { metricName: "Finger Tapping Cadence (taps/s)", unit: "taps/s", description: "Average taps per second over 10s interval.", baselineValue: 5.9, yDomain: [3, 8], data: [] },
  };
}

export async function saveAssessmentResult(payload) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // const { data, error } = await supabase.from('assessment_sessions').insert({
      //   user_id: user?.id,
      //   assessment_type: payload.type,
      //   measured_values: payload.results,
      //   trial_count: payload.trialsCount,
      //   version: '2.0',
      //   created_at: new Date().toISOString()
      // }).select().single();
      // if (error) throw error;
      // return { success: true, data };
    } catch (err) {
      console.error("Failed to save assessment to Supabase:", err);
    }
  }

  return {
    success: true,
    message: "Assessment session saved to local prototype session memory.",
    data: payload,
  };
}
