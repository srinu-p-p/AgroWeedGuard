import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  DollarSign,
  Droplets,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sliders,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Leaf,
  Layers,
  Wrench,
  Download
} from 'lucide-react';
import { WeedDetectionResult } from '../types';

interface SmartRemovalEngineProps {
  result: WeedDetectionResult | null;
  onExportReport: () => void;
}

export const SmartRemovalEngine: React.FC<SmartRemovalEngineProps> = ({
  result,
  onExportReport
}) => {
  const [plotAreaAcres, setPlotAreaAcres] = useState<number>(5.0);
  const [tractorSpeedKmH, setTractorSpeedKmH] = useState<number>(7.5);
  const [sprayPressurePsi, setSprayPressurePsi] = useState<number>(35);

  if (!result) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-900/60 bg-[#0c160f]/60 p-8 text-center backdrop-blur-sm">
        <Target className="h-12 w-12 text-emerald-500/60 mb-3" />
        <h3 className="text-base font-bold text-white">Smart Weed Removal Engine Awaiting Detection Data</h3>
        <p className="max-w-md text-xs text-emerald-300/70 mt-1">
          Perform weed detection in the Field Vision module first to generate side-by-side Rule-Based vs AI Smart Removal prescriptions.
        </p>
      </div>
    );
  }

  const { ruleBasedRecommendation: rule, aiSmartRecommendation: smart } = result;

  // Compute calculated metrics for farmer's farm size
  const totalRuleChemicalCost = (rule.estCostPerAcre * plotAreaAcres).toFixed(2);
  const totalSmartChemicalCost = ((rule.estCostPerAcre - smart.savedCostPerAcre) * plotAreaAcres).toFixed(2);
  const totalSavedDollars = (smart.savedCostPerAcre * plotAreaAcres).toFixed(2);
  const totalSavedChemicalLiters = (smart.savedChemicalLiters * (plotAreaAcres / 2.5)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/60 bg-[#0d1810]/80 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
                06
              </span>
              <h2 className="text-base font-bold text-white">
                Smart Weed Removal & Precision Spray Planning Engine
              </h2>
            </div>
            <p className="text-xs text-emerald-300/60 mt-0.5">
              Module 6: Comparative evaluation of Conventional Broadcast vs AI-Directed Precision Spot Treatment
            </p>
          </div>

          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950 hover:bg-emerald-500"
          >
            <Download className="h-3.5 w-3.5" /> Download Treatment Prescription PDF
          </button>
        </div>

        {/* Dynamic Farmer Plot Size & Sprayer Config */}
        <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3 sm:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-emerald-300">Farmer Plot Size (Acres):</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min="0.5"
                max="500"
                step="0.5"
                value={plotAreaAcres}
                onChange={e => setPlotAreaAcres(parseFloat(e.target.value) || 1)}
                className="w-24 rounded-lg border border-emerald-800 bg-black/50 px-2.5 py-1 text-xs text-white font-mono"
              />
              <span className="text-xs text-emerald-400">acres total</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-emerald-300">Sprayer Boom Speed:</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min="4"
                max="18"
                step="0.5"
                value={tractorSpeedKmH}
                onChange={e => setTractorSpeedKmH(parseFloat(e.target.value) || 7)}
                className="w-20 rounded-lg border border-emerald-800 bg-black/50 px-2.5 py-1 text-xs text-white font-mono"
              />
              <span className="text-xs text-emerald-400">km/h forward</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-emerald-300">Nozzle Operating Pressure:</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min="20"
                max="60"
                step="5"
                value={sprayPressurePsi}
                onChange={e => setSprayPressurePsi(parseInt(e.target.value) || 35)}
                className="w-20 rounded-lg border border-emerald-800 bg-black/50 px-2.5 py-1 text-xs text-white font-mono"
              />
              <span className="text-xs text-emerald-400">PSI (Coarse Droplet)</span>
            </div>
          </div>
        </div>

        {/* Savings Big Metric Cards */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 to-green-950/40 p-4 shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase">
              <TrendingDown className="h-4 w-4 text-emerald-400" /> Chemical Herbicide Saved
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400">
                {smart.targetedSprayingReductionPercent}%
              </span>
              <span className="text-xs text-emerald-200">reduction</span>
            </div>
            <p className="text-[11px] text-emerald-300/70 mt-1">
              Eliminates ~{totalSavedChemicalLiters} Liters of chemical herbicide from leaching into farm soil.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 to-green-950/40 p-4 shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase">
              <DollarSign className="h-4 w-4 text-emerald-400" /> Direct Cost Savings
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400">
                ${totalSavedDollars}
              </span>
              <span className="text-xs text-emerald-200">USD saved</span>
            </div>
            <p className="text-[11px] text-emerald-300/70 mt-1">
              Reduces total chemical bill from ${totalRuleChemicalCost} down to ${totalSmartChemicalCost}.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 to-green-950/40 p-4 shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase">
              <Leaf className="h-4 w-4 text-emerald-400" /> Environmental Protection
            </div>
            <div className="mt-2 text-sm font-bold text-white">
              {smart.ecoImpact}
            </div>
            <p className="text-[11px] text-emerald-300/70 mt-1">
              Re-entry & grazing safety interval: <strong>{smart.safetyIntervalDays} days</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Rule-Based vs AI Smart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Conventional Rule-Based Strategy */}
        <div className="rounded-2xl border border-red-950/70 bg-[#160c0c]/80 p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-red-950 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-red-950 p-1 text-red-400 border border-red-800">
                <AlertCircle className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-red-200">
                Method A: Rule-Based Conventional Broadcast
              </h3>
            </div>
            <span className="rounded bg-red-950/90 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-900">
              High Waste
            </span>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-red-400/80">Application Protocol</span>
              <div className="font-semibold text-white mt-0.5">{rule.action}</div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-red-400/80">Chemical & Dosage</span>
              <div className="font-semibold text-red-200 mt-0.5">{rule.herbicide}</div>
              <div className="text-[11px] text-red-300/70 mt-0.5">{rule.broadcastDosage}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-2.5">
                <span className="text-[10px] text-red-400/80">Water Carrier Volume</span>
                <div className="font-bold text-white mt-0.5">{rule.waterVolume}</div>
              </div>
              <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-2.5">
                <span className="text-[10px] text-red-400/80">Cost per Acre</span>
                <div className="font-bold text-white mt-0.5">${rule.estCostPerAcre.toFixed(2)}</div>
              </div>
            </div>

            <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-3 text-[11px] text-red-300/80 leading-relaxed">
              <strong>Drawbacks of Conventional Broadcast:</strong>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Sprays 100% of field surface regardless of whether weeds exist in that quadrant.</li>
                <li>Accelerates glyphosate and herbicide chemical resistance mutations.</li>
                <li>Excess herbicide runoff contaminates farm water tables and beneficial soil microbes.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: AI-Based Smart Recommendation */}
        <div className="rounded-2xl border border-emerald-500/60 bg-[#0c1a11]/90 p-5 shadow-xl ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-950 p-1 text-emerald-400 border border-emerald-700">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-emerald-200">
                Method B: AgroWeedGuard AI Precision Spot Treatment
              </h3>
            </div>
            <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-emerald-950 shadow">
              Recommended
            </span>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400/80">Precision Protocol</span>
              <div className="font-semibold text-white mt-0.5">{smart.action}</div>
              <div className="text-[11px] text-emerald-300/80 mt-0.5">{smart.precisionMethod}</div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400/80">Micro-Dosed Selective Chemistry</span>
              <div className="font-semibold text-emerald-300 mt-0.5">{smart.selectiveChemical}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-emerald-800/60 bg-emerald-950/40 p-2.5">
                <span className="text-[10px] text-emerald-400/80">Chemical Saved</span>
                <div className="font-bold text-emerald-400 mt-0.5">{smart.targetedSprayingReductionPercent}% Saved</div>
              </div>
              <div className="rounded-lg border border-emerald-800/60 bg-emerald-950/40 p-2.5">
                <span className="text-[10px] text-emerald-400/80">Cost Reduction</span>
                <div className="font-bold text-emerald-400 mt-0.5">-${smart.savedCostPerAcre.toFixed(2)} / acre</div>
              </div>
            </div>

            {/* Cultural / Non-chemical practice */}
            <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-3 text-[11px] text-emerald-200/90 leading-relaxed">
              <strong className="text-emerald-300 flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-emerald-400" /> Integrated Weed Management (IWM) Alternative:
              </strong>
              <p className="mt-1">{smart.culturalAlternative}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Planning & Execution Roadmap */}
      <div className="rounded-2xl border border-emerald-900/60 bg-[#0d1810]/80 p-5 shadow-xl backdrop-blur-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-emerald-950 pb-2.5">
          <Calendar className="h-4 w-4 text-emerald-400" />
          Field Treatment Action Plan & Sprayer Calibration
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 text-xs">
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Phase 1: Timing</span>
            <div className="font-bold text-white mt-1">Immediate (Next 48 Hrs)</div>
            <p className="text-[11px] text-emerald-300/70 mt-1">
              Weeds are young (&lt; 3 inches), before deep taproot lignification occurs.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Phase 2: Equipment</span>
            <div className="font-bold text-white mt-1">TeeJet AIXR 11003</div>
            <p className="text-[11px] text-emerald-300/70 mt-1">
              Air-induction nozzle generating 400μm droplets to eliminate aerial drift.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Phase 3: Weather Window</span>
            <div className="font-bold text-white mt-1">6:00 AM - 9:30 AM</div>
            <p className="text-[11px] text-emerald-300/70 mt-1">
              Temperature &lt; 29°C, Relative Humidity &gt; 50%, wind speed &lt; 9 km/h.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Phase 4: Verification</span>
            <div className="font-bold text-white mt-1">Drone Audit at 7 DAS</div>
            <p className="text-[11px] text-emerald-300/70 mt-1">
              Re-scan the field with AgroWeedGuard to confirm weed necrosis and mortality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
