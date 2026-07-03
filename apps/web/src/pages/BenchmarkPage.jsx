import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Zap, Brain, ChevronUp, ChevronDown, ChevronsUpDown,
  Filter, Star, Lock, Globe, ArrowRight, BarChart3, CheckCircle2,
  Info, Cpu, DollarSign, Clock
} from 'lucide-react';
import { BENCHMARK_MODELS, BENCHMARK_COLUMNS, TASK_FIT_PROFILES } from '@/data/benchmarkData.js';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, Reveal } from '@/components/ScrollAnimations.jsx';

// ─── Animation Variants ───
const tabContentVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// ─── Score Color Helper ───
const scoreColor = (val, max = 100) => {
  const pct = max === 10 ? val / 10 : val / 100;
  if (pct >= 0.85) return '#10b981'; // Emerald green
  if (pct >= 0.70) return '#10b981';
  if (pct >= 0.55) return '#f59e0b'; // Amber yellow
  if (pct >= 0.40) return '#E73A5A'; // Accent red
  return '#ef4444';
};

const scoreBg = (val, max = 100) => {
  const pct = max === 10 ? val / 10 : val / 100;
  if (pct >= 0.85) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (pct >= 0.70) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (pct >= 0.55) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  if (pct >= 0.40) return 'bg-red-500/10 text-red-400 border border-red-500/20';
  return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
};

// ─── Rank Medal ───
const RankBadge = ({ rank }) => {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return <span className="text-xs font-black text-white/40 w-6 text-center">#{rank}</span>;
};

