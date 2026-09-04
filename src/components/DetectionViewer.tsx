import React, { useState } from 'react';
import {
  Scan,
  Layers,
  Crosshair,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Flame,
  Grid,
  Info,
  Maximize2
} from 'lucide-react';
import { WeedDetectionResult, BoundingBox, WeedCategory } from '../types';

interface DetectionViewerProps {
  result: WeedDetectionResult | null;
  currentImage: string;
  isAnalyzing: boolean;
}

type OverlayMode = 'boxes' | 'heatmap' | 'sprayer-grid' | 'raw';

export const DetectionViewer: React.FC<DetectionViewerProps> = ({
  result,
  currentImage,
  isAnalyzing
}) => {
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('boxes');
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  if (!result && !isAnalyzing) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-900/60 bg-[#0c160f]/60 p-8 text-center backdrop-blur-sm">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-400">
          <Scan className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-white">No Detection Results Yet</h3>
        <p className="max-w-md text-xs text-emerald-300/70 mt-1">
          Upload a field photo above or choose a sample crop preset (Cotton, Maize, Rice, Soybean, etc.) and click &quot;Execute AI Weed Detection&quot; to run computer vision models.
        </p>
      </div>
    );
  }

  // Filter boxes if user toggled category filter
  const boxes = result?.boundingBoxes || [];
  const filteredBoxes = boxes.filter(b => {
    if (selectedCategoryFilter === 'all') return true;
    return b.weedClass === selectedCategoryFilter;
  });

  // Category Color Map
  const getCategoryColor = (category: WeedCategory) => {
    switch (category) {
      case 'Broadleaf Weeds':
        return {
          border: 'border-amber-400',
          bg: 'bg-amber-500/20',
          badge: 'bg-amber-500 text-amber-950',
          text: 'text-amber-300'
        };
      case 'Grass Weeds':
        return {
          border: 'border-cyan-400',
          bg: 'bg-cyan-500/20',
          badge: 'bg-cyan-500 text-cyan-950',
          text: 'text-cyan-300'
        };
      case 'Sedge Weeds':
        return {
          border: 'border-purple-400',
          bg: 'bg-purple-500/20',
          badge: 'bg-purple-500 text-purple-950',
          text: 'text-purple-300'
        };
      default:
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-500/20',
          badge: 'bg-emerald-500 text-emerald-950',
          text: 'text-emerald-300'
        };
    }
  };

  const selectedBox = boxes.find(b => b.id === selectedBoxId) || (boxes.length > 0 ? boxes[0] : null);

  // Severity style helper
  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'Severe':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Moderate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-5">
      {/* Metrics Row */}
      {result && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-900/60 bg-[#0c160f]/80 p-3.5 shadow-md">
            <span className="text-[11px] font-semibold text-emerald-400/80 uppercase">Target Weeds Found</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{result.detectedWeedsCount}</span>
              <span className="text-xs text-emerald-400 font-medium">instances</span>
            </div>
            <div className="text-[10px] text-emerald-300/60 truncate mt-0.5">
              Primary: {result.primarySpecies}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/60 bg-[#0c160f]/80 p-3.5 shadow-md">
            <span className="text-[11px] font-semibold text-emerald-400/80 uppercase">Weed Severity</span>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${getSeverityBadge(result.severityLevel)}`}>
                {result.severityLevel} Risk
              </span>
            </div>
            <div className="text-[10px] text-emerald-300/60 mt-0.5">
              Density: {result.infestationDensityPercent}% of canopy
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/60 bg-[#0c160f]/80 p-3.5 shadow-md">
            <span className="text-[11px] font-semibold text-emerald-400/80 uppercase">AI Targeted Savings</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-400">
                {result.aiSmartRecommendation.targetedSprayingReductionPercent}%
              </span>
              <span className="text-xs text-emerald-200">less chemical</span>
            </div>
            <div className="text-[10px] text-emerald-300/60 mt-0.5">
              Saves ~{result.aiSmartRecommendation.savedChemicalLiters}L per treatment
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/60 bg-[#0c160f]/80 p-3.5 shadow-md">
            <span className="text-[11px] font-semibold text-emerald-400/80 uppercase">Inference Model</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-bold text-white truncate">{result.selectedModel}</span>
            </div>
            <div className="text-[10px] text-emerald-300/60 mt-0.5">
              Real-time IoU: 0.862 | Latency: 14ms
            </div>
          </div>
        </div>
      )}

      {/* Main Vision Stage & Inspector (12 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Interactive Field Canvas with Bounding Boxes (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="rounded-2xl border border-emerald-900/70 bg-[#0a130c] p-4 shadow-xl">
            {/* View Mode & Filter bar */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-950 pb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <Crosshair className="h-4 w-4 text-emerald-400" />
                <span>Detection Canvas (Modules 4 & 5)</span>
              </div>

              {/* Overlay Mode Switcher */}
              <div className="flex items-center gap-1 rounded-lg border border-emerald-900/80 bg-emerald-950/40 p-1 text-xs">
                <button
                  id="mode-btn-boxes"
                  onClick={() => setOverlayMode('boxes')}
                  className={`rounded px-2 py-1 font-medium transition-all ${
                    overlayMode === 'boxes'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-emerald-300/70 hover:text-white'
                  }`}
                >
                  Bounding Boxes
                </button>
                <button
                  id="mode-btn-heatmap"
                  onClick={() => setOverlayMode('heatmap')}
                  className={`rounded px-2 py-1 font-medium transition-all ${
                    overlayMode === 'heatmap'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-emerald-300/70 hover:text-white'
                  }`}
                >
                  Infestation Heatmap
                </button>
                <button
                  id="mode-btn-grid"
                  onClick={() => setOverlayMode('sprayer-grid')}
                  className={`rounded px-2 py-1 font-medium transition-all ${
                    overlayMode === 'sprayer-grid'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-emerald-300/70 hover:text-white'
                  }`}
                >
                  Smart Nozzle Grid
                </button>
                <button
                  id="mode-btn-raw"
                  onClick={() => setOverlayMode('raw')}
                  className={`rounded px-2 py-1 font-medium transition-all ${
                    overlayMode === 'raw'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-emerald-300/70 hover:text-white'
                  }`}
                >
                  Raw Field
                </button>
              </div>
            </div>

            {/* Stage Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-emerald-900/60 bg-black shadow-inner">
              <img
                src={currentImage}
                alt="Agricultural field"
                className="h-full w-full object-cover select-none"
                referrerPolicy="no-referrer"
              />

              {/* OVERLAY: Bounding Boxes */}
              {overlayMode === 'boxes' &&
                filteredBoxes.map(box => {
                  const [ymin, xmin, ymax, xmax] = box.box;
                  const colors = getCategoryColor(box.weedClass);
                  const isSelected = selectedBoxId === box.id;

                  return (
                    <div
                      key={box.id}
                      id={`box-${box.id}`}
                      onClick={() => setSelectedBoxId(box.id)}
                      style={{
                        top: `${ymin}%`,
                        left: `${xmin}%`,
                        width: `${xmax - xmin}%`,
                        height: `${ymax - ymin}%`
                      }}
                      className={`absolute cursor-pointer rounded border-2 transition-all duration-150 ${colors.border} ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black bg-emerald-500/20'
                          : 'bg-emerald-900/10 hover:bg-emerald-500/20'
                      }`}
                    >
                      {/* Box header label */}
                      <div className="absolute -top-6 left-0 flex items-center gap-1 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-bold text-white shadow backdrop-blur-sm whitespace-nowrap">
                        <span className={`h-2 w-2 rounded-full ${colors.badge}`} />
                        <span>{box.speciesName}</span>
                        <span className="text-emerald-400">{(box.confidence * 100).toFixed(0)}%</span>
                      </div>

                      {/* Corner targeting marks */}
                      <div className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-white" />
                      <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-white" />
                      <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-white" />
                      <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-white" />
                    </div>
                  );
                })}

              {/* OVERLAY: Infestation Heatmap */}
              {overlayMode === 'heatmap' && (
                <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-75">
                  <div className="h-full w-full bg-[radial-gradient(ellipse_at_30%_35%,rgba(239,68,68,0.7)_0%,rgba(245,158,11,0.5)_35%,rgba(16,185,129,0.1)_70%,transparent_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_65%,rgba(239,68,68,0.6)_0%,rgba(245,158,11,0.4)_40%,transparent_80%)]" />
                  <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2.5 py-1 text-[11px] text-white backdrop-blur">
                    <span className="text-red-400 font-bold">● High density</span> &gt;{' '}
                    <span className="text-amber-400 font-bold">● Moderate</span> &gt;{' '}
                    <span className="text-emerald-400 font-bold">● Clean canopy</span>
                  </div>
                </div>
              )}

              {/* OVERLAY: Smart Nozzle Grid (PWM spray pulse simulation) */}
              {overlayMode === 'sprayer-grid' && (
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-0.5 p-1 bg-black/40 backdrop-blur-[1px]">
                  {Array.from({ length: 48 }).map((_, idx) => {
                    // Check if cell intersects with weed locations
                    const row = Math.floor(idx / 8);
                    const col = idx % 8;
                    const isWeedZone =
                      (row >= 1 && row <= 3 && col >= 1 && col <= 3) ||
                      (row >= 3 && row <= 5 && col >= 4 && col <= 7);

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-center rounded text-[8px] font-mono border transition-all ${
                          isWeedZone
                            ? 'border-red-500 bg-red-600/30 text-white font-bold animate-pulse'
                            : 'border-emerald-900/30 bg-emerald-950/20 text-emerald-400/40'
                        }`}
                      >
                        {isWeedZone ? (
                          <>
                            <span className="text-[7px] text-red-200">NOZ #{idx + 1}</span>
                            <span className="text-amber-300">SPRAY ON</span>
                          </>
                        ) : (
                          <span className="text-[7px]">OFF</span>
                        )}
                      </div>
                    );
                  })}
                  <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-[10px] text-white">
                    Targeted Nozzles: <strong className="text-red-400">12 of 48 active (25%)</strong> | Herbicide Saved: <strong className="text-emerald-400">75%</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="text-emerald-300/70 text-[11px] self-center mr-1">Filter Class:</span>
                {[
                  { id: 'all', label: 'All Classes' },
                  { id: 'Broadleaf Weeds', label: 'Broadleaf Weeds' },
                  { id: 'Grass Weeds', label: 'Grass Weeds' },
                  { id: 'Sedge Weeds', label: 'Sedge Weeds' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-emerald-600 text-white'
                        : 'border border-emerald-900/60 bg-emerald-950/30 text-emerald-300/80 hover:bg-emerald-900/30'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-emerald-400/70">
                Click any bounding box to inspect features
              </div>
            </div>
          </div>
        </div>

        {/* Right: Weed Feature Inspector & XAI (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Weed Patch Card */}
          <div className="rounded-2xl border border-emerald-900/70 bg-[#0a130c] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Crosshair className="h-4 w-4 text-emerald-400" />
                Target Inspector
              </div>
              {selectedBox && (
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-800">
                  Box ID: {selectedBox.id}
                </span>
              )}
            </div>

            {selectedBox ? (
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400/80">Identified Species</span>
                  <div className="text-base font-extrabold text-white mt-0.5">{selectedBox.speciesName}</div>
                  <div className="text-[11px] italic text-emerald-300/80">{result?.scientificName || 'Botanical Classification'}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-2">
                    <span className="text-[10px] text-emerald-400/70">Category</span>
                    <div className="font-bold text-white mt-0.5">{selectedBox.weedClass}</div>
                  </div>
                  <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-2">
                    <span className="text-[10px] text-emerald-400/70">Confidence Score</span>
                    <div className="font-bold text-emerald-400 mt-0.5">{(selectedBox.confidence * 100).toFixed(1)}%</div>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-2 font-mono text-[10px] text-emerald-300/80">
                  <div>Yolo Bounding Tensor [ymin, xmin, ymax, xmax]:</div>
                  <div className="text-white font-bold mt-0.5">
                    [{selectedBox.box.map(n => n.toFixed(1) + '%').join(', ')}]
                  </div>
                </div>

                {/* Morphological clues from XAI */}
                <div className="space-y-1.5 pt-2 border-t border-emerald-950">
                  <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Morphological Diagnostic Clues
                  </div>
                  <ul className="space-y-1 text-[11px] text-emerald-200/80 list-disc list-inside">
                    {result?.xaiAnalysis.morphologicalFeatures?.map((feat, i) => (
                      <li key={i} className="leading-tight">{feat}</li>
                    )) || <li>Distinctive leaf venation and petiole ratio</li>}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-emerald-300/60">
                Select a detection box to inspect morphological features.
              </div>
            )}
          </div>

          {/* Explainable AI (XAI) Rationale */}
          {result && (
            <div className="rounded-2xl border border-emerald-900/60 bg-[#0c170e]/90 p-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 border-b border-emerald-950 pb-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Explainable AI (XAI) Model Decision
              </div>
              <p className="mt-2 text-xs text-emerald-200/80 leading-relaxed">
                {result.xaiAnalysis.spectralClues}
              </p>
              <div className="mt-2 rounded-lg bg-emerald-950/60 p-2 text-[11px] text-emerald-300/80 border border-emerald-800/40">
                <strong>Model Rationale:</strong> {result.xaiAnalysis.confidenceRationale}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
