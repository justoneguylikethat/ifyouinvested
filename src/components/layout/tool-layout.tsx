import { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";

export interface ToolLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  seoContent?: {
    heading: string;
    body: ReactNode;
  }[];
  jsonLd?: any;
}

export function ToolLayout({ title, subtitle, children, seoContent, jsonLd }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">
      {jsonLd && <JsonLd data={jsonLd} />}
      
      {/* Hero Section */}
      <div className="py-12 md:py-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* The Tool */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-24">
        {children}
      </div>

      {/* SEO Content Section (Below the fold) */}
      {seoContent && seoContent.length > 0 && (
        <div className="bg-[#0B1220] border-t border-white/5 py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-16">
              {seoContent.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    {section.heading}
                  </h2>
                  <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
                    {section.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