// ─── Score Bar ───
const ScoreBar = ({ value, max = 100 }) => {
  const pct = max === 10 ? (value / 10) * 100 : value;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: scoreColor(value, max) }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </div>
      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[38px] text-center ${scoreBg(value, max)}`}>
        {max === 10 ? value.toFixed(1) : `${value}%`}
      </span>
    </div>
  );
};

// ─── Provider dot ───
const ProviderDot = ({ color }) => (
  <span className="inline-block w-2.5 h-2.5 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: color }} />
);

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — LEADERBOARD
// ═══════════════════════════════════════════════════════════════
const LeaderboardSection = () => {
  const [sortKey, setSortKey] = useState('mmlu');
  const [sortDir, setSortDir] = useState('desc');
  const [filterCat, setFilterCat] = useState('all');
  const [filterLocal, setFilterLocal] = useState('all');
  const [activeTooltip, setActiveTooltip] = useState(null);

  const categories = ['all', 'reasoning', 'coding', 'chat'];

  const sorted = useMemo(() => {
    let list = [...BENCHMARK_MODELS];
    if (filterCat !== 'all') list = list.filter(m => m.category.includes(filterCat));
    if (filterLocal === 'local') list = list.filter(m => m.local);
    if (filterLocal === 'api') list = list.filter(m => !m.local);

    list.sort((a, b) => {
      let aVal, bVal;
      if (sortKey === 'speed') { aVal = a.speed.tokensPerSec; bVal = b.speed.tokensPerSec; }
      else if (sortKey === 'cost') { aVal = a.pricing.input + a.pricing.output; bVal = b.pricing.input + b.pricing.output; }
      else if (sortKey === 'context') { aVal = a.context; bVal = b.context; }
      else { aVal = a.scores[sortKey] ?? 0; bVal = b.scores[sortKey] ?? 0; }
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return list;
  }, [sortKey, sortDir, filterCat, filterLocal]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={12} className="!text-white/40" />;
    return sortDir === 'desc' ? <ChevronDown size={12} className="text-[#06B6D4]" /> : <ChevronUp size={12} className="text-[#06B6D4]" />;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <FadeIn direction="down" distance={16}>
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-xs font-black uppercase tracking-widest text-white/40">Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 border rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                filterCat === cat
                  ? 'bg-[#06B6D4] border-[#06B6D4] text-white shadow-[0_0_15px_rgba(6, 182, 212,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            {[['all', 'All'], ['local', '🔒 Local'], ['api', '☁️ API']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterLocal(val)}
                className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all ${
                  filterLocal === val
                    ? 'bg-[#06B6D4] border-[#06B6D4] text-white shadow-[0_0_15px_rgba(6, 182, 212,0.3)]'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Table */}
      <FadeIn direction="up" distance={20} delay={0.1}>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <table className="w-full text-left text-xs min-w-[900px] border-collapse">
            <thead className="bg-black/35 dark:bg-white/5 border-b border-white/10 text-white">
              <tr>
                <th className="p-4 font-black uppercase tracking-widest w-10 text-center !text-white/75">#</th>
                <th className="p-4 font-black uppercase tracking-widest !text-white/75">Model</th>
                {BENCHMARK_COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className="p-4 font-black uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-colors select-none group relative"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: col.color }}>{col.label}</span>
                      <SortIcon colKey={col.key} />
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseEnter={() => setActiveTooltip(col.key)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={e => e.stopPropagation()}
                      >
                        <Info size={10} className="!text-white/70" />
                      </button>
                    </div>
                    {activeTooltip === col.key && (
                      <div className="absolute z-20 top-full left-0 mt-1 w-56 bg-black text-white text-[10px] font-medium p-2.5 rounded-lg border border-white/10 shadow-xl pointer-events-none leading-relaxed">
                        {col.tooltip}
                      </div>
                    )}
                  </th>
                ))}
                <th
                  className="p-4 font-black uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-colors select-none"
                  onClick={() => handleSort('speed')}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="!text-white/75">Speed</span> <SortIcon colKey="speed" />
                  </div>
                </th>
                <th
                  className="p-4 font-black uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-colors select-none"
                  onClick={() => handleSort('cost')}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="!text-white/75">Cost/1M</span> <SortIcon colKey="cost" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="wait">
                {sorted.map((model, idx) => (
                  <motion.tr
                    key={model.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 text-center">
                      <RankBadge rank={idx + 1} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ProviderDot color={model.providerColor} />
                        <div>
                          <div className="font-black text-white text-sm flex items-center gap-1">
                            {model.name}
                            {model.local && <Lock size={10} className="text-emerald-400" />}
                          </div>
                          <div className="text-[10px] text-white/40 font-semibold">{model.provider}</div>
                        </div>
                      </div>
                    </td>
                    {BENCHMARK_COLUMNS.map(col => (
                      <td key={col.key} className="p-4 min-w-[130px]">
                        <ScoreBar value={model.scores[col.key]} max={col.key === 'mtbench' ? 10 : 100} />
                      </td>
                    ))}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-white/80">
                        <Zap size={10} className="text-yellow-400" />
                        {model.speed.tokensPerSec} t/s
                      </div>
                      <div className="text-[10px] text-white/40">{model.speed.latencyMs}ms TTFT</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {model.pricing.input === 0 ? (
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">FREE</span>
                      ) : (
                        <div>
                          <div className="text-xs font-bold text-white/80">${model.pricing.input} in</div>
                          <div className="text-[10px] text-white/40">${model.pricing.output} out</div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </FadeIn>

      <FadeIn direction="up" distance={10} delay={0.3}>
        <p className="text-[10px] text-white/40 text-center font-medium">
          Scores sourced from public model cards & papers (MMLU, HumanEval, MATH, MT-Bench, GPQA). Last updated June 2025.
        </p>
      </FadeIn>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SECTION 2 — SPEED & COST SIMULATOR
// ═══════════════════════════════════════════════════════════════
const SimulatorSection = () => {
  const [selectedIds, setSelectedIds] = useState(['gpt-4o', 'claude-35-sonnet', 'llama-33-70b']);
  const [dailyInputK, setDailyInputK] = useState(100);
  const [dailyOutputK, setDailyOutputK] = useState(50);
  const [addingModel, setAddingModel] = useState(false);

  const availableToAdd = BENCHMARK_MODELS.filter(m => !selectedIds.includes(m.id));
  const selected = BENCHMARK_MODELS.filter(m => selectedIds.includes(m.id));

  const calcMonthly = (model) => {
    const inCost = (dailyInputK * 30 * model.pricing.input) / 1000;
    const outCost = (dailyOutputK * 30 * model.pricing.output) / 1000;
    return inCost + outCost;
  };

  const maxCost = Math.max(...selected.map(calcMonthly), 0.01);
  const maxSpeed = Math.max(...selected.map(m => m.speed.tokensPerSec), 1);
  const maxContext = Math.max(...selected.map(m => m.context), 1);

  const CARD_COLORS = [
    {
      bg: 'bg-gradient-to-b from-[#06B6D4]/10 via-black/40 to-black/60',
      border: 'border-[#06B6D4]/30 hover:border-[#06B6D4]/50',
      glow: 'shadow-[0_0_30px_rgba(6, 182, 212,0.15)]',
      bar: 'bg-gradient-to-r from-[#06B6D4] to-rose-500'
    },
    {
      bg: 'bg-gradient-to-b from-cyan-500/10 via-black/40 to-black/60',
      border: 'border-cyan-500/30 hover:border-cyan-500/50',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      bar: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    },
    {
      bg: 'bg-gradient-to-b from-purple-500/10 via-black/40 to-black/60',
      border: 'border-purple-500/30 hover:border-purple-500/50',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
      bar: 'bg-gradient-to-r from-purple-500 to-indigo-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Controls */}
      <FadeIn direction="down" distance={16}>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-white">Configure Daily Usage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
                <span>Input Tokens / Day</span>
                <span className="font-mono text-[#06B6D4] font-black">{dailyInputK.toLocaleString()}K</span>
              </div>
              <input
                type="range" min={1} max={10000} step={10} value={dailyInputK}
                onChange={e => setDailyInputK(Number(e.target.value))}
                className="w-full accent-[#06B6D4] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>1K</span><span>10,000K</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
                <span>Output Tokens / Day</span>
                <span className="font-mono text-cyan-400 font-black">{dailyOutputK.toLocaleString()}K</span>
              </div>
              <input
                type="range" min={1} max={5000} step={10} value={dailyOutputK}
                onChange={e => setDailyOutputK(Number(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>1K</span><span>5,000K</span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Model comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selected.map((model, idx) => {
          const monthly = calcMonthly(model);
          const colors = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <ScaleIn key={model.id} delay={idx * 0.1}>
              <div className={`${colors.bg} border ${colors.border} ${colors.glow} rounded-2xl p-6 relative backdrop-blur-md transition-all duration-300`}>
                {/* Remove button */}
                {selected.length > 1 && (
                  <button
                    onClick={() => setSelectedIds(ids => ids.filter(i => i !== model.id))}
                    className="absolute top-3 right-3 text-white/40 hover:text-white font-semibold text-lg leading-none"
                  >×</button>
                )}

                <div className="flex items-center gap-2 mb-1">
                  <ProviderDot color={model.providerColor} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{model.provider}</span>
                </div>
                <h3 className="font-black text-lg text-white mb-4 leading-tight">{model.name}</h3>

                {/* Monthly cost */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                    <span className="flex items-center gap-1"><DollarSign size={10} />Monthly Cost</span>
                    <span className="text-white/90">{model.pricing.input === 0 ? 'FREE' : `$${monthly.toFixed(2)}`}</span>
                  </div>
                  <div className="h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${colors.bar} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: model.pricing.input === 0 ? '3%' : `${(monthly / maxCost) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                {/* Speed */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                    <span className="flex items-center gap-1"><Zap size={10} />Speed</span>
                    <span className="text-white/90">{model.speed.tokensPerSec} t/s</span>
                  </div>
                  <div className="h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${colors.bar} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(model.speed.tokensPerSec / maxSpeed) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    />
                  </div>
                </div>

                {/* Context */}
                <div className="mb-5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                    <span className="flex items-center gap-1"><Cpu size={10} />Context</span>
                    <span className="text-white/90">{model.context}K tokens</span>
                  </div>
                  <div className="h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${colors.bar} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(model.context / maxContext) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Latency & local badge */}
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-white/40 flex items-center gap-1">
                    <Clock size={10} />{model.speed.latencyMs}ms latency
                  </div>
                  {model.local && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <Lock size={8} /> Local
                    </span>
                  )}
                </div>
              </div>
            </ScaleIn>
          );
        })}

        {/* Add model card */}
        {selected.length < 3 && (
          <FadeIn direction="up" distance={20}>
            <div className="border border-dashed border-white/20 hover:border-[#06B6D4]/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[300px] gap-4 bg-white/[0.02] transition-all duration-300">
              {!addingModel ? (
                <>
                  <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                    <span className="text-2xl font-black text-white/40">+</span>
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Add model to compare</p>
                  <button
                    onClick={() => setAddingModel(true)}
                    className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white font-bold py-2 px-4 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(6, 182, 212,0.3)] transition-all"
                  >
                    + Add Model
                  </button>
                </>
              ) : (
                <div className="w-full space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Select a model:</p>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
                    {availableToAdd.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedIds(ids => [...ids, m.id]); setAddingModel(false); }}
                        className="w-full flex items-center gap-2 p-2.5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all text-xs font-bold text-white"
                      >
                        <ProviderDot color={m.providerColor} />
                        {m.name}
                        {m.local && <Lock size={9} className="text-emerald-400 ml-auto" />}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setAddingModel(false)} className="text-[10px] text-white/40 hover:text-white mt-2 transition-colors">Cancel</button>
                </div>
              )}
            </div>
          </FadeIn>
        )}
      </div>

      {/* Summary insight */}
      {selected.length >= 2 && (
        <FadeIn direction="up" distance={16} delay={0.2}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#06B6D4] mb-4 flex items-center gap-1.5">
              <span>💡</span> Simulation Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm font-semibold">
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Cheapest</div>
                <div className="font-black text-emerald-400 text-base">
                  {selected.reduce((a, b) => calcMonthly(a) <= calcMonthly(b) ? a : b).name}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">
                  ${Math.min(...selected.map(calcMonthly)).toFixed(2)}/mo
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Fastest</div>
                <div className="font-black text-amber-400 text-base">
                  {selected.reduce((a, b) => a.speed.tokensPerSec >= b.speed.tokensPerSec ? a : b).name}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">
                  {Math.max(...selected.map(m => m.speed.tokensPerSec))} tokens/sec
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Longest Context</div>
                <div className="font-black text-cyan-400 text-base">
                  {selected.reduce((a, b) => a.context >= b.context ? a : b).name}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">
                  {Math.max(...selected.map(m => m.context))}K tokens
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SECTION 3 — TASK FIT FINDER
// ═══════════════════════════════════════════════════════════════
const TaskFitSection = () => {
  const [selected, setSelected] = useState(null);
  const profile = selected ? TASK_FIT_PROFILES[selected] : null;

  const tasks = Object.entries(TASK_FIT_PROFILES);

  return (
    <div className="space-y-8">
      <FadeIn direction="up" distance={20}>
        <p className="text-center text-sm font-semibold text-white/60 max-w-xl mx-auto">
          Select your primary use case and we'll instantly recommend the best models — both cloud API and local (Ollama-compatible).
        </p>
      </FadeIn>

      {/* Task selector pills */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4" staggerDelay={0.07}>
        {tasks.map(([key, task]) => (
          <StaggerItem key={key}>
            <button
              onClick={() => setSelected(key === selected ? null : key)}
              className={`w-full p-5 border rounded-2xl text-left transition-all flex flex-col gap-2 font-rounded ${
                selected === key
                  ? 'bg-[#06B6D4]/10 border-[#06B6D4] text-white shadow-[0_0_25px_rgba(6, 182, 212,0.2)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white'
              }`}
            >
              <span className="text-2xl">{task.emoji}</span>
              <div>
                <div className="font-black text-sm text-white">{task.label}</div>
                <div className="text-[10px] text-white/50 font-medium mt-0.5">{task.description}</div>
              </div>
              {selected === key && (
                <CheckCircle2 size={16} className="text-[#06B6D4] ml-auto self-end mt-2" />
              )}
            </button>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Recommendation card */}
      <AnimatePresence mode="wait">
        {profile && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md">
              {/* Header */}
              <div className="bg-white/[0.02] border-b border-white/10 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{profile.emoji}</span>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-0.5">Best models for</div>
                    <h3 className="text-xl font-black">{profile.label}</h3>
                  </div>
                </div>
                <p className="text-sm text-white/70 font-medium leading-relaxed">{profile.reason}</p>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {/* Cloud API */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={16} className="text-cyan-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/50">☁️ Cloud API Picks</span>
                  </div>
                  <div className="space-y-3">
                    {profile.topModels.map((id, i) => {
                      const m = BENCHMARK_MODELS.find(x => x.id === id);
                      if (!m) return null;
                      return (
                        <div key={id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                          <RankBadge rank={i + 1} />
                          <ProviderDot color={m.providerColor} />
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-sm text-white truncate">{m.name}</div>
                            <div className="text-[10px] text-white/40 font-medium">{m.provider}</div>
                          </div>
                          <div className="text-right shrink-0">
                            {m.pricing.input === 0
                              ? <span className="text-[10px] font-black text-emerald-400">FREE</span>
                              : <span className="text-[10px] font-bold text-white/60">${m.pricing.input}/1M</span>
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Local */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={16} className="text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/50">🔒 Local / Ollama Picks</span>
                  </div>
                  <div className="space-y-3">
                    {profile.localTop.map((id, i) => {
                      const m = BENCHMARK_MODELS.find(x => x.id === id);
                      if (!m) return null;
                      return (
                        <div key={id} className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                          <RankBadge rank={i + 1} />
                          <ProviderDot color={m.providerColor} />
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-sm text-white truncate">{m.name}</div>
                            <div className="text-[10px] text-white/40 font-medium">{m.params}B params</div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">FREE</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <FadeIn direction="up" distance={10}>
          <div className="text-center py-8 text-white/30">
            <Brain size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold">Select a use case above to see recommendations</p>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
const TABS = [
  { id: 'leaderboard', label: 'Benchmark Leaderboard', icon: Trophy,   badge: `${BENCHMARK_MODELS.length} models` },
  { id: 'simulator',   label: 'Speed & Cost Simulator', icon: BarChart3, badge: 'Live calc'  },
  { id: 'finder',      label: 'Task Fit Finder',        icon: Brain,    badge: 'AI quiz'    },
];

const BenchmarkPage = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');

  return (
    <>
      <Helmet>
        <title>AI Model Benchmark — Compare GPT-4o, Claude, Gemini & More | OdysseusAI</title>
        <meta
          name="description"
          content="Interactive AI model benchmark simulator. Compare MMLU, HumanEval, MATH scores across GPT-4o, Claude 3.5, Gemini 1.5, Llama 3.3, DeepSeek R1 and 15+ more models."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 font-rounded">

        {/* ── Hero ── */}
        <div className="text-center mb-14 select-none">
          <FadeIn direction="down" distance={20} delay={0.05}>
            <div className="inline-flex items-center gap-2 bg-[#06B6D4]/10 px-4 py-1.5 rounded-full border border-[#06B6D4]/20 text-sm font-bold mb-6">
              <span className="bg-[#06B6D4] px-2 py-0.5 rounded-full text-xs text-white font-black">NEW</span>
              <span className="text-white/80">Live Benchmark Dashboard — {BENCHMARK_MODELS.length} Models Compared</span>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={30} delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              AI Model{' '}
              <span className="bg-[#06B6D4]/10 text-white px-4 py-1 border border-[#06B6D4]/30 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_20px_rgba(6, 182, 212,0.2)]">
                Benchmark
              </span>
              <br />
              <span className="text-3xl md:text-5xl text-white/90">Simulator & Calculator</span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" distance={20} delay={0.2}>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Compare real benchmark scores, simulate monthly costs, and find the perfect model for your use case — from GPT-4o to fully local Ollama models.
            </p>
          </FadeIn>

          {/* Quick stats strip */}
          <FadeIn direction="up" distance={16} delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: '🏆', val: `${BENCHMARK_MODELS.length}+`, label: 'Models' },
                { icon: '📊', val: '5',    label: 'Benchmarks' },
                { icon: '🔒', val: `${BENCHMARK_MODELS.filter(m => m.local).length}`,  label: 'Local Models' },
                { icon: '☁️', val: `${BENCHMARK_MODELS.filter(m => !m.local).length}`, label: 'Cloud APIs'  },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center gap-3 backdrop-blur-md">
                  <span className="text-xl">{s.icon}</span>
                  <div className="text-left">
                    <div className="text-lg font-black text-white leading-none">{s.val}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* ── Tab Navigation ── */}
        <FadeIn direction="up" distance={16} delay={0.35}>
          <div className="flex flex-col sm:flex-row gap-2 mb-10 bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-md">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-[#06B6D4] text-white shadow-[0_0_15px_rgba(6, 182, 212,0.35)] border border-[#06B6D4]'
                      : 'text-white/50 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border transition-colors ${
                    isActive
                      ? 'border-white/20 text-white/80 bg-white/10'
                      : 'border-white/10 text-white/40 bg-white/5'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeTab === 'leaderboard' && <LeaderboardSection />}
            {activeTab === 'simulator'   && <SimulatorSection />}
            {activeTab === 'finder'      && <TaskFitSection />}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        <Reveal delay={0.1}>
          <div className="mt-20 cta-banner-card border border-[#06B6D4]/20 rounded-3xl p-8 md:p-12 text-center select-none backdrop-blur-md">
            <h2 className="text-2xl md:text-3xl font-black mb-3">
              Ready to run a model locally?
            </h2>
            <p className="text-sm max-w-lg mx-auto mb-6">
              Install Odysseus AI and connect any of these models locally with Ollama — no cloud, no API keys, zero data tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/odysseus-ai-install"
                className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 !text-white px-8 py-4 rounded-2xl font-black text-base border border-[#06B6D4] shadow-[0_0_20px_rgba(6, 182, 212,0.4)] hover:translate-y-[-2px] hover:shadow-[0_0_25px_rgba(6, 182, 212,0.6)] active:translate-y-0 active:shadow-[0_0_15px_rgba(6, 182, 212,0.3)] transition-all flex items-center justify-center gap-2"
              >
                Install Odysseus AI <ArrowRight size={18} />
              </a>
              <a
                href="/odysseus-install/ollama"
                className="bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 !text-[#06B6D4] px-8 py-4 rounded-2xl font-black text-base border border-[#06B6D4]/30 hover:border-[#06B6D4]/50 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Ollama Setup Guide <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </Reveal>

      </div>
    </>
  );
};

export default BenchmarkPage;
