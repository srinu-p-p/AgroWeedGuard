import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { FieldUploadAndCollection } from './components/FieldUploadAndCollection';
import { PreprocessingLab } from './components/PreprocessingLab';
import { DetectionViewer } from './components/DetectionViewer';
import { SmartRemovalEngine } from './components/SmartRemovalEngine';
import { AIAssistantChat } from './components/AIAssistantChat';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { HistoryAndAnalytics } from './components/HistoryAndAnalytics';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { TreatmentReportModal } from './components/TreatmentReportModal';
import { SAMPLE_FIELDS } from './data/sampleFields';
import { CropInfo, WeedDetectionResult } from './types';

const INITIAL_CROP_INFO: CropInfo = {
  cropType: SAMPLE_FIELDS[0].cropType,
  growthStage: SAMPLE_FIELDS[0].growthStage,
  fieldLocation: SAMPLE_FIELDS[0].location,
  plotSizeAcres: 4.5,
  soilType: SAMPLE_FIELDS[0].soilType,
  weatherCondition: SAMPLE_FIELDS[0].weather,
  previousTreatment: SAMPLE_FIELDS[0].previousTreatment,
  farmerNotes: SAMPLE_FIELDS[0].description
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('detection');
  const [currentImage, setCurrentImage] = useState<string>(SAMPLE_FIELDS[0].imageUrl);
  const [cropInfo, setCropInfo] = useState<CropInfo>(INITIAL_CROP_INFO);
  const [selectedModel, setSelectedModel] = useState<string>('YOLOv8x-Agricultural');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<WeedDetectionResult | null>(null);
  const [historyList, setHistoryList] = useState<WeedDetectionResult[]>([]);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agroweedguard_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistoryList(parsed);
          setDetectionResult(parsed[0]);
          setCurrentImage(parsed[0].imageUrl);
          setCropInfo(parsed[0].cropInfo);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not load history:', e);
    }

    // Auto-run initial detection for first preset to provide instant working experience
    runDetection(SAMPLE_FIELDS[0].imageUrl, INITIAL_CROP_INFO, 'YOLOv8x-Agricultural', 0.5);
  }, []);

  // Save history to localStorage
  const saveHistory = (updated: WeedDetectionResult[]) => {
    setHistoryList(updated);
    try {
      localStorage.setItem('agroweedguard_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const runDetection = async (
    imgSrc: string,
    cData: CropInfo,
    model: string,
    confThreshold: number
  ) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgSrc,
          cropType: cData.cropType,
          growthStage: cData.growthStage,
          fieldLocation: cData.fieldLocation,
          soilType: cData.soilType,
          weather: cData.weatherCondition,
          previousTreatment: cData.previousTreatment,
          selectedModel: model,
          confidenceThreshold: confThreshold
        })
      });

      const res = await response.json();
      if (res.success && res.data) {
        const newResult: WeedDetectionResult = {
          id: `det-${Date.now()}`,
          timestamp: new Date().toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          imageUrl: imgSrc,
          cropInfo: { ...cData },
          detectedWeedsCount: res.data.detectedWeedsCount || 3,
          primaryWeedCategory: res.data.primaryWeedCategory || 'Broadleaf Weeds',
          primarySpecies: res.data.primarySpecies || 'Palmer Amaranth',
          scientificName: res.data.scientificName || 'Amaranthus palmeri',
          severityLevel: res.data.severityLevel || 'High',
          infestationDensityPercent: res.data.infestationDensityPercent || 28,
          affectedAreaSqMeters: res.data.affectedAreaSqMeters || 450,
          boundingBoxes: res.data.boundingBoxes || [],
          xaiAnalysis: res.data.xaiAnalysis || {
            morphologicalFeatures: ['Alternate diamond-shaped leaves', 'Smooth hairless stem'],
            spectralClues: 'ExG spectral index isolation',
            confidenceRationale: 'Correlation with agricultural annotated database'
          },
          ruleBasedRecommendation: res.data.ruleBasedRecommendation,
          aiSmartRecommendation: res.data.aiSmartRecommendation,
          executiveSummary: res.data.executiveSummary,
          selectedModel: model
        };

        setDetectionResult(newResult);
        saveHistory([newResult, ...historyList.slice(0, 19)]);
      }
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistoryRecord = (rec: WeedDetectionResult) => {
    setDetectionResult(rec);
    setCurrentImage(rec.imageUrl);
    setCropInfo(rec.cropInfo);
    setSelectedModel(rec.selectedModel);
    setActiveTab('detection');
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const handleUpdateFeedback = (id: string, feedback: string) => {
    const updated = historyList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          cropInfo: {
            ...item.cropInfo,
            farmerNotes: feedback
          }
        };
      }
      return item;
    });
    saveHistory(updated);
    if (detectionResult && detectionResult.id === id) {
      setDetectionResult(prev => prev ? {
        ...prev,
        cropInfo: {
          ...prev.cropInfo,
          farmerNotes: feedback
        }
      } : null);
    }
  };

  return (
    <div className="min-h-screen bg-[#08100a] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation & Status Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        detectedCount={detectionResult?.detectedWeedsCount || 0}
        selectedModel={selectedModel}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Module Tab Content Switcher */}
        {activeTab === 'detection' && (
          <div className="space-y-6">
            {/* Module 1: Data Collection & Ingestion */}
            <FieldUploadAndCollection
              onAnalyze={(img, cInfo, model, conf) => runDetection(img, cInfo, model, conf)}
              isAnalyzing={isAnalyzing}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              currentImage={currentImage}
              setCurrentImage={setCurrentImage}
              cropInfo={cropInfo}
              setCropInfo={setCropInfo}
            />

            {/* Module 4 & 5: Deep Learning Vision & Bounding Boxes */}
            <DetectionViewer
              result={detectionResult}
              currentImage={currentImage}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {activeTab === 'preprocessing' && (
          <PreprocessingLab
            currentImage={currentImage}
            detectionResult={detectionResult}
          />
        )}

        {activeTab === 'removal' && (
          <SmartRemovalEngine
            result={detectionResult}
            onExportReport={() => setIsReportOpen(true)}
          />
        )}

        {activeTab === 'assistant' && (
          <AIAssistantChat
            detectionResult={detectionResult}
            onGenerateReport={() => setIsReportOpen(true)}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationDashboard />
        )}

        {activeTab === 'history' && (
          <HistoryAndAnalytics
            historyList={historyList}
            onSelectResult={handleSelectHistoryRecord}
            onClearHistory={handleClearHistory}
            onUpdateFeedback={handleUpdateFeedback}
          />
        )}

        {activeTab === 'documentation' && (
          <ProjectDocsModal />
        )}
      </main>

      {/* Prescription Report Modal */}
      {isReportOpen && (
        <TreatmentReportModal
          result={detectionResult}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {/* Minimal Footer */}
      <footer className="mt-12 border-t border-emerald-950/80 bg-[#060c07] py-6 text-center text-xs text-emerald-400/50 space-y-1.5">
        <p className="font-semibold text-emerald-300/80">
          AgroWeedGuard — AI-Based Weed Detection & Smart Removal System
        </p>
        <p className="text-[11px] text-emerald-500/60">
          Deployed on <strong className="text-emerald-400">Vercel</strong>:{' '}
          <a
            href="https://agroweedguardd.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 underline hover:text-emerald-300 font-mono font-medium"
          >
            https://agroweedguardd.vercel.app/
          </a>
        </p>
        <p className="text-[11px] text-emerald-500/40">
          Integrating Agricultural Computer Vision, Deep Learning (YOLOv8x/Faster R-CNN), Classical ML (XGBoost), and LLM Agronomy Guidance
        </p>
      </footer>
    </div>
  );
}
