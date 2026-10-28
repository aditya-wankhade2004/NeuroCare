'use client';

import React from 'react';
import {
  Brain,
  Zap,
  Target,
  Layers,
  Activity,
  Moon,
  Footprints,
  HeartPulse,
  Sparkles,
  Info,
} from 'lucide-react';

const CATEGORY_ICONS = {
  cognitive: Brain,
  reaction: Zap,
  attention: Target,
  memory: Layers,
  motor: Activity,
  sleep: Moon,
  activity: Footprints,
  physiology: HeartPulse,
};

// Node spatial layout coordinates around central avatar core
const NODE_LAYOUT = [
  { id: 'cognitive', x: 200, y: 55, label: 'Cognition', align: 'center' },
  { id: 'reaction', x: 75, y: 110, label: 'Reaction Time', align: 'left' },
  { id: 'attention', x: 325, y: 110, label: 'Attention', align: 'right' },
  { id: 'memory', x: 50, y: 220, label: 'Working Memory', align: 'left' },
  { id: 'motor', x: 350, y: 220, label: 'Motor Cadence', align: 'right' },
  { id: 'sleep', x: 75, y: 330, label: 'Sleep Rest', align: 'left' },
  { id: 'activity', x: 325, y: 330, label: 'Daily Activity', align: 'right' },
  { id: 'physiology', x: 200, y: 385, label: 'Physiology', align: 'center' },
];

export default function NeuroTwinVisualization({
  categories,
  selectedCategory,
  onSelectCategory,
  isDemoMode = true,
}) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Personal NeuroTwin Topology
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
              Interactive Model
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any cognitive or physiological cluster to inspect calibrated reference telemetry.
          </p>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:block">
          8 Clustered Categories
        </span>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="relative w-full max-w-lg mx-auto py-6 select-none">
        <svg
          viewBox="0 0 400 440"
          className="w-full h-auto overflow-visible drop-shadow-sm"
          role="img"
          aria-label="Interactive NeuroTwin topology diagram"
        >
          <defs>
            {/* Glowing radial gradients */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </radialGradient>

            <linearGradient id="activeLinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>

          {/* Central Holographic Sphere Glow */}
          <circle cx="200" cy="220" r="105" fill="url(#centerGlow)" />
          <circle cx="200" cy="220" r="75" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="220" r="45" fill="#0A1128" stroke="#1E293B" strokeWidth="2" />

          {/* Central Core Brain Graphic */}
          <g transform="translate(186, 206)" className="pointer-events-none">
            <path
              d="M14 2C8 2 3 7 3 13c0 3 1.5 5.5 3.5 7.5L14 27l7.5-6.5C23.5 18.5 25 16 25 13c0-6-5-11-11-11z"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
            />
            <circle cx="14" cy="12" r="3" fill="#06b6d4" />
          </g>

          {/* Neural Connection Lines linking Nodes to Core */}
          {NODE_LAYOUT.map((node) => {
            const isSelected = selectedCategory === node.id;
            return (
              <line
                key={`line-${node.id}`}
                x1="200"
                y1="220"
                x2={node.x}
                y2={node.y}
                stroke={isSelected ? '#06b6d4' : '#E2E8F0'}
                strokeWidth={isSelected ? '2.5' : '1.2'}
                strokeDasharray={isSelected ? 'none' : '3 3'}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Interactive Nodes */}
          {NODE_LAYOUT.map((node) => {
            const catData = categories ? categories[node.id] : null;
            const isSelected = selectedCategory === node.id;
            const hasData = catData?.hasData ?? false;

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectCategory(node.id)}
                className="cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectCategory(node.id);
                }}
                aria-label={`Select ${catData?.name || node.label}`}
              >
                {/* Outer Glow Ring when selected */}
                {isSelected && (
                  <circle
                    r="26"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    className="animate-ping"
                  />
                )}

                {/* Node Outer Circle */}
                <circle
                  r="20"
                  fill={isSelected ? '#0891b2' : hasData ? '#FFFFFF' : '#F1F5F9'}
                  stroke={isSelected ? '#06b6d4' : hasData ? '#06b6d4' : '#CBD5E1'}
                  strokeWidth={isSelected ? '3' : '2'}
                  className="transition-all duration-200 group-hover:scale-110 shadow-md"
                />

                {/* Data point dot */}
                <circle
                  r="4"
                  fill={isSelected ? '#FFFFFF' : hasData ? '#0d9488' : '#94A3B8'}
                />

                {/* Text Label */}
                <text
                  y={node.y < 220 ? -28 : 34}
                  textAnchor="middle"
                  className={`text-[11px] font-sans transition-colors ${
                    isSelected
                      ? 'fill-cyan-700 font-extrabold'
                      : 'fill-slate-700 font-semibold group-hover:fill-cyan-600'
                  }`}
                >
                  {catData?.shortName || node.label}
                </text>

                {/* Metric pill under node */}
                {hasData && (
                  <text
                    y={node.y < 220 ? -14 : 46}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 font-mono font-medium"
                  >
                    {catData.latestValue?.split(' ')[0]} {catData.unit}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Category Pill Indicator */}
        <div className="text-center mt-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Active Focus: <strong className="text-cyan-700">{categories?.[selectedCategory]?.name || 'Cognitive Performance'}</strong>
          </span>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Stylized personal health data topology • Category-based visualization</span>
        <span className="font-mono">Non-Imaging Topology</span>
      </div>
    </div>
  );
}
