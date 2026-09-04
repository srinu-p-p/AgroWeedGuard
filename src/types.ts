export type WeedCategory = 'Broadleaf Weeds' | 'Grass Weeds' | 'Sedge Weeds' | 'Crop Foliage (No Weed)';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface BoundingBox {
  id: string;
  weedClass: WeedCategory;
  speciesName: string;
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] as percentage 0-100
  areaPercent?: number;
}

export interface CropInfo {
  cropType: string;
  growthStage: string;
  fieldLocation: string;
  plotSizeAcres: number;
  soilType: string;
  weatherCondition: string;
  previousTreatment: string;
  plantingDate?: string;
  farmerNotes?: string;
}

export interface RuleBasedTreatment {
  action: string;
  herbicide: string;
  broadcastDosage: string;
  waterVolume: string;
  estCostPerAcre: number;
  chemicalVolumeLiters: number;
}

export interface AISmartTreatment {
  action: string;
  precisionMethod: string;
  selectiveChemical: string;
  targetedSprayingReductionPercent: number;
  savedCostPerAcre: number;
  savedChemicalLiters: number;
  safetyIntervalDays: number;
  ecoImpact: string;
  culturalAlternative: string;
}

export interface XAIAnalysis {
  morphologicalFeatures: string[];
  spectralClues: string;
  confidenceRationale: string;
}

export interface WeedDetectionResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  cropInfo: CropInfo;
  detectedWeedsCount: number;
  primaryWeedCategory: WeedCategory;
  primarySpecies: string;
  scientificName: string;
  severityLevel: SeverityLevel;
  infestationDensityPercent: number;
  affectedAreaSqMeters: number;
  boundingBoxes: BoundingBox[];
  xaiAnalysis: XAIAnalysis;
  ruleBasedRecommendation: RuleBasedTreatment;
  aiSmartRecommendation: AISmartTreatment;
  executiveSummary: string;
  selectedModel: string;
}

export interface MLModelMetric {
  model: string;
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainTimeSeconds: number;
  inferenceLatencyMs: number;
  strengths: string;
  weaknesses: string;
}

export interface DLModelMetric {
  architecture: string;
  task: string;
  mAP: number;
  precision: number;
  recall: number;
  iou: number;
  fps: number;
  modelSizeMB: number;
  edgeDeployable: boolean;
}

export interface ConfusionMatrixData {
  classes: string[];
  matrix: number[][];
}

export interface EvaluationData {
  classicalML: MLModelMetric[];
  deepLearning: DLModelMetric[];
  confusionMatrix: ConfusionMatrixData;
  aiAssistantEvaluation: {
    recommendationAccuracyPercent: number;
    explainabilityScoreOut5: number;
    responseQualityScoreOut5: number;
    detectionReliabilityPercent: number;
    averageLatencySeconds: number;
  };
}

export interface SampleFieldPreset {
  id: string;
  name: string;
  cropType: string;
  variety: string;
  location: string;
  growthStage: string;
  soilType: string;
  weather: string;
  previousTreatment: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  targetWeed: string;
  expectedCategory: WeedCategory;
  expectedSeverity: SeverityLevel;
  presetBoxes: BoundingBox[];
}
