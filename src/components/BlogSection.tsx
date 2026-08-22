import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Heart,
  ArrowRight,
  Sparkles,
  Search,
  Tag,
  TrendingUp,
  Share2
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts?: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onLikePost: (postId: string) => void;
  likedPostIds?: string[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts = [],
  onSelectPost,
  onLikePost,
  likedPostIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Extract all unique tags
  const allTags = React.useMemo(() => {
    const set = new Set<string>();
    (posts || []).forEach((p) => (p?.tags || []).forEach((t) => set.add(t)));
    return ['all', ...Array.from(set)];
  }, [posts]);

  // Filter posts
  const filteredPosts = React.useMemo(() => {
    return (posts || []).filter((post) => {
      if (!post) return false;
      const tags = post.tags || [];
      if (selectedTag !== 'all' && !tags.includes(selectedTag)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (post.title || '').toLowerCase().includes(q) ||
          (post.excerpt || '').toLowerCase().includes(q) ||
          (post.category || '').toLowerCase().includes(q) ||
          tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [posts, selectedTag, searchQuery]);

  return (
    <section 
      id="blog-section"
      className="w-full bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-950 rounded-3xl border border-blue-100/80 dark:border-slate-800 shadow-sm p-4 sm:p-8 my-8 transition-all"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-blue-50 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-800 dark:text-cyan-300 text-xs font-bold mb-2 border border-blue-200/80 dark:border-blue-900/60 shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>AuraCentra Knowledge & Insights</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Ghana Business Insights & Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium leading-relaxed">
            Market research, entrepreneurship playbooks, local SEO advice, and SME growth strategies for modern Ghanaian enterprises.
          </p>
        </div>

        {/* Quick Search inside Blog */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or topics..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {/* Filter Tag Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-4 text-xs font-bold">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              selectedTag === tag
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            {tag === 'all' ? 'All Articles' : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {filteredPosts.map((post) => {
          const hasLiked = likedPostIds.includes(post.id);
          const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-600/10 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1.5"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-900 dark:text-blue-200 shadow-xs backdrop-blur-md">
                    {post.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-300" />
                    <span>{post.readTime}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-300" />
                    <span>{formattedDate}</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                {/* Author & Actions Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="text-[11px]">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                        {post.author.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikePost(post.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        hasLiked
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 fill-rose-500'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500'
                      }`}
                      title="Like article"
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
