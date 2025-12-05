"use client";

import { useState } from "react";

interface Theme {
  background: string;
  surface: string;
  accent: string;
  text: string;
  mutedText: string;
}

interface HeroBlock {
  type: "hero";
  title: string;
  subtitle?: string;
  cta?: string;
}

interface ExhibitionBlock {
  type: "exhibition";
  title: string;
  text: string;
  dates?: string;
}

interface AboutBlock {
  type: "about";
  text: string;
}

interface VisitBlock {
  type: "visit";
  showMap?: boolean;
}

type Block = HeroBlock | ExhibitionBlock | AboutBlock | VisitBlock;

interface DesignSpec {
  theme: Theme;
  layout: "centered-hero" | "split-hero" | "gallery-grid";
  blocks: Block[];
}

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [design, setDesign] = useState<DesignSpec | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/design/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setDesign(data);
    } finally {
      setLoading(false);
    }
  }

  const theme: Theme = design?.theme ?? {
    background: "#050608",
    surface: "#101118",
    accent: "#ff4b4b",
    text: "#f5f5f5",
    mutedText: "#999999",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="text-xs tracking-[0.25em] uppercase">Galleria Objets</div>
          <div className="text-[10px] text-white/60">92 Brick Lane, London E1</div>
        </header>

        <section className="space-y-3">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/50">
            Describe how you want the website to feel
          </label>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row">
            <input
              className="flex-1 rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/40"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Dark, cinematic, focus on the current exhibition…"
            />
            <button
              type="submit"
              className="rounded px-4 py-2 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ backgroundColor: theme.accent, color: "#000" }}
              disabled={loading}
            >
              {loading ? "Designing…" : "Generate"}
            </button>
          </form>
          <p className="text-[11px] text-white/40 max-w-md">
            The homepage is generated live from this description, using the gallery&apos;s current programme and information.
          </p>
        </section>

        <main className="space-y-8">
          {design?.blocks?.map((block, i) => {
            if (block.type === "hero") {
              return (
                <section key={i} className="py-10">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-3 leading-tight">
                    {block.title}
                  </h1>
                  {block.subtitle && (
                    <p className="text-base md:text-lg text-white/70 mb-4 max-w-2xl">
                      {block.subtitle}
                    </p>
                  )}
                  {block.cta && (
                    <button
                      className="inline-flex px-4 py-2 rounded text-xs font-medium uppercase tracking-[0.2em]"
                      style={{ backgroundColor: theme.accent, color: "#000" }}
                    >
                      {block.cta}
                    </button>
                  )}
                </section>
              );
            }
            if (block.type === "exhibition") {
              return (
                <section
                  key={i}
                  className="border-t border-white/10 pt-6 flex flex-col md:flex-row gap-4"
                  style={{ backgroundColor: theme.surface }}
                >
                  <div className="flex-1 p-4">
                    <h2 className="text-sm uppercase tracking-[0.25em] text-white/60 mb-2">
                      Exhibition
                    </h2>
                    <h3 className="text-xl font-medium mb-2">{block.title}</h3>
                    {block.dates && (
                      <p className="text-xs text-white/60 mb-1">{block.dates}</p>
                    )}
                    <p className="text-sm text-white/80">{block.text}</p>
                  </div>
                </section>
              );
            }
            if (block.type === "about") {
              return (
                <section key={i} className="border-t border-white/10 pt-6">
                  <h2 className="text-sm uppercase tracking-[0.25em] text-white/60 mb-2">
                    About
                  </h2>
                  <p className="text-sm md:text-base text-white/80">{block.text}</p>
                </section>
     
  );
}
