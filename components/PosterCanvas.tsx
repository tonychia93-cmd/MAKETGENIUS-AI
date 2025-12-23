
import React, { useState } from 'react';
import { MarketingContent, VisualStyle } from '../types';

interface Props {
  imageUrl: string;
  content: MarketingContent;
  style: VisualStyle;
}

type LayoutType = 'standard' | 'centered' | 'bottom' | 'split';

const PosterCanvas: React.FC<Props> = ({ imageUrl, content, style }) => {
  const [layout, setLayout] = useState<LayoutType>('standard');

  const getStyleConfig = () => {
    switch (style) {
      case VisualStyle.MINIMALIST:
        return {
          container: "p-4",
          slogan: "font-light tracking-tight text-slate-800 uppercase text-2xl mb-1",
          tagline: "text-slate-500 text-sm border-t border-slate-200 mt-1 pt-1 font-medium",
          badge: "bg-slate-800 text-white px-2 py-0.5 text-[10px] uppercase font-bold"
        };
      case VisualStyle.LUXURY:
        return {
          container: "p-6",
          slogan: "font-serif text-amber-500 italic text-3xl leading-tight drop-shadow-sm",
          tagline: "text-amber-200 font-serif tracking-[0.2em] mt-3 uppercase text-xs",
          badge: "bg-amber-400 text-slate-900 px-3 py-0.5 font-bold rounded-sm text-[10px]"
        };
      case VisualStyle.URGENT:
        return {
          container: "p-4",
          slogan: "font-display text-red-600 font-black text-4xl italic uppercase",
          tagline: "bg-black text-yellow-400 px-3 py-1 text-xl font-bold inline-block mt-3 skew-x-[-10deg]",
          badge: "bg-red-600 text-white p-3 rounded-full font-black shadow-lg animate-pulse text-xs"
        };
      case VisualStyle.RETRO:
        return {
          container: "p-6",
          slogan: "font-serif text-orange-800 text-3xl drop-shadow-md",
          tagline: "text-orange-900 font-bold border-2 border-orange-800 px-2 py-1 mt-3 inline-block bg-orange-50",
          badge: "bg-orange-800 text-orange-50 px-2 py-1 rounded-sm text-xs font-serif"
        };
      case VisualStyle.CYBERPUNK:
        return {
          container: "p-6",
          slogan: "font-display text-cyan-400 text-3xl uppercase italic drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
          tagline: "text-fuchsia-500 font-mono tracking-tighter mt-3 border-b-2 border-fuchsia-500 inline-block",
          badge: "bg-cyan-500 text-black px-2 py-1 font-mono font-bold text-xs"
        };
      case VisualStyle.CORPORATE:
        return {
          container: "p-6",
          slogan: "font-bold text-indigo-900 text-2xl",
          tagline: "text-indigo-600 font-semibold border-l-4 border-indigo-600 pl-3 mt-3",
          badge: "bg-indigo-900 text-white px-3 py-1 text-xs"
        };
      default: // VIBRANT
        return {
          container: "p-6",
          slogan: "font-display text-white text-3xl drop-shadow-lg",
          tagline: "bg-white text-indigo-600 px-3 py-1 rounded-full text-lg font-bold mt-3 shadow-md",
          badge: "bg-pink-500 text-white px-3 py-1 rounded-md font-black shadow-lg"
        };
    }
  };

  const config = getStyleConfig();

  const renderLayout = () => {
    switch (layout) {
      case 'centered':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/30">
            <h2 className={config.slogan}>{content.slogan}</h2>
            <div className={config.tagline}>{content.promoTagline}</div>
            {content.dataVizValue && (
              <div className={`mt-6 ${config.badge}`}>{content.dataVizValue}</div>
            )}
          </div>
        );
      case 'bottom':
        return (
          <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-transparent">
            <h2 className={config.slogan}>{content.slogan}</h2>
            <div className={config.tagline}>{content.promoTagline}</div>
            {content.dataVizValue && (
              <div className={`mt-4 ${config.badge}`}>{content.dataVizValue}</div>
            )}
          </div>
        );
      case 'split':
        return (
          <div className="absolute inset-0 grid grid-rows-2 p-6">
            <div className="flex items-start justify-start">
              <h2 className={`${config.slogan} max-w-[80%]`}>{content.slogan}</h2>
            </div>
            <div className="flex flex-col items-end justify-end gap-2">
              {content.dataVizValue && <div className={config.badge}>{content.dataVizValue}</div>}
              <div className={config.tagline}>{content.promoTagline}</div>
            </div>
          </div>
        );
      default: // standard
        return (
          <div className="absolute inset-0 flex flex-col justify-between p-8 bg-gradient-to-b from-black/40 via-transparent to-black/40">
            <div className="text-left">
              <h2 className={config.slogan}>{content.slogan}</h2>
            </div>
            <div className="flex flex-col items-start gap-4">
              {content.dataVizValue && <div className={config.badge}>{content.dataVizValue}</div>}
              <div className={config.tagline}>{content.promoTagline}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
        {imageUrl ? (
          <img src={imageUrl} alt="AI Background" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <i className="fas fa-image text-3xl animate-pulse"></i>
          </div>
        )}
        {renderLayout()}
      </div>

      {/* 佈局切換器控制條 */}
      <div className="mt-3 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {(['standard', 'centered', 'bottom', 'split'] as LayoutType[]).map((l) => (
          <button
            key={l}
            onClick={() => setLayout(l)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
              layout === l ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-400'
            }`}
            title={`佈局: ${l}`}
          >
            <i className={`fas ${
              l === 'standard' ? 'fa-th-large' : 
              l === 'centered' ? 'fa-align-center' : 
              l === 'bottom' ? 'fa-align-left' : 'fa-columns'
            } text-xs`}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PosterCanvas;
