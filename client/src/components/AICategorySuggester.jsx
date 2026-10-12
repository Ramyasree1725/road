import React, { useMemo } from 'react';
import { Building2, Check } from 'lucide-react';

export const AICategorySuggester = ({ text = '', currentCategory, onSelectCategory }) => {
  const suggestion = useMemo(() => {
    if (!text || text.trim().length < 4) return null;

    const lower = text.toLowerCase();

    // Municipal triage routing rules based on department protocols
    const rules = [
      {
        category: 'Roads & Footpaths',
        keywords: ['pothole', 'road', 'asphalt', 'footpath', 'sidewalk', 'tar', 'crater', 'divider', 'speed breaker'],
        confidence: 96,
      },
      {
        category: 'Waste Management',
        keywords: ['garbage', 'trash', 'waste', 'dump', 'bin', 'litter', 'compost', 'stench', 'smell', 'debris'],
        confidence: 94,
      },
      {
        category: 'Drainage & Water',
        keywords: ['drain', 'water', 'leak', 'pipeline', 'sewage', 'clog', 'gutter', 'flooding', 'drinking water', 'manhole'],
        confidence: 98,
      },
      {
        category: 'Street Lighting',
        keywords: ['light', 'lamp', 'dark', 'bulb', 'pole', 'electricity', 'wire', 'illumination', 'led'],
        confidence: 95,
      },
      {
        category: 'Parks & Trees',
        keywords: ['tree', 'branch', 'park', 'grass', 'garden', 'bush', 'leaves', 'bench'],
        confidence: 92,
      },
      {
        category: 'Public Health',
        keywords: ['mosquito', 'stagnant', 'dengue', 'hygiene', 'public toilet', 'hospital', 'sanitation'],
        confidence: 90,
      },
    ];

    for (const rule of rules) {
      const match = rule.keywords.some((kw) => lower.includes(kw));
      if (match) {
        return rule;
      }
    }

    return null;
  }, [text]);

  if (!suggestion || suggestion.category === currentCategory) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-3.5 my-3 bg-emerald-950/60 border border-emerald-700/60 rounded-2xl animate-fade-in shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Municipal Triage Routing:</span>
            <span className="text-xs font-bold text-emerald-300 bg-slate-900 px-2 py-0.5 rounded-lg border border-emerald-700">
              {suggestion.category}
            </span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-0.5">
            Matched directly to Ward 12 field dispatch protocols
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelectCategory(suggestion.category)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-all"
      >
        <Check className="w-3.5 h-3.5" />
        Apply
      </button>
    </div>
  );
};

export default AICategorySuggester;
