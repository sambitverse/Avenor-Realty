import React from 'react';
import { BLOG_POSTS } from '../../data/mockData';

export default function JournalBlog() {
  return (
    <section className="px-6 md:px-20 py-32 bg-[#fdf8f8] border-t border-[#c4c7c7]/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header (Exact Stitch Spec) */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-20">
          <h2 className="font-sans text-4xl sm:text-6xl font-medium leading-none mb-6 md:mb-0 text-[#1c1b1b]">
            Journal <span className="font-editorial-italic italic font-normal text-[#755a24]">&amp;</span> Insights
          </h2>
          <a className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest border-b border-black pb-1 text-black" href="#">
            View All Stories
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
          </a>
        </div>

        {/* 3-Column Magazine Articles Grid (Exact Stitch Spec) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id}
              onClick={() => alert(`Reading article: "${post.title}"`)}
              className="flex flex-col gap-5 cursor-pointer group"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[#1c1b1b]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>

              <span className="font-mono text-[10px] text-[#858383] uppercase tracking-widest">
                {post.category} • {post.readTime}
              </span>

              <h3 className="font-sans text-2xl font-medium leading-snug text-[#1c1b1b] group-hover:text-[#755a24] transition-colors">
                {post.title}
              </h3>

              <p className="font-sans text-sm text-[#444748] font-light leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
