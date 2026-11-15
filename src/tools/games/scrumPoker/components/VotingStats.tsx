import React from 'react';
import { Award, BarChart3, CheckCircle2, MessageSquare, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Participant, VotingStats as StatsType } from '../types';

interface VotingStatsProps {
  stats: StatsType;
  participants: Participant[];
  t: (key: string, options?: any) => string;
}

export const VotingStatsDisplay: React.FC<VotingStatsProps> = ({ stats, participants, t }) => {
  const voters = participants.filter((p) => p.role === 'voter' || p.isHost);
  const votesByValue: Record<string, string[]> = {};
  voters.forEach((p) => {
    if (p.hasVoted && p.vote !== null && p.vote !== undefined) {
      const key = String(p.vote);
      if (!votesByValue[key]) votesByValue[key] = [];
      votesByValue[key].push(p.name);
    }
  });

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg sp-fade-slide">
      {/* Consensus / Alignment Banner */}
      <div className="mb-5">
        {stats.hasConsensus ? (
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-100 flex items-center">
                {t('tools.scrumPoker.stats.unanimousTitle', { defaultValue: '🎉 Unanimous Consensus!' })}
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                {t('tools.scrumPoker.stats.unanimousDesc', {
                  defaultValue: 'Everyone agreed on {{mode}} points! Ready to accept estimate.',
                  mode: stats.mode,
                })}
              </p>
            </div>
          </div>
        ) : stats.agreementPercentage >= 65 ? (
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 text-blue-800 dark:text-blue-200">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-blue-900 dark:text-blue-100">
                {t('tools.scrumPoker.stats.strongAgreement', {
                  defaultValue: '👍 Strong Agreement ({{percent}}%) on {{mode}} points',
                  percent: stats.agreementPercentage,
                  mode: stats.mode,
                })}
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {t('tools.scrumPoker.stats.strongAgreementDesc', {
                  defaultValue: 'The majority aligns on {{mode}}. Quick consensus recommended.',
                  mode: stats.mode,
                })}
              </p>
            </div>
          </div>
        ) : stats.min !== null && stats.max !== null && stats.max - stats.min >= 5 ? (
          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-800 dark:text-amber-200">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow mt-0.5">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-amber-900 dark:text-amber-100">
                {t('tools.scrumPoker.stats.divergenceTitle', {
                  defaultValue: '💬 Variance Detected ({{min}} vs {{max}})',
                  min: stats.min,
                  max: stats.max,
                })}
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {t('tools.scrumPoker.stats.divergenceDesc', {
                  defaultValue:
                    'Recommend a 2-minute sync between lowest ({{lowest}}) and highest ({{highest}}) to clarify requirements.',
                  lowest: stats.lowestVoters.join(', ') || String(stats.min),
                  highest: stats.highestVoters.join(', ') || String(stats.max),
                })}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {t('tools.scrumPoker.stats.resultsReady', { defaultValue: 'Votes Revealed' })}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('tools.scrumPoker.stats.resultsReadyDesc', {
                  defaultValue: '{{count}} of {{total}} team members voted.',
                  count: stats.totalVotes,
                  total: stats.totalVoters,
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('tools.scrumPoker.stats.average', { defaultValue: 'Average' })}
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {stats.average !== null ? stats.average : '—'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('tools.scrumPoker.stats.median', { defaultValue: 'Median' })}
          </span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {stats.median !== null ? stats.median : '—'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('tools.scrumPoker.stats.mode', { defaultValue: 'Mode' })}
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.mode !== null ? stats.mode : '—'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('tools.scrumPoker.stats.agreement', { defaultValue: 'Agreement' })}
          </span>
          <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {stats.agreementPercentage}%
          </span>
        </div>
      </div>

      {/* Distribution Breakdown Bars */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center">
          <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
          {t('tools.scrumPoker.stats.voteDistribution', { defaultValue: 'Vote Distribution' })}
        </h5>

        <div className="space-y-2.5">
          {Object.entries(stats.distribution).map(([val, count]) => {
            const pct = Math.round((count / stats.totalVotes) * 100);
            const votersList = votesByValue[val] || [];
            return (
              <div key={val} className="flex flex-col text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm w-8 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-center text-slate-800 dark:text-slate-200">
                      {val}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-md">
                      {votersList.join(', ')}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {count} {count === 1 ? 'vote' : 'votes'} ({pct}%)
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

