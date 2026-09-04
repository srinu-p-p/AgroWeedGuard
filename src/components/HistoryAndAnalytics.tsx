import React, { useState } from 'react';
import {
  History,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  Filter,
  MessageSquare,
  TrendingDown,
  Sparkles,
  Search
} from 'lucide-react';
import { WeedDetectionResult } from '../types';

interface HistoryProps {
  historyList: WeedDetectionResult[];
  onSelectResult: (res: WeedDetectionResult) => void;
  onClearHistory: () => void;
  onUpdateFeedback: (id: string, feedback: string) => void;
}

export const HistoryAndAnalytics: React.FC<HistoryProps> = ({
  historyList,
  onSelectResult,
  onClearHistory,
  onUpdateFeedback
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const filteredHistory = historyList.filter(item => {
    const q = searchTerm.toLowerCase();
    return (
      item.cropInfo.cropType.toLowerCase().includes(q) ||
      item.primarySpecies.toLowerCase().includes(q) ||
      item.cropInfo.fieldLocation.toLowerCase().includes(q) ||
      item.severityLevel.toLowerCase().includes(q)
    );
  });

  // Calculate cumulative analytics
  const totalInspections = historyList.length;
  const totalChemicalSavedLiters = historyList.reduce(
    (acc, curr) => acc + (curr.aiSmartRecommendation?.savedChemicalLiters || 0),
    0
  );
  const totalCostSaved = historyList.reduce(
    (acc, curr) => acc + (curr.aiSmartRecommendation?.savedCostPerAcre || 0) * 4,
    0
  );

  const handleStartFeedback = (item: WeedDetectionResult) => {
    setEditingId(item.id);
    setFeedbackInput(item.cropInfo.farmerNotes || '');
  };

  const handleSaveFeedback = (id: string) => {
    onUpdateFeedback(id, feedbackInput);
    setEditingId(null);
  };

  const exportCSV = () => {
    if (historyList.length === 0) return;
    const headers = [
      'Timestamp',
      'Crop',
      'Location',
      'Primary Weed',
      'Category',
      'Severity',
      'Density %',
      'Rule Chemical',
      'AI Smart Recommendation',
      'Herbicide Reduction %',
      'Farmer Feedback'
    ];
    const rows = historyList.map(item => [
      `"${item.timestamp}"`,
      `"${item.cropInfo.cropType}"`,
      `"${item.cropInfo.fieldLocation}"`,
      `"${item.primarySpecies}"`,
      `"${item.primaryWeedCategory}"`,
      `"${item.severityLevel}"`,
      item.infestationDensityPercent,
      `"${item.ruleBasedRecommendation.herbicide}"`,
      `"${item.aiSmartRecommendation.selectiveChemical}"`,
      `${item.aiSmartRecommendation.targetedSprayingReductionPercent}%`,
      `"${item.cropInfo.farmerNotes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgroWeedGuard_Field_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Overview Analytics Bar */}
      <div className="rounded-2xl border border-emerald-900/60 bg-[#0d1810]/80 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
                09
              </span>
              <h2 className="text-base font-bold text-white">
                Field Inspection History & Cumulative Analytics
              </h2>
            </div>
            <p className="text-xs text-emerald-300/60 mt-0.5">
              Module 1 & 9: Historical audit log of scans, farmer treatment feedback & ecological savings
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              disabled={historyList.length === 0}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/50 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" /> Export History CSV
            </button>
            <button
              onClick={onClearHistory}
              disabled={historyList.length === 0}
              className="flex items-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/40 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All
            </button>
          </div>
        </div>

        {/* Aggregated Counters */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-3.5">
            <span className="text-[11px] font-semibold text-emerald-400/80 uppercase">Total Field Scans</span>
            <div className="text-2xl font-extrabold text-white mt-1">{totalInspections} plots</div>
            <p className="text-[10px] text-emerald-300/60 mt-0.5">Audited with AI object detection</p>
          </div>

          <div className="rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-3.5">
            <span className="text-[11px] font-semibold text-emerald-400/80 uppercase">Cumulative Herbicide Saved</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {totalChemicalSavedLiters.toFixed(1)} Liters
            </div>
            <p className="text-[10px] text-emerald-300/60 mt-0.5">Chemicals prevented from environmental leaching</p>
          </div>

          <div className="rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-3.5">
            <span className="text-[11px] font-semibold text-emerald-400/80 uppercase">Cumulative Cost Saved</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              ${totalCostSaved.toFixed(2)}
            </div>
            <p className="text-[10px] text-emerald-300/60 mt-0.5">Through precision spot-spraying</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-emerald-400/60" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by crop, weed species, location, or severity..."
              className="w-full rounded-xl border border-emerald-900/80 bg-black/40 pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-900/60 bg-[#0c160f]/60 p-8 text-center text-xs text-emerald-300/60">
            No inspection records match your search. Run detections in the Field Vision module to populate the history database.
          </div>
        ) : (
          filteredHistory.map(record => (
            <div
              key={record.id}
              className="rounded-2xl border border-emerald-900/60 bg-[#0b160e]/90 p-4 shadow-md transition-all hover:border-emerald-700/60"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Thumbnail & Info */}
                <div className="flex items-start gap-3">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-emerald-900 bg-black">
                    <img
                      src={record.imageUrl}
                      alt={record.primarySpecies}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {record.cropInfo.cropType} Field ({record.cropInfo.growthStage})
                      </span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        {record.severityLevel} Severity
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-emerald-300/70">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-400" /> {record.cropInfo.fieldLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-emerald-400" /> {record.timestamp}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-emerald-200">
                      Primary Infestation: <strong className="text-white">{record.primarySpecies}</strong> ({record.primaryWeedCategory}) — {record.detectedWeedsCount} target clusters detected.
                    </div>
                  </div>
                </div>

                {/* Right: Savings & Load button */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">
                      {record.aiSmartRecommendation?.targetedSprayingReductionPercent || 70}% Herbicide Saved
                    </div>
                    <div className="text-[10px] text-emerald-300/60">
                      Model: {record.selectedModel}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectResult(record)}
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500"
                  >
                    Inspect in Canvas
                  </button>
                </div>
              </div>

              {/* Farmer Feedback Section */}
              <div className="mt-3 border-t border-emerald-950/80 pt-2.5 text-xs">
                {editingId === record.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feedbackInput}
                      onChange={e => setFeedbackInput(e.target.value)}
                      placeholder="Add treatment outcome feedback (e.g. 95% weed mortality observed 4 days post-spray)..."
                      className="flex-1 rounded-lg border border-emerald-800 bg-black/40 px-3 py-1 text-xs text-white"
                    />
                    <button
                      onClick={() => handleSaveFeedback(record.id)}
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg bg-neutral-800 px-2 py-1 text-xs text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-emerald-300/80">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3 w-3 text-emerald-400" />
                      <span>
                        Farmer Field Note / Treatment Feedback:{' '}
                        <strong>{record.cropInfo.farmerNotes || 'No notes added yet.'}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartFeedback(record)}
                      className="text-emerald-400 underline hover:text-emerald-300"
                    >
                      {record.cropInfo.farmerNotes ? 'Edit Note' : '+ Add Field Feedback'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
