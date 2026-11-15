import { Participant, VotingStats } from '../types';

export function calculateVotingStats(participants: Participant[]): VotingStats {
  const voters = participants.filter((p) => p.role === 'voter' || p.isHost);
  const totalVoters = voters.length;
  const votedParticipants = voters.filter((p) => p.hasVoted && p.vote !== null && p.vote !== undefined);
  const totalVotes = votedParticipants.length;

  const distribution: Record<string, number> = {};
  votedParticipants.forEach((p) => {
    const valKey = String(p.vote);
    distribution[valKey] = (distribution[valKey] || 0) + 1;
  });

  // Numeric votes for statistical analysis
  const numericVotes: { val: number; name: string }[] = [];
  votedParticipants.forEach((p) => {
    const num = Number(p.vote);
    if (!isNaN(num) && typeof p.vote !== 'string' || (!isNaN(num) && p.vote !== '?' && p.vote !== '☕')) {
      numericVotes.push({ val: num, name: p.name });
    }
  });

  numericVotes.sort((a, b) => a.val - b.val);

  let average: number | null = null;
  let median: number | null = null;
  let min: number | null = null;
  let max: number | null = null;
  let highestVoters: string[] = [];
  let lowestVoters: string[] = [];

  if (numericVotes.length > 0) {
    const sum = numericVotes.reduce((acc, curr) => acc + curr.val, 0);
    average = Math.round((sum / numericVotes.length) * 10) / 10;

    min = numericVotes[0].val;
    max = numericVotes[numericVotes.length - 1].val;

    lowestVoters = numericVotes.filter((v) => v.val === min).map((v) => v.name);
    highestVoters = numericVotes.filter((v) => v.val === max).map((v) => v.name);

    const mid = Math.floor(numericVotes.length / 2);
    if (numericVotes.length % 2 === 0) {
      median = Math.round(((numericVotes[mid - 1].val + numericVotes[mid].val) / 2) * 10) / 10;
    } else {
      median = numericVotes[mid].val;
    }
  }

  // Find Mode across all votes (including T-shirt sizes)
  let mode: string | number | null = null;
  let maxCount = 0;
  Object.entries(distribution).forEach(([key, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mode = isNaN(Number(key)) ? key : Number(key);
    }
  });

  const agreementPercentage =
    totalVotes > 0 ? Math.round((maxCount / totalVotes) * 100) : 0;

  const hasConsensus =
    totalVotes >= 2 && Object.keys(distribution).length === 1 && totalVotes === totalVoters;

  return {
    totalVoters,
    totalVotes,
    average,
    median,
    mode,
    min,
    max,
    agreementPercentage,
    hasConsensus,
    distribution,
    highestVoters,
    lowestVoters,
  };
}

