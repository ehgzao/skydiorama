'use client';

import { Trash2, Database, HardDrive } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { clearAllDioramas, getCacheSize, getCachedDioramaCount } from '@/lib/image-cache';
import { useState, useEffect } from 'react';

export function CacheInfo() {
  const { dioramas } = useAppStore();
  const [cacheSize, setCacheSize] = useState<string>('Loading...');
  const [cachedCount, setCachedCount] = useState<number>(0);
  
  useEffect(() => {
    const loadCacheInfo = async () => {
      const size = await getCacheSize();
      const count = await getCachedDioramaCount();
      setCacheSize(size);
      setCachedCount(count);
    };
    
    loadCacheInfo();
  }, [dioramas]);
  
  const handleClearCache = () => {
    if (confirm('Tem certeza que deseja limpar o cache de dioramas? Isso irá remover todas as imagens salvas.')) {
      clearAllDioramas();
      window.location.reload();
    }
  };
  
  const metadataCount = Object.keys(dioramas).length;
  
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-4 h-4 text-blue-400" />
        <h3 className="text-white font-medium">Cache de Dioramas</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white/60">Metadata:</span>
          <span className="text-white font-medium">{metadataCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/60">Imagens salvas:</span>
          <span className="text-white font-medium">{cachedCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/60">Tamanho usado:</span>
          <span className="text-white font-medium">{cacheSize}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10">
        <button
          onClick={handleClearCache}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Limpar Cache
        </button>
      </div>
      
      <div className="mt-3 text-xs text-white/40">
        <p>Imagens salvas no IndexedDB. Metadata no localStorage. Sem limite de quota.</p>
      </div>
    </div>
  );
}
