import React from 'react';
import { CheckCircle2, Clock, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { NewsArticle, VERIFIED_9_NEWS_ARTICLES } from '../data/newsData';

interface HomeNewsListProps {
  onSelectArticle: (article: NewsArticle) => void;
  onOpenNewsHub: () => void;
}

export const HomeNewsList: React.FC<HomeNewsListProps> = ({
  onSelectArticle,
  onOpenNewsHub,
}) => {
  return (
    <div className="space-y-5 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Latest Business News & Market Updates
          </h2>
        </div>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
          9 Verified Sources
        </span>
      </div>

      {/* 9 Verified Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VERIFIED_9_NEWS_ARTICLES.map((article, idx) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Image thumbnail */}
              <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading={idx < 3 ? 'eager' : 'lazy'}
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white shadow-xs">
                    {article.categoryBadge}
                  </span>
                </div>
              </div>

              {/* Source Badge with Blue Checkmark and Time */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <span>{article.sourceBadge}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-blue-500/20 shrink-0" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{article.time}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </h3>

              {/* Snippet */}
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {article.snippet}
              </p>
            </div>

            {/* Read Article Link */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
              <span className="group-hover:underline">Read full article</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

      {/* Full-width Blue Button: Open News & FX Hub → */}
      <div className="pt-2">
        <button
          onClick={onOpenNewsHub}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
        >
          <span>Open News & FX Hub</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
