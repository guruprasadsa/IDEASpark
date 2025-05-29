import React from 'react';
import type { LearningPreferences } from '../types';

interface LearningPreferencesFormProps {
  preferences: LearningPreferences;
  onPreferencesChange: (newPreferences: LearningPreferences) => void;
}

export const LearningPreferencesForm: React.FC<LearningPreferencesFormProps> = ({ preferences, onPreferencesChange }) => {
  const handleFocusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPreferencesChange({ ...preferences, focus: e.target.value as LearningPreferences['focus'] });
  };

  const handleDepthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPreferencesChange({ ...preferences, depth: e.target.value as LearningPreferences['depth'] });
  };

  return (
    <div className="p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700/60 shadow-sm">
      <h3 className="text-md font-semibold text-sky-300 mb-3 text-center sm:text-left">Customize Idea Generation</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="learningFocus" className="block text-sm font-medium text-slate-300 mb-1">
            Learning Focus
          </label>
          <select
            id="learningFocus"
            name="learningFocus"
            value={preferences.focus}
            onChange={handleFocusChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
          >
            <option value="any">Any Focus</option>
            <option value="practical">Practical Projects</option>
            <option value="theoretical">Theoretical Understanding</option>
            <option value="overview">Quick Overview</option>
          </select>
        </div>
        <div>
          <label htmlFor="learningDepth" className="block text-sm font-medium text-slate-300 mb-1">
            Desired Depth
          </label>
          <select
            id="learningDepth"
            name="learningDepth"
            value={preferences.depth}
            onChange={handleDepthChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
          >
            <option value="any">Any Depth</option>
            <option value="beginner">Beginner Friendly</option>
            <option value="intermediate">Intermediate Challenge</option>
            <option value="advanced">Advanced Exploration</option>
          </select>
        </div>
      </div>
    </div>
  );
};
