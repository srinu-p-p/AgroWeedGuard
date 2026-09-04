import React from 'react';
import {
  FileText,
  Printer,
  X,
  CheckCircle,
  AlertTriangle,
  Leaf,
  ShieldCheck,
  Calendar,
  MapPin,
  TrendingDown
} from 'lucide-react';
import { WeedDetectionResult } from '../types';

interface TreatmentReportModalProps {
  result: WeedDetectionResult | null;
  onClose: () => void;
}

export const TreatmentReportModal: React.FC<TreatmentReportModalProps> = ({
  result,
  onClose
}) => {
  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-2xl border border-emerald-800 bg-[#0d1810] p-6 text-emerald-100 shadow-2xl">
        {/* Top actions bar */}
        <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">AgroWeedGuard Official Agronomic Prescription</h3>
              <p className="text-[11px] text-emerald-300/60">Document ID: AWG-TRT-{result.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-500"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-neutral-400 hover:bg-emerald-950 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div id="printable-report" className="mt-4 space-y-4 text-xs">
          {/* Farm & Metadata header */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-3.5 sm:grid-cols-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-emerald-400">Crop Cultivar</span>
              <div className="font-bold text-white mt-0.5">{result.cropInfo.cropType}</div>
              <div className="text-[10px] text-emerald-300/70">{result.cropInfo.growthStage}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-emerald-400">Field Location</span>
              <div className="font-bold text-white mt-0.5">{result.cropInfo.fieldLocation}</div>
              <div className="text-[10px] text-emerald-300/70">Plot: {result.cropInfo.plotSizeAcres} Acres</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-emerald-400">Soil & Weather</span>
              <div className="font-bold text-white mt-0.5">{result.cropInfo.soilType}</div>
              <div className="text-[10px] text-emerald-300/70">{result.cropInfo.weatherCondition}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-emerald-400">Audit Timestamp</span>
              <div className="font-bold text-white mt-0.5">{result.timestamp}</div>
              <div className="text-[10px] text-emerald-400 font-mono">Engine: {result.selectedModel}</div>
            </div>
          </div>

          {/* Vision Diagnosis */}
          <div className="rounded-xl border border-emerald-900/60 bg-[#0a140d] p-3.5">
            <h4 className="font-bold text-emerald-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Agronomic Computer Vision Diagnosis
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <span className="text-[10px] text-emerald-400/80">Identified Weed Species:</span>
                <div className="text-sm font-extrabold text-white mt-0.5">{result.primarySpecies}</div>
                <div className="text-[10px] italic text-emerald-300/70">{result.scientificName}</div>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400/80">Weed Category:</span>
                <div className="text-sm font-bold text-white mt-0.5">{result.primaryWeedCategory}</div>
                <div className="text-[10px] text-emerald-300/70">Severity: {result.severityLevel}</div>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400/80">Canopy Infestation Density:</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{result.infestationDensityPercent}% of plot</div>
                <div className="text-[10px] text-emerald-300/70">{result.detectedWeedsCount} distinct weed clusters</div>
              </div>
            </div>
          </div>

          {/* Prescriptions Comparison */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Conventional */}
            <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-3">
              <span className="text-[10px] uppercase font-bold text-red-400">Conventional Broadcast Baseline</span>
              <div className="font-bold text-white mt-1">{result.ruleBasedRecommendation.herbicide}</div>
              <div className="text-[11px] text-red-200/80 mt-1">
                Dosage: {result.ruleBasedRecommendation.broadcastDosage}
              </div>
              <div className="text-[11px] text-red-200/80">
                Water Carrier: {result.ruleBasedRecommendation.waterVolume}
              </div>
              <div className="text-[11px] font-bold text-red-300 mt-2">
                Cost: ~${result.ruleBasedRecommendation.estCostPerAcre} / acre
              </div>
            </div>

            {/* Smart AI Spot */}
            <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/40 p-3">
              <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> Recommended AgroWeedGuard AI Plan
              </span>
              <div className="font-bold text-white mt-1">{result.aiSmartRecommendation.selectiveChemical}</div>
              <div className="text-[11px] text-emerald-200 mt-1">
                Protocol: {result.aiSmartRecommendation.precisionMethod}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Herbicide Saved: {result.aiSmartRecommendation.targetedSprayingReductionPercent}%</span>
                <span>Savings: ${result.aiSmartRecommendation.savedCostPerAcre} / acre</span>
              </div>
            </div>
          </div>

          {/* Safety & Cultural Management */}
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-3.5 space-y-2">
            <h4 className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Application Safety & Cultural Guidance
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-[11px]">
              <div>
                <strong>Re-entry Interval (REI):</strong> {result.aiSmartRecommendation.safetyIntervalDays} days before cattle grazing or unequipped entry.
              </div>
              <div>
                <strong>Spray Window:</strong> Early morning (wind &lt; 9 km/h, RH &gt; 50%) with Air-Induction nozzles.
              </div>
            </div>
            <div className="pt-1 text-[11px] text-emerald-200/80">
              <strong>Cultural Recommendation:</strong> {result.aiSmartRecommendation.culturalAlternative}
            </div>
          </div>

          {/* Signoff */}
          <div className="flex items-center justify-between border-t border-emerald-950 pt-3 text-[10px] text-emerald-400/60">
            <div>Verified by AgroWeedGuard Autonomous Agronomy Intelligence v2.5</div>
            <div className="font-mono">STATUS: VALIDATED & EXPORT READY</div>
          </div>
        </div>
      </div>
    </div>
  );
};
