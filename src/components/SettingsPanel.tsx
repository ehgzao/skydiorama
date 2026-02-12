'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, ExternalLink, Shield, Zap, Check, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { apiKey, setApiKey, useCustomKey, setUseCustomKey } = useAppStore();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
      setUseCustomKey(true);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleRemove = () => {
    setApiKey(null);
    setUseCustomKey(false);
    setInputKey('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-storm-900 border-l border-white/10 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-storm-900/80 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* API Key Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Key className="w-5 h-5 text-sky-400" />
                  <h3 className="text-lg font-semibold text-white">API Key (BYOK)</h3>
                </div>

                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 mb-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">
                        Bring Your Own Key
                      </p>
                      <p className="text-white/60 text-sm">
                        Use your own Gemini API key for unlimited generations.
                        Your key is stored locally and never sent to our servers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key input */}
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="Enter your Gemini API key..."
                      className="input-glass pr-24"
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 text-sm"
                    >
                      {showKey ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={!inputKey.trim()}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved!
                        </>
                      ) : (
                        'Save Key'
                      )}
                    </button>
                    {apiKey && (
                      <button
                        onClick={handleRemove}
                        className="btn-secondary px-4"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                {apiKey && (
                  <div className="mt-3 flex items-center gap-2 text-green-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Custom API key active</span>
                  </div>
                )}
              </section>

              {/* How to get API key */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4">
                  How to get a Gemini API Key
                </h3>

                <div className="space-y-4">
                  <Step number={1}>
                    Go to{' '}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                    >
                      Google AI Studio
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Step>

                  <Step number={2}>
                    Sign in with your Google account
                  </Step>

                  <Step number={3}>
                    Click &quot;Create API Key&quot; and select a project
                  </Step>

                  <Step number={4}>
                    Copy the key and paste it above
                  </Step>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-1">Free Tier Limits</p>
                      <p className="text-white/60 text-sm">
                        Gemini API free tier includes generous limits for personal use.
                        Check{' '}
                        <a
                          href="https://ai.google.dev/pricing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          pricing details
                        </a>{' '}
                        for more info.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                <div className="text-white/60 text-sm space-y-2">
                  <p>
                    <strong className="text-white">SkyDiorama</strong> is a free,
                    open-source weather app that transforms real weather data into
                    beautiful AI-generated 3D isometric city dioramas.
                  </p>
                  <p>
                    Built with ❤️ by the community. Contributions welcome on{' '}
                    <a
                      href="https://github.com/skydiorama/skydiorama"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300"
                    >
                      GitHub
                    </a>
                    .
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
        {number}
      </div>
      <p className="text-white/70 pt-0.5">{children}</p>
    </div>
  );
}
