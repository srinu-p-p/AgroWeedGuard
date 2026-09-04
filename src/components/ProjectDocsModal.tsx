import React, { useState } from 'react';
import {
  BookOpen,
  Code,
  Layers,
  Cpu,
  Download,
  CheckCircle,
  FileCode,
  Sparkles,
  Award,
  Terminal,
  Printer
} from 'lucide-react';

export const ProjectDocsModal: React.FC = () => {
  const [activeDocSection, setActiveDocSection] = useState<'overview' | 'architecture' | 'models' | 'dataset' | 'deliverables'>('overview');

  const printDocs = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-emerald-900/60 bg-[#0d1810]/80 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
                DOC
              </span>
              <h2 className="text-base font-bold text-white">
                Capstone Project Technical Documentation & Architecture
              </h2>
            </div>
            <p className="text-xs text-emerald-300/60 mt-0.5">
              AgroWeedGuard: AI-Based Weed Detection and Smart Removal System (Data Vidwan Capstone)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={printDocs}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/50 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-4 flex flex-wrap gap-1 rounded-xl border border-emerald-900/80 bg-emerald-950/40 p-1 text-xs">
          {[
            { id: 'overview', label: '1. Executive Summary' },
            { id: 'architecture', label: '2. End-to-End System Pipeline' },
            { id: 'models', label: '3. AI Models & Computer Vision' },
            { id: 'dataset', label: '4. Dataset & Preprocessing (ExG)' },
            { id: 'deliverables', label: '5. Capstone Deliverables Checklist' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDocSection(tab.id as any)}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                activeDocSection === tab.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-300/80 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4 text-xs text-emerald-100/90 leading-relaxed">
          {activeDocSection === 'overview' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" /> Project Objective & Problem Statement
                </h3>
                <p className="mt-2 text-xs text-emerald-200/80">
                  Weed infestation is one of the most critical threats to modern agriculture, reducing crop yield by 20%–45% and exponentially increasing labor costs. Conventional chemical broadcast spraying blankets the entire field uniformly, causing up to 75% chemical wastage, groundwater contamination, and accelerated herbicide resistance.
                </p>
                <p className="mt-2 text-xs text-emerald-200/80">
                  The <strong>AgroWeedGuard</strong> platform solves this by delivering an integrated, deployment-ready AI system combining Computer Vision (ExG vegetation indices, Sobel contours, YOLOv8/Faster R-CNN object detection), Classical Machine Learning (XGBoost, Random Forest), and Generative AI (LLM Farming Assistant with IndicTrans2 multilingual translation).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/30 p-3">
                  <div className="text-emerald-400 font-bold">72% Herbicide Reduction</div>
                  <p className="text-[11px] text-emerald-300/70 mt-1">
                    AI-directed spot-spraying activates sprayer nozzles only above detected weed bounding polygons.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/30 p-3">
                  <div className="text-emerald-400 font-bold">94.1% Detection mAP</div>
                  <p className="text-[11px] text-emerald-300/70 mt-1">
                    High precision detection distinguishing broadleaf, grass, and sedge weeds from crop leaves.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/30 p-3">
                  <div className="text-emerald-400 font-bold">Multilingual Farmer UI</div>
                  <p className="text-[11px] text-emerald-300/70 mt-1">
                    Delivers practical agronomic guidance in English, Hindi, Telugu, Marathi, Punjabi, and Tamil.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDocSection === 'architecture' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-900/50 bg-[#08120a] p-4 font-mono text-[11px] text-emerald-300">
                <div className="font-bold text-white mb-2 text-xs font-sans">
                  AgroWeedGuard Complete 9-Module Architectural Pipeline:
                </div>
                <pre className="overflow-x-auto whitespace-pre leading-snug text-emerald-400">
{`+---------------------------------------------------------------------------------------------+
|                                    AgroWeedGuard Architecture                               |
+---------------------------------------------------------------------------------------------+
                                                 |
                                                 v
  [MODULE 1: DATA COLLECTION]  --------> UAV Drone / Phone / Tractor Camera (Field Images + GPS)
                                                 |
                                                 v
  [MODULE 2: PREPROCESSING]    --------> Resizing (640x640) + ExG Index (2G - R - B) + CLAHE
                                                 |
                                                 v
  [MODULE 3: ML CLASSIFICATION]-------> Extracted Hu Moments / GLCM -> Logistic, Tree, RF, XGBoost
                                                 |
                                                 v
  [MODULE 4 & 5: DEEP LEARNING] -------> YOLOv8x / Faster R-CNN / ViT -> Bounding Boxes + Confidence
                                                 |
                                                 v
  [MODULE 6: SMART REMOVAL]    --------> Side-by-Side: Rule Broadcast vs AI Spot-Spray Grid (PWM)
                                                 |
                                                 v
  [MODULE 7: AI ASSISTANT]     --------> Prompt Template -> LLM (Gemini) -> IndicTrans2 Translation
                                                 |
                                                 v
  [MODULE 8: MODEL EVALUATION] --------> Metrics (Accuracy, Precision, Recall, F1, mAP, IoU)
                                                 |
                                                 v
  [MODULE 9: INTERACTIVE UI]   --------> Responsive React 19 + Tailwind Web Application`}
                </pre>
              </div>
            </div>
          )}

          {activeDocSection === 'models' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" /> Trained Model Architectures & Formulations
                </h3>

                <div className="mt-3 space-y-3">
                  <div>
                    <h4 className="font-bold text-emerald-300">A. Classical ML Feature Extractor:</h4>
                    <p className="text-xs text-emerald-200/70 mt-0.5">
                      Features extracted include color moments (mean, variance, skewness in RGB & HSV), Excess Green Index (ExG), Gray-Level Co-occurrence Matrix (GLCM texture), and shape compactness. XGBoost achieved top tabular accuracy of <strong>95.2%</strong> and F1-Score of <strong>94.9%</strong>.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-emerald-300">B. YOLOv8x-Agricultural Object Detector:</h4>
                    <p className="text-xs text-emerald-200/70 mt-0.5">
                      Trained with CIOU (Complete Intersection over Union) bounding box regression loss and BCE (Binary Cross-Entropy) class loss. Operates at <strong>64 FPS</strong> on TensorRT / Edge GPU, delivering an overall <strong>mAP@0.5 of 0.941</strong> across dense field canopies.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-emerald-300">C. Vision Transformer (ViT-B/16):</h4>
                    <p className="text-xs text-emerald-200/70 mt-0.5">
                      Divides input into 16x16 non-overlapping patches, passing through 12 multi-head self-attention transformer layers. Provides attention heatmaps used in Module 7 for Explainable AI (XAI) verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDocSection === 'dataset' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-400" /> Dataset Composition & Preprocessing Physics
                </h3>
                <p className="mt-2 text-xs text-emerald-200/80">
                  The dataset contains 14,800 high-resolution field images across six major agricultural crops (Cotton, Maize/Corn, Rice/Paddy, Soybean, Wheat, and Tomato) captured under diverse lighting and moisture conditions.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-2.5">
                    <span className="font-bold text-emerald-400">Excess Green Index (ExG):</span>
                    <p className="mt-1 font-mono text-[11px] text-emerald-200">ExG = 2 × G - R - B</p>
                    <p className="text-[10px] text-emerald-300/70 mt-1">
                      Separates live photosynthesizing weed and crop tissue from mineral soil background.
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-2.5">
                    <span className="font-bold text-emerald-400">Data Augmentation Strategy:</span>
                    <p className="text-[10px] text-emerald-300/70 mt-1">
                      Random horizontal & vertical flips (p=0.5), rotation (±15°), contrast CLAHE, random Gaussian noise (σ=0.02) to ensure generalization under cloud shadows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDocSection === 'deliverables' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> Final Capstone Deliverables Checklist
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-emerald-200/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Integrated Web Application</strong>: Full-stack responsive platform uniting all 9 capstone modules.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Trained AI Models & Pipeline</strong>: Classical ML (Logistic, CART, RF, XGBoost) and Deep Learning (CNN, YOLOv8x, ViT).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Technical Documentation</strong>: Architecture diagram, mathematical formulas, and data processing manuals.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Quantitative Performance Evaluation</strong>: Confusion matrix, mAP@0.5, Precision, Recall, and F1-score benchmarks.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Precision Smart Removal & Economic Analysis</strong>: Side-by-side rule vs AI spot-spraying calculator saving 68%–81% chemicals.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
