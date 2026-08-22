import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Heart,
  Share2,
  Bookmark,
  Check,
  User,
  Tag,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogArticleModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onLikePost: (postId: string) => void;
  hasLiked?: boolean;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  post,
  isOpen,
  onClose,
  onLikePost,
  hasLiked = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Header */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-800 shrink-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/50 text-white backdrop-blur-md text-xs font-bold hover:bg-black/70 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all cursor-pointer"
                title="Share article"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => onLikePost(post.id)}
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  hasLiked
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-black/50 text-white hover:bg-black/70'
                }`}
                title="Like article"
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category & Title in Header Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 font-bold text-[11px] uppercase tracking-wider mb-2 inline-block shadow-xs">
              {post.category}
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-white leading-tight line-clamp-2">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {post.author.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {post.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{post.readTime}</span>
              </span>
              <span className="flex items-center gap-1 text-rose-500 font-bold">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>{post.likes} likes</span>
              </span>
            </div>
          </div>

          {/* Excerpt Lead */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-slate-800 dark:text-blue-200 text-sm font-semibold leading-relaxed">
            {post.excerpt}
          </div>

          {/* Article Text Content */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={index} className="text-sm sm:text-base font-bold text-blue-700 dark:text-cyan-400 pt-1">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={index} className="pl-4 border-l-4 border-blue-600 italic text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-r-xl my-3">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('* ') || paragraph.startsWith('1. ')) {
                return (
                  <div key={index} className="pl-2 space-y-1.5">
                    {paragraph.split('\n').map((line, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                        <span>{line.replace(/^(\*|\d+\.)\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <p key={index} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {(post.tags || []).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom Engagement */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-blue-900/20">
            <div>
              <h4 className="text-sm font-bold">Ready to grow your Ghanaian enterprise?</h4>
              <p className="text-xs text-blue-100">Enlist on AuraCentra Ghana and reach thousands of verified customers.</p>
            </div>
            <button
              type="button"
              onClick={() => onLikePost(post.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hasLiked
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-blue-900 hover:bg-blue-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{hasLiked ? 'Liked' : `Helpful Article (${post.likes})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
