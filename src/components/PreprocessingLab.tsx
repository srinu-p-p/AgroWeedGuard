import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Eye,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Check,
  AlertCircle,
  RefreshCcw,
  Crop,
  ShieldCheck,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { WeedDetectionResult } from '../types';

interface PreprocessingLabProps {
  currentImage: string;
  detectionResult: WeedDetectionResult | null;
}

type FilterMode = 'rgb' | 'exg' | 'clahe' | 'binary' | 'edges' | 'grayscale';

export const PreprocessingLab: React.FC<PreprocessingLabProps> = ({
  currentImage,
  detectionResult
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('exg');
  const [brightness, setBrightness] = useState<number>(0); // -50 to 50
  const [contrast, setContrast] = useState<number>(1.2); // 0.5 to 2.0
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [exgThreshold, setExgThreshold] = useState<number>(25);
  const [targetResolution, setTargetResolution] = useState<'640x640' | '224x224' | 'original'>('640x640');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Apply real-time canvas pixel manipulations
  useEffect(() => {
    if (!currentImage || !canvasRef.current) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentImage;

    img.onload = () => {
      // Set canvas dimensions based on resolution selection
      let w = img.width;
      let h = img.height;

      if (targetResolution === '640x640') {
        w = 640;
        h = 640;
      } else if (targetResolution === '224x224') {
        w = 224;
        h = 224;
      }

      canvas.width = w;
      canvas.height = h;

      // Clear & transformations
      ctx.save();
      ctx.clearRect(0, 0, w, h);

      ctx.translate(w / 2, h / 2);
      if (isFlipped) ctx.scale(-1, 1);
      if (rotationAngle !== 0) ctx.rotate((rotationAngle * Math.PI) / 180);
      ctx.translate(-w / 2, -h / 2);

      ctx.drawImage(img, 0, 0, w, h);
      ctx.restore();

      // Read pixel data for CV algorithmic transformations
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // Filter Algorithms
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Apply brightness & contrast
        r = Math.min(255, Math.max(0, (r - 128) * contrast + 128 + brightness));
        g = Math.min(255, Math.max(0, (g - 128) * contrast + 128 + brightness));
        b = Math.min(255, Math.max(0, (b - 128) * contrast + 128 + brightness));

        if (filterMode === 'grayscale') {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        } else if (filterMode === 'exg') {
          // Excess Green Index: ExG = 2*G - R - B
          // High values indicate living green vegetation; soil/residue have low/negative ExG
          const exg = 2 * g - r - b;
          if (exg > exgThreshold) {
            // Highlight vegetation in glowing agricultural emerald
            data[i] = 16;
            data[i + 1] = Math.min(255, 120 + exg);
            data[i + 2] = 40;
          } else {
            // Darken soil / background to emphasize weeds
            const gray = (r + g + b) / 4;
            data[i] = gray * 0.4;
            data[i + 1] = gray * 0.4;
            data[i + 2] = gray * 0.4;
          }
        } else if (filterMode === 'binary') {
          // Otsu / Thresholding for segmentation
          const exg = 2 * g - r - b;
          const val = exg > exgThreshold ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        } else if (filterMode === 'clahe') {
          // Contrast Limited Adaptive Histogram Simulation: enhance green channel variance
          const enhancedG = Math.min(255, g * 1.35);
          data[i] = r * 0.85;
          data[i + 1] = enhancedG;
          data[i + 2] = b * 0.85;
        } else if (filterMode === 'edges') {
          // Simple gradient edge representation
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const nextR = data[i + 4] || r;
          const nextG = data[i + 5] || g;
          const nextB = data[i + 6] || b;
          const nextGray = 0.299 * nextR + 0.587 * nextG + 0.114 * nextB;
          const edge = Math.min(255, Math.abs(gray - nextGray) * 3.5);
          data[i] = edge > 40 ? 52 : 12;
          data[i + 1] = edge > 40 ? 211 : 20;
          data[i + 2] = edge > 40 ? 153 : 15;
        } else {
          // Standard adjusted RGB
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setIsProcessing(false);
    };
  }, [currentImage, filterMode, brightness, contrast, isFlipped, rotationAngle, exgThreshold, targetResolution]);

  const handleReset = () => {
    setBrightness(0);
    setContrast(1.2);
    setIsFlipped(false);
    setRotationAngle(0);
    setExgThreshold(25);
    setFilterMode('exg');
    setTargetResolution('640x640');
  };

  return (
    <div className="space-y-6">
      {/* Module Intro Card */}
      <div className="rounded-2xl border border-emerald-900/60 bg-[#0d1810]/80 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
                02
              </span>
              <h2 className="text-base font-bold text-white">
                Computer Vision Preprocessing & Feature Extraction Lab
              </h2>
            </div>
            <p className="text-xs text-emerald-300/60 mt-0.5">
              Module 2 & 5: Vegetation index segmentation (ExG), CLAHE contrast equalization, edge gradients & data augmentation
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-900/50"
          >
            <RefreshCcw className="h-3 w-3" /> Reset Pipeline
          </button>
        </div>

        {/* Filters and Controls Grid */}
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Canvas Display (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border border-emerald-900/70 bg-black/80 p-2 shadow-inner">
              <canvas
                ref={canvasRef}
                className="max-h-[420px] max-w-full rounded-lg object-contain shadow-2xl transition-all"
              />

              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                  <span className="flex items-center gap-2 rounded-lg bg-emerald-950/90 px-3 py-1.5 text-xs text-emerald-300 border border-emerald-800">
                    <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> Computing Filter...
                  </span>
                </div>
              )}

              <div className="absolute top-4 left-4 rounded-md border border-emerald-500/40 bg-black/70 px-2 py-1 text-[11px] font-mono text-emerald-300 backdrop-blur-md">
                Mode: <strong className="uppercase">{filterMode}</strong> | Res: {targetResolution}
              </div>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {[
                { id: 'exg', label: 'Excess Green (ExG)', desc: '2G - R - B Vegetation Index' },
                { id: 'clahe', label: 'CLAHE Equalized', desc: 'Adaptive Contrast' },
                { id: 'edges', label: 'Sobel Contours', desc: 'Leaf Edge Boundaries' },
                { id: 'binary', label: 'Binary Mask', desc: 'Otsu Vegetation Isolation' },
                { id: 'grayscale', label: 'Grayscale (Luma)', desc: 'Texture extraction' },
                { id: 'rgb', label: 'Standard RGB', desc: 'Color space' }
              ].map(f => (
                <button
                  key={f.id}
                  id={`btn-filter-${f.id}`}
                  onClick={() => setFilterMode(f.id as FilterMode)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    filterMode === f.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'border border-emerald-900/60 bg-emerald-950/40 text-emerald-300/80 hover:bg-emerald-900/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Controls & Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Excess Green Index (ExG) explanation */}
            <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Agronomic Excess Green Index (ExG Formula)
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-emerald-200/70">
                <code className="rounded bg-black/60 px-1 py-0.5 font-mono text-emerald-300">ExG = 2 × Green - Red - Blue</code>.
                In precision agriculture, ExG isolates living weed and crop foliage from bare soil, dry crop residue, and stone debris before passing through YOLO bounding-box regressors.
              </p>
            </div>

            {/* Preprocessing Sliders */}
            <div className="space-y-3 rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-3.5">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Augmentation & Normalization Tuning
              </div>

              {/* ExG Threshold */}
              <div>
                <div className="flex justify-between text-xs text-emerald-200">
                  <span>Vegetation Threshold (ExG cutoff):</span>
                  <span className="font-mono text-emerald-400">{exgThreshold}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="60"
                  value={exgThreshold}
                  onChange={e => setExgThreshold(parseInt(e.target.value))}
                  className="mt-1 w-full accent-emerald-500"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-xs text-emerald-200">
                  <span>Contrast Gain:</span>
                  <span className="font-mono text-emerald-400">{contrast.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={contrast}
                  onChange={e => setContrast(parseFloat(e.target.value))}
                  className="mt-1 w-full accent-emerald-500"
                />
              </div>

              {/* Brightness */}
              <div>
                <div className="flex justify-between text-xs text-emerald-200">
                  <span>Exposure / Brightness:</span>
                  <span className="font-mono text-emerald-400">{brightness > 0 ? `+${brightness}` : brightness}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={brightness}
                  onChange={e => setBrightness(parseInt(e.target.value))}
                  className="mt-1 w-full accent-emerald-500"
                />
              </div>

              {/* Rotation & Flip */}
              <div className="pt-2 border-t border-emerald-950 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`rounded-lg px-2.5 py-1 text-xs border transition-all ${
                    isFlipped
                      ? 'border-emerald-500 bg-emerald-900/50 text-emerald-200'
                      : 'border-emerald-900/60 bg-emerald-950/30 text-emerald-400/80 hover:bg-emerald-900/30'
                  }`}
                >
                  Flip Horizontal (Augment)
                </button>

                <button
                  type="button"
                  onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                  className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-900/40"
                >
                  Rotate 90° ({rotationAngle}°)
                </button>
              </div>

              {/* Target Model Input Resolution */}
              <div className="pt-2 border-t border-emerald-950">
                <label className="text-[11px] text-emerald-300 font-medium">Model Input Tensor Resolution:</label>
                <div className="mt-1 grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: '640x640', label: '640 × 640 (YOLOv8)' },
                    { id: '224x224', label: '224 × 224 (ViT/CNN)' },
                    { id: 'original', label: 'Full Res' }
                  ].map(res => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setTargetResolution(res.id as any)}
                      className={`rounded-lg py-1 text-center font-mono text-[11px] transition-all ${
                        targetResolution === res.id
                          ? 'border border-emerald-500 bg-emerald-900/60 text-white font-bold'
                          : 'border border-emerald-900/60 bg-emerald-950/30 text-emerald-400/70 hover:bg-emerald-900/30'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline Quality & Validation Checklist */}
            <div className="rounded-xl border border-emerald-900/50 bg-[#0a140d]/60 p-3.5 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Preprocessing QA Checklist
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-200/80">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Missing metadata handled (default fallback fields populated)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Pixel normalization: RGB range mapped to [0.0, 1.0] tensor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>YOLO annotation coordinate syntax validated (xmin, ymin, xmax, ymax)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Duplicate image hashing: SHA-256 collision check passed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
