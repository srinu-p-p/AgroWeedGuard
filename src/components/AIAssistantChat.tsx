import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Globe,
  FileText,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  ShieldAlert,
  Printer,
  ChevronRight,
  Code
} from 'lucide-react';
import { WeedDetectionResult } from '../types';

interface AIAssistantChatProps {
  detectionResult: WeedDetectionResult | null;
  onGenerateReport: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const INDIC_LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'Hindi', label: 'हिंदी (Hindi)' },
  { id: 'Telugu', label: 'తెలుగు (Telugu)' },
  { id: 'Marathi', label: 'मराठी (Marathi)' },
  { id: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { id: 'Tamil', label: 'தமிழ் (Tamil)' }
];

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  detectionResult,
  onGenerateReport
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPromptPipeline, setShowPromptPipeline] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **AgroWeedGuard AI**, your precision agriculture & weed management specialist.
${
  detectionResult
    ? `I have reviewed the vision analysis for your **${detectionResult.cropInfo.cropType}** field. Primary weed detected: **${detectionResult.primarySpecies}** (${detectionResult.severityLevel} severity). How can I assist with your chemical or cultural removal strategy today?`
    : 'Upload a field image or select a sample plot to get started. You can ask me any question about weed taxonomy, herbicide calibration, spot-spraying drones, or non-chemical weed control.'
}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/farming-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: selectedLanguage,
          fieldContext: detectionResult ? {
            crop: detectionResult.cropInfo.cropType,
            stage: detectionResult.cropInfo.growthStage,
            location: detectionResult.cropInfo.fieldLocation,
            detectedWeed: detectionResult.primarySpecies,
            weedCategory: detectionResult.primaryWeedCategory,
            severity: detectionResult.severityLevel,
            infestationDensity: `${detectionResult.infestationDensityPercent}%`
          } : {}
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.response || 'No agronomic advice generated. Please retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to contact the AI agronomy service. Please check your network connection and ensure the server is active.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Explain morphological reasons why this was classified as a broadleaf weed',
    'How do I calibrate my sprayer nozzles to avoid spray drift?',
    'What non-chemical & cover crop methods can prevent regrowth next season?',
    'Explain the chemical mode of action (MOA) and how to avoid resistance'
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module 7 Header */}
      <div className="rounded-2xl border border-emerald-900/60 bg-[#0d1810]/80 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
                07
              </span>
              <h2 className="text-base font-bold text-white">
                AI Farming Assistant (Core LLM & Explainable AI Module)
              </h2>
            </div>
            <p className="text-xs text-emerald-300/60 mt-0.5">
              Pipeline: Field Image → Detection Model → Prompt Template → LLM → Decision Guidance & Multilingual Translation
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector (IndicTrans2 concept) */}
            <div className="flex items-center gap-1 rounded-lg border border-emerald-800/80 bg-emerald-950/60 px-2.5 py-1 text-xs text-emerald-300">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="bg-transparent font-medium text-emerald-200 focus:outline-none"
              >
                {INDIC_LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id} className="bg-neutral-900 text-white">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Pipeline Inspector toggle */}
            <button
              onClick={() => setShowPromptPipeline(!showPromptPipeline)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-900/50"
            >
              <Code className="h-3.5 w-3.5 text-emerald-400" />
              <span>Prompt Pipeline</span>
            </button>

            {/* Report Generator */}
            <button
              onClick={onGenerateReport}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow hover:bg-emerald-500"
            >
              <Printer className="h-3.5 w-3.5" /> Treatment Report
            </button>
          </div>
        </div>

        {/* Prompt Pipeline Inspector Modal/Drawer */}
        {showPromptPipeline && (
          <div className="mt-3 rounded-xl border border-emerald-800/70 bg-[#071109] p-4 text-xs font-mono text-emerald-300/90">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-2 mb-2 font-sans font-bold text-white">
              <span>Capstone Module 7 LLM Prompt Template Pipeline</span>
              <button onClick={() => setShowPromptPipeline(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-[11px] text-emerald-200/80">
              <p className="text-emerald-400 font-bold">1. System Context:</p>
              <div className="bg-black/40 p-2 rounded border border-emerald-900/40">
                You are AgroWeedGuard AI, a world-class Agronomist and Precision Weed Management specialist.
                Provide structured advice on selective chemicals, mechanical weeding, nozzle calibration, and resistance prevention.
              </div>
              <p className="text-emerald-400 font-bold">2. Dynamic Field Ingestion Variables:</p>
              <div className="bg-black/40 p-2 rounded border border-emerald-900/40">
                Crop: {detectionResult?.cropInfo.cropType || 'Bt Cotton'} | Stage: {detectionResult?.cropInfo.growthStage || 'V5'} | Weed: {detectionResult?.primarySpecies || 'Palmer Amaranth'} | Category: {detectionResult?.primaryWeedCategory || 'Broadleaf'} | Target Language: {selectedLanguage}
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages Box */}
        <div className="mt-4 flex flex-col h-[460px] rounded-xl border border-emerald-950 bg-[#070f09] p-4">
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'border border-emerald-900/70 bg-[#0c1810] text-emerald-100 rounded-bl-none shadow'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    <div className="mt-2 flex items-center justify-between gap-2 border-t border-emerald-950/60 pt-1 text-[10px] text-emerald-400/60">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.text, idx)}
                          className="flex items-center gap-1 hover:text-emerald-200"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>AgroWeedGuard AI reasoning through agronomic principles...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="mt-3 border-t border-emerald-950 pt-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" /> Agronomist Quick Inquiries:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 text-[11px] text-emerald-300/90 hover:bg-emerald-900/40 hover:text-white transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="mt-3 flex items-center gap-2 border-t border-emerald-950 pt-2.5">
            <input
              type="text"
              id="assistant-query-input"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask AgroWeedGuard AI in ${selectedLanguage} (e.g. chemical dosage, nozzle calibration, drone spot-spraying)...`}
              className="flex-1 rounded-xl border border-emerald-800/80 bg-black/40 px-3.5 py-2 text-xs text-white placeholder:text-emerald-500/40 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              id="btn-send-assistant"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-emerald-950 font-bold shadow hover:bg-emerald-400 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
