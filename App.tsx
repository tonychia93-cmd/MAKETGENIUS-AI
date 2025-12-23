
import React, { useState, useEffect } from 'react';
import StrategyForm from './components/StrategyForm';
import PosterCanvas from './components/PosterCanvas';
import { MarketingStrategy, MarketingContent, SavedCampaign } from './types';
import { generateMarketingCopy, generatePosterBackground } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [regenIdx, setRegenIdx] = useState<number | null>(null);
  const [strategy, setStrategy] = useState<MarketingStrategy | null>(null);
  const [result, setResult] = useState<MarketingContent | null>(null);
  const [posters, setPosters] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SavedCampaign[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('marketgenius_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch (e) {
      localStorage.removeItem('marketgenius_history');
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('marketgenius_history', JSON.stringify(history));
      } catch (e) {
        setHistory(history.slice(0, 3));
      }
    }
  }, [history]);

  const handleGenerate = async (newStrategy: MarketingStrategy) => {
    setLoading(true);
    try {
      const copy = await generateMarketingCopy(newStrategy);
      const img1 = await generatePosterBackground(newStrategy);
      const img2 = await generatePosterBackground(newStrategy);
      
      const posterUrls = [img1, img2].filter(url => url !== '');
      
      setResult(copy);
      setPosters(posterUrls);
      setStrategy(newStrategy);
      setCopied(false);
      setShowHistory(false);
      
      const newCampaign: SavedCampaign = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        strategy: { ...newStrategy, productImage: newStrategy.productImage ? "(Image Stored)" : undefined },
        result: copy,
        posters: posterUrls
      };
      setHistory(prev => [newCampaign, ...prev].slice(0, 5)); 
    } catch (error) {
      alert(error instanceof Error ? error.message : "生成失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateImage = async (index: number) => {
    if (!strategy) return;
    setRegenIdx(index);
    try {
      const newUrl = await generatePosterBackground(strategy);
      if (newUrl) {
        const nextPosters = [...posters];
        nextPosters[index] = newUrl;
        setPosters(nextPosters);
      }
    } catch (error) {
      alert("圖片重新生成失敗");
    } finally {
      setRegenIdx(null);
    }
  };

  const handleReset = () => {
    setStrategy(null);
    setResult(null);
    setPosters([]);
    setCopied(false);
    setShowHistory(false);
  };

  const loadFromHistory = (campaign: SavedCampaign) => {
    setStrategy(campaign.strategy);
    setResult(campaign.result);
    setPosters(campaign.posters);
    setShowHistory(false);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const textToCopy = `${result.socialPost.title}\n\n${result.socialPost.description}\n\n${result.socialPost.solution}\n\n🚀 ${result.socialPost.cta}\n\n${result.socialPost.hashtags.map(tag => `#${tag}`).join(' ')}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-rocket"></i>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              MarketGenius AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showHistory ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <i className="fas fa-history text-xs"></i> 歷史紀錄
            </button>
            {strategy && <button onClick={handleReset} className="p-2 text-slate-400 hover:text-indigo-600"><i className="fas fa-plus-circle text-xl"></i></button>}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {showHistory ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">專案庫</h2>
            {history.length === 0 ? <div className="p-20 text-center bg-white rounded-3xl border-dashed border-2 border-slate-200 text-slate-400">尚無存檔</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {history.map(item => (
                  <div key={item.id} onClick={() => loadFromHistory(item)} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-lg cursor-pointer transition-all">
                    <div className="text-[10px] font-bold text-indigo-500 uppercase">{item.strategy.goal}</div>
                    <h3 className="font-bold text-slate-900 truncate">{item.result.slogan}</h3>
                    <div className="text-[10px] text-slate-400 mt-1">{new Date(item.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !strategy ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">打造高轉化廣告</h1>
              <p className="text-slate-500">輸入策略細節，AI 幫你搞定文案與視覺設計</p>
            </div>
            <StrategyForm onSubmit={handleGenerate} isLoading={loading} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><i className="fas fa-pen-nib text-indigo-500"></i> 生成內容</h2>
                {result && (
                  <div className="space-y-6">
                    <div><h3 className="text-xs font-bold text-slate-400 uppercase mb-2">主標題</h3><p className="text-xl font-bold text-slate-900 leading-tight">{result.socialPost.title}</p></div>
                    <div><h3 className="text-xs font-bold text-slate-400 uppercase mb-2">痛點引流</h3><p className="text-slate-600 text-sm">{result.socialPost.description}</p></div>
                    <div className="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 font-medium italic text-indigo-900 text-sm">"{result.socialPost.solution}"</div>
                    <button onClick={copyToClipboard} className={`w-full py-4 rounded-xl font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                      {copied ? <><i className="fas fa-check mr-2"></i>已複製</> : <><i className="fas fa-copy mr-2"></i>複製文案</>}
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">策略細節</h3>
                <div className="text-xs space-y-2 text-slate-500">
                  <p>目標：<span className="text-slate-900 font-medium">{strategy.goal}</span></p>
                  <p>受眾：<span className="text-slate-900 font-medium">{strategy.audience}</span></p>
                  <p>風格：<span className="text-indigo-600 font-medium font-bold">{strategy.style}</span></p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">視覺設計變體</h2>
                  <p className="text-slate-500 text-sm">點擊下方按鈕或佈局圖示調整設計</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {posters.map((url, idx) => (
                  <div key={idx} className="space-y-4">
                    <PosterCanvas imageUrl={url} content={result!} style={strategy.style} />
                    <button 
                      onClick={() => handleRegenerateImage(idx)} 
                      disabled={regenIdx === idx}
                      className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      {regenIdx === idx ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-sync-alt"></i>}
                      {regenIdx === idx ? '正在重新繪製...' : '不喜歡？換一張背景'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
