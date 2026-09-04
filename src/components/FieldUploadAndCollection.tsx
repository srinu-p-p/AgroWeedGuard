import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  MapPin,
  CloudSun,
  Droplets,
  Layers,
  History,
  Sparkles,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';
import { CropInfo, SampleFieldPreset } from '../types';
import { SAMPLE_FIELDS } from '../data/sampleFields';

interface FieldUploadProps {
  onAnalyze: (imageSrc: string, cropInfo: CropInfo, selectedModel: string, confidenceThreshold: number) => void;
  isAnalyzing: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  currentImage: string;
  setCurrentImage: (img: string) => void;
  cropInfo: CropInfo;
  setCropInfo: React.Dispatch<React.SetStateAction<CropInfo>>;
}

export const FieldUploadAndCollection: React.FC<FieldUploadProps> = ({
  onAnalyze,
  isAnalyzing,
  selectedModel,
  setSelectedModel,
  currentImage,
  setCurrentImage,
  cropInfo,
  setCropInfo
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string>(SAMPLE_FIELDS[0].id);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [isDragging, setIsDragging] = useState(false);

  // Apply a sample field preset
  const handleSelectPreset = (preset: SampleFieldPreset) => {
    setActivePresetId(preset.id);
    setCurrentImage(preset.imageUrl);
    setCropInfo({
      cropType: preset.cropType,
      growthStage: preset.growthStage,
      fieldLocation: preset.location,
      plotSizeAcres: 4.5,
      soilType: preset.soilType,
      weatherCondition: preset.weather,
      previousTreatment: preset.previousTreatment,
      farmerNotes: preset.description
    });
  };

  // Handle image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCurrentImage(reader.result);
          setActivePresetId('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCurrentImage(reader.result);
          setActivePresetId('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Camera handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Could not access camera. Please allow camera permissions or upload an image file.');
    }
  };

  const captureCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCurrentImage(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentImage) {
      alert('Please upload a field image or select a sample preset.');
      return;
    }
    onAnalyze(currentImage, cropInfo, selectedModel, confidenceThreshold);
  };

  return (
    <div className="rounded-2xl border border-emerald-900/60 bg-[#0d1810]/80 p-5 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
              01
            </span>
            <h2 className="text-base font-bold text-white">
              Agricultural Data Collection Pipeline
            </h2>
          </div>
          <p className="text-xs text-emerald-300/60 mt-0.5">
            Module 1: Ingest field imagery, geographic tags, soil conditions & crop history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-emerald-300/80 font-medium">Detection Model:</label>
          <select
            id="model-selector"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="rounded-lg border border-emerald-800/80 bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="YOLOv8x-Agricultural">YOLOv8x Precision (Recommended)</option>
            <option value="Faster R-CNN">Faster R-CNN (ResNet-50)</option>
            <option value="Vision Transformer (ViT)">Vision Transformer (ViT-B/16)</option>
            <option value="Custom CNN">Custom 5-Layer Agricultural CNN</option>
          </select>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
          Select Sample Agricultural Field Preset:
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {SAMPLE_FIELDS.map(preset => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`group relative flex flex-col items-start overflow-hidden rounded-xl border p-2 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/60 shadow-md shadow-emerald-950 ring-1 ring-emerald-500/50'
                    : 'border-emerald-900/40 bg-[#0b150e]/60 hover:border-emerald-700/60 hover:bg-emerald-950/30'
                }`}
              >
                <div className="relative mb-1.5 h-16 w-full overflow-hidden rounded-lg bg-emerald-950">
                  <img
                    src={preset.thumbnailUrl}
                    alt={preset.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-bold text-amber-300">
                    {preset.expectedCategory.split(' ')[0]}
                  </div>
                </div>
                <div className="w-full">
                  <div className="truncate text-xs font-bold text-white">{preset.cropType}</div>
                  <div className="truncate text-[10px] text-emerald-300/70">{preset.targetWeed}</div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="absolute bottom-2 right-2 h-3.5 w-3.5 text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Upload / Camera & Form Row */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Image Upload & Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
              Field Image Input
            </label>

            {isCameraActive ? (
              <div className="relative overflow-hidden rounded-xl border border-emerald-500 bg-black">
                <video ref={videoRef} className="h-56 w-full object-cover" autoPlay playsInline />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={captureCamera}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-emerald-950 shadow hover:bg-emerald-400"
                  >
                    <Camera className="h-3.5 w-3.5" /> Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/60'
                    : 'border-emerald-800/60 bg-[#09110b]/60 hover:border-emerald-600/70'
                }`}
              >
                {currentImage ? (
                  <div className="relative h-56 w-full group">
                    <img
                      src={currentImage}
                      alt="Selected Field"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-white">
                      Drag & Drop field photo or click to browse
                    </p>
                    <p className="text-[11px] text-emerald-300/60 mt-1">
                      Supports JPG, PNG from phone, UAV drone, or tractor camera
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Upload Buttons */}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                id="btn-upload-file"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-900/50"
              >
                <Upload className="h-3.5 w-3.5" /> Upload File
              </button>
              <button
                type="button"
                id="btn-open-camera"
                onClick={startCamera}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-900/50"
              >
                <Camera className="h-3.5 w-3.5" /> Field Camera
              </button>
            </div>
          </div>

          {/* Confidence Slider */}
          <div className="mt-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-medium text-emerald-300">
                <Sliders className="h-3.5 w-3.5" /> Confidence Threshold (IoU / Class)
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {(confidenceThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.90"
              step="0.05"
              value={confidenceThreshold}
              onChange={e => setConfidenceThreshold(parseFloat(e.target.value))}
              className="mt-2 w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-emerald-400/50 mt-0.5">
              <span>30% (High Recall)</span>
              <span>60% (Balanced)</span>
              <span>90% (High Precision)</span>
            </div>
          </div>
        </div>

        {/* Right: Crop & Field Information Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
              Crop & Environmental Metadata Form
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-medium text-emerald-300/80 flex items-center gap-1">
                  <Layers className="h-3 w-3 text-emerald-400" /> Crop Type & Cultivar
                </label>
                <input
                  type="text"
                  value={cropInfo.cropType}
                  onChange={e => setCropInfo(prev => ({ ...prev, cropType: e.target.value }))}
                  placeholder="e.g. Cotton, Maize, Rice, Wheat"
                  className="mt-1 w-full rounded-lg border border-emerald-900/80 bg-emerald-950/40 px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-emerald-300/80 flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 text-emerald-400" /> Crop Growth Stage
                </label>
                <input
                  type="text"
                  value={cropInfo.growthStage}
                  onChange={e => setCropInfo(prev => ({ ...prev, growthStage: e.target.value }))}
                  placeholder="e.g. Vegetative V4, Tillering, 35 DAS"
                  className="mt-1 w-full rounded-lg border border-emerald-900/80 bg-emerald-950/40 px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-emerald-300/80 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-400" /> Field Location / GPS
                </label>
                <input
                  type="text"
                  value={cropInfo.fieldLocation}
                  onChange={e => setCropInfo(prev => ({ ...prev, fieldLocation: e.target.value }))}
                  placeholder="e.g. Plot #4 Wardha, MH (20.74° N, 78.60° E)"
                  className="mt-1 w-full rounded-lg border border-emerald-900/80 bg-emerald-950/40 px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-emerald-300/80 flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-emerald-400" /> Soil Classification
                </label>
                <input
                  type="text"
                  value={cropInfo.soilType}
                  onChange={e => setCropInfo(prev => ({ ...prev, soilType: e.target.value }))}
                  placeholder="e.g. Black Clay Vertisol, Sandy Loam"
                  className="mt-1 w-full rounded-lg border border-emerald-900/80 bg-emerald-950/40 px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-emerald-300/80 flex items-center gap-1">
                  <CloudSun className="h-3 w-3 text-emerald-400" /> Field Conditions / Weather
                </label>
                <input
                  type="text"
                  value={cropInfo.weatherCondition}
                  onChange={e => setCropInfo(prev => ({ ...prev, weatherCondition: e.target.value }))}
                  placeholder="e.g. Sunny 30°C, 45% RH, Wind 6 km/h"
                  className="mt-1 w-full rounded-lg border border-emerald-900/80 bg-emerald-950/40 px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-emerald-300/80 flex items-center gap-1">
                  <History className="h-3 w-3 text-emerald-400" /> Previous Herbicide / Cultivation
                </label>
                <input
                  type="text"
                  value={cropInfo.previousTreatment}
                  onChange={e => setCropInfo(prev => ({ ...prev, previousTreatment: e.target.value }))}
                  placeholder="e.g. Pendimethalin pre-emergence 25 DAS"
                  className="mt-1 w-full rounded-lg border border-emerald-900/80 bg-emerald-950/40 px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-emerald-300/80">
                Farmer Notes & Observed Weed Pressure
              </label>
              <textarea
                value={cropInfo.farmerNotes || ''}
                onChange={e => setCropInfo(prev => ({ ...prev, farmerNotes: e.target.value }))}
                rows={2}
                placeholder="Observed weed germination clusters after recent rainfall; need recommendations for selective weed control."
                className="mt-1 w-full rounded-lg border border-emerald-900/80 bg-emerald-950/40 px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5 pt-3 border-t border-emerald-950 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/70">
              <Info className="h-3.5 w-3.5 text-emerald-400" />
              <span>Full end-to-end inference: Preprocessing → Detection → XAI → Smart Spray Plan</span>
            </div>

            <button
              type="submit"
              id="btn-run-inference"
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-xs font-bold text-emerald-950 shadow-lg shadow-emerald-950 transition-all hover:from-emerald-400 hover:to-green-500 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-950" />
                  <span>Processing Agricultural CV Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-emerald-950" />
                  <span>Execute AI Weed Detection</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
