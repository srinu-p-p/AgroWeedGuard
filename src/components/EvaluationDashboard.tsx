import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Zap,
  CheckCircle,
  Table,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { EvaluationData } from '../types';

export const EvaluationDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ml' | 'object-detection' | 'confusion-matrix' | 'ai-assistant'>('ml');
  const [data, setData] = useState<EvaluationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/evaluation-metrics');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Failed to load evaluation metrics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!data && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-emerald-400">
        <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Loading Capstone Model Evaluation Data...
      </div>
    );
  }

  const mlModels = data?.classicalML || [];
  const dlModels = data?.deepLearning || [];
  const confusion = data?.confusionMatrix;
  const assistantScores = data?.aiAssistantEvaluation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-emerald-900/60 bg-[#0d1810]/80 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
                08
              </span>
              <h2 className="text-base font-bold text-white">
                Model Performance Evaluation & Benchmark Suite
              </h2>
            </div>
            <p className="text-xs text-emerald-300/60 mt-0.5">
              Modules 3, 4 & 8: Quantitative metrics for Classical ML, Deep Learning Object Detection, and LLM Assistant
            </p>
          </div>

          {/* Subtabs */}
          <div className="flex flex-wrap gap-1 rounded-xl border border-emerald-900/80 bg-emerald-950/40 p-1 text-xs">
            {[
              { id: 'ml', label: 'Classical ML (Mod 3)' },
              { id: 'object-detection', label: 'Deep Learning & YOLO (Mod 4)' },
              { id: 'confusion-matrix', label: 'Confusion Matrix' },
              { id: 'ai-assistant', label: 'AI Assistant Metrics' }
            ].map(tab => (
              <button
                key={tab.id}
                id={`eval-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-emerald-300/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: Classical Machine Learning */}
        {activeSubTab === 'ml' && (
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Classical ML Classification Algorithms (Module 3 Comparison)
              </h3>
              <span className="text-[11px] text-emerald-300/60">
                Evaluated on 4-class weed dataset (Broadleaf, Grass, Sedge, No Weed)
              </span>
            </div>

            {/* Metric Comparison Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mlModels.map(model => {
                const isChampion = model.model.includes('XGBoost');
                return (
                  <div
                    key={model.model}
                    className={`relative rounded-xl border p-4 shadow-md transition-all ${
                      isChampion
                        ? 'border-emerald-500 bg-emerald-950/60 ring-1 ring-emerald-500/40'
                        : 'border-emerald-900/50 bg-[#0c160f]/60'
                    }`}
                  >
                    {isChampion && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-emerald-950">
                        <Award className="h-3 w-3" /> Top Performer
                      </span>
                    )}
                    <div className="text-sm font-bold text-white">{model.model}</div>
                    <div className="text-[11px] text-emerald-400 font-mono">{model.type}</div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-emerald-200">
                          <span>Accuracy:</span>
                          <strong className="font-mono text-emerald-400">{(model.accuracy * 100).toFixed(1)}%</strong>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden mt-1">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${model.accuracy * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-center border-t border-emerald-950">
                        <div>
                          <div className="text-emerald-400/60">Prec.</div>
                          <div className="font-mono font-bold text-white">{(model.precision * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-emerald-400/60">Recall</div>
                          <div className="font-mono font-bold text-white">{(model.recall * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-emerald-400/60">F1</div>
                          <div className="font-mono font-bold text-emerald-400">{(model.f1Score * 100).toFixed(0)}%</div>
                        </div>
                      </div>

                      <div className="pt-2 text-[10px] text-emerald-300/70 border-t border-emerald-950">
                        <div>Latency: <strong>{model.inferenceLatencyMs} ms</strong> / sample</div>
                        <div className="truncate mt-0.5">Strength: {model.strengths}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Classical ML Detailed Table */}
            <div className="overflow-x-auto rounded-xl border border-emerald-900/60 bg-[#0a140d]">
              <table className="w-full text-left text-xs text-emerald-200">
                <thead className="bg-emerald-950/60 text-[11px] uppercase tracking-wider text-emerald-400">
                  <tr>
                    <th className="p-3">Model</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Precision</th>
                    <th className="p-3">Recall</th>
                    <th className="p-3">F1-Score</th>
                    <th className="p-3">Latency (ms)</th>
                    <th className="p-3">Agronomic Suitability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950">
                  {mlModels.map(m => (
                    <tr key={m.model} className="hover:bg-emerald-950/30">
                      <td className="p-3 font-semibold text-white">{m.model}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="p-3 font-mono">{(m.precision * 100).toFixed(1)}%</td>
                      <td className="p-3 font-mono">{(m.recall * 100).toFixed(1)}%</td>
                      <td className="p-3 font-mono text-emerald-300">{(m.f1Score * 100).toFixed(1)}%</td>
                      <td className="p-3 font-mono">{m.inferenceLatencyMs} ms</td>
                      <td className="p-3 text-[11px] text-emerald-300/80">{m.strengths}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Deep Learning & Object Detection */}
        {activeSubTab === 'object-detection' && (
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Deep Learning & Object Detection Architectures (Module 4 & 5)
              </h3>
              <span className="text-[11px] text-emerald-300/60">
                Evaluated on mAP@0.5, Intersection over Union (IoU) & Frames-per-second (FPS)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dlModels.map(arch => {
                const isYOLO = arch.architecture.includes('YOLO');
                return (
                  <div
                    key={arch.architecture}
                    className={`rounded-xl border p-4 shadow-md transition-all ${
                      isYOLO
                        ? 'border-emerald-500 bg-emerald-950/70 ring-1 ring-emerald-500/50'
                        : 'border-emerald-900/50 bg-[#0c160f]/60'
                    }`}
                  >
                    {isYOLO && (
                      <span className="inline-block rounded bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-emerald-950 mb-2">
                        Real-Time Tractor Edge Optimal
                      </span>
                    )}
                    <div className="text-sm font-bold text-white leading-tight">{arch.architecture}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{arch.task}</div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-emerald-200">
                          <span>mAP @ 0.50:</span>
                          <strong className="font-mono text-emerald-400">{(arch.mAP * 100).toFixed(1)}%</strong>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden mt-1">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${arch.mAP * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] border-t border-emerald-950">
                        <div className="rounded bg-black/30 p-1.5 text-center">
                          <div className="text-emerald-400/60">IoU Score</div>
                          <div className="font-mono font-bold text-white">{(arch.iou * 100).toFixed(1)}%</div>
                        </div>
                        <div className="rounded bg-black/30 p-1.5 text-center">
                          <div className="text-emerald-400/60">Inference Speed</div>
                          <div className="font-mono font-bold text-emerald-400">{arch.fps} FPS</div>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-300/70">
                        <span>Weights: {arch.modelSizeMB} MB</span>
                        <span className={arch.edgeDeployable ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                          {arch.edgeDeployable ? '✓ Edge Ready' : 'Cloud GPU only'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Confusion Matrix */}
        {activeSubTab === 'confusion-matrix' && confusion && (
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Multi-Class Confusion Matrix (Module 3 & 4 Validation)
              </h3>
              <span className="text-[11px] text-emerald-300/60">
                Rows: Ground Truth Actual Classes | Columns: AgroWeedGuard Model Predictions
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-emerald-900/60 bg-[#08120a] p-4">
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                <div className="p-2 font-sans font-bold text-emerald-400 text-left">
                  Actual \ Predicted
                </div>
                {confusion.classes.map(c => (
                  <div key={c} className="p-2 font-bold text-emerald-300 truncate bg-emerald-950/40 rounded">
                    {c.split(' ')[0]}
                  </div>
                ))}

                {confusion.matrix.map((row, rowIdx) => {
                  const actualClass = confusion.classes[rowIdx];
                  const rowSum = row.reduce((a, b) => a + b, 0);

                  return (
                    <React.Fragment key={rowIdx}>
                      <div className="p-2.5 font-bold text-emerald-200 text-left truncate flex items-center">
                        {actualClass}
                      </div>
                      {row.map((cellValue, colIdx) => {
                        const isDiagonal = rowIdx === colIdx;
                        const cellPercent = ((cellValue / rowSum) * 100).toFixed(0);

                        return (
                          <div
                            key={colIdx}
                            className={`flex flex-col items-center justify-center rounded-lg p-2 transition-all ${
                              isDiagonal
                                ? 'bg-emerald-600/40 text-emerald-200 border border-emerald-500/60 font-bold'
                                : cellValue > 10
                                ? 'bg-amber-950/30 text-amber-200/90 border border-amber-900/30'
                                : 'bg-black/40 text-neutral-400'
                            }`}
                          >
                            <span className="text-sm font-extrabold">{cellValue}</span>
                            <span className="text-[10px] text-emerald-400/80">{cellPercent}%</span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-emerald-300/70 pt-3 border-t border-emerald-950">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-emerald-600/60 border border-emerald-400" />
                  <span>Diagonal: Correct Classifications (True Positives)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-amber-950/60 border border-amber-800" />
                  <span>Off-Diagonal: Minor Inter-Class Confusion (e.g. Grass vs Sedge early seedlings)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI Assistant Evaluation */}
        {activeSubTab === 'ai-assistant' && assistantScores && (
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Module 7 AI Assistant Human Agronomist Evaluation
              </h3>
              <span className="text-[11px] text-emerald-300/60">
                Assessed across 250 agronomic test cases for explainability, accuracy & safety
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-emerald-900/50 bg-[#0c160f]/80 p-4">
                <span className="text-xs text-emerald-400/80 font-bold uppercase">Recommendation Accuracy</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    {assistantScores.recommendationAccuracyPercent}%
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/70 mt-1">
                  Chemical compatibility and correct dosage alignment with extension guidelines.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-900/50 bg-[#0c160f]/80 p-4">
                <span className="text-xs text-emerald-400/80 font-bold uppercase">Explainability (XAI) Score</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400">
                    {assistantScores.explainabilityScoreOut5}
                  </span>
                  <span className="text-xs text-emerald-200">/ 5.0</span>
                </div>
                <p className="text-[11px] text-emerald-300/70 mt-1">
                  Clarity of morphological identification reasons communicated to farmers.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-900/50 bg-[#0c160f]/80 p-4">
                <span className="text-xs text-emerald-400/80 font-bold uppercase">Response Quality Score</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400">
                    {assistantScores.responseQualityScoreOut5}
                  </span>
                  <span className="text-xs text-emerald-200">/ 5.0</span>
                </div>
                <p className="text-[11px] text-emerald-300/70 mt-1">
                  Coherence, safety precautions, and multilingual agricultural fidelity.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-900/50 bg-[#0c160f]/80 p-4">
                <span className="text-xs text-emerald-400/80 font-bold uppercase">Average Query Latency</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    {assistantScores.averageLatencySeconds}s
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/70 mt-1">
                  Rapid token generation via Gemini 3.8 Flash multi-turn streaming.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
