
import React, { useState, useRef } from 'react';
import { MarketingGoal, TargetAudience, VisualStyle, MarketingStrategy } from '../types';

interface Props {
  onSubmit: (strategy: MarketingStrategy) => void;
  isLoading: boolean;
}

const StrategyForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [goal, setGoal] = useState<MarketingGoal>(MarketingGoal.NEW_PRODUCT);
  const [audience, setAudience] = useState<TargetAudience>(TargetAudience.OFFICE_WORKER);
  const [keywords, setKeywords] = useState('');
  const [promo, setPromo] = useState('');
  const [style, setStyle] = useState<VisualStyle>(VisualStyle.VIBRANT);
  const [scene, setScene] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      goal,
      audience,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      promoMechanism: promo,
      style,
      scenePreference: scene,
      productImage: productImage || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            <i className="fas fa-camera mr-2 text-indigo-500"></i> 上傳產品照片 (建議)
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-full h-40 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
              productImage ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'
            }`}
          >
            {productImage ? (
              <img src={productImage} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-6">
                <i className="fas fa-cloud-upload-alt text-2xl text-slate-400 mb-2"></i>
                <p className="text-xs text-slate-500">點擊上傳產品照片，讓 AI 更了解你的產品</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">行銷目標</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value as MarketingGoal)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none">
              {Object.values(MarketingGoal).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">受眾群體</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value as TargetAudience)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none">
              {Object.values(TargetAudience).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">視覺風格</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(VisualStyle).map((s) => (
              <button
                key={s} type="button" onClick={() => setStyle(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  style === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
             背景場景偏好 (選填)
          </label>
          <input
            type="text"
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            placeholder="例如：在灑滿陽光的咖啡廳、極簡大理石檯面、外太空霓虹背景..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text" required value={keywords} onChange={(e) => setKeywords(e.target.value)}
            placeholder="產品關鍵字 (用逗號分隔)"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none"
          />
          <input
            type="text" required value={promo} onChange={(e) => setPromo(e.target.value)}
            placeholder="優惠方案 (例如：買一送一)"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none"
          />
        </div>
      </div>

      <button
        type="submit" disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-3"
      >
        {isLoading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magic"></i>}
        {isLoading ? '正在設計中...' : '生成完整行銷方案'}
      </button>
    </form>
  );
};

export default StrategyForm;
