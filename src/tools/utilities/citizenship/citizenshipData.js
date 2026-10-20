import questionsData from '../../../data/citizenship/canadian_citizenship_all_questions.json';

const STORAGE_KEY = 'stackkit_citizenship_progress_v1';

/**
 * Metadata about the dataset and exam specifications
 */
export function getMeta() {
  return questionsData.meta || {
    totalQuestions: 600,
    totalTests: 30,
    questionsPerTest: 20,
    passingScore: 15,
    passingPercentage: 75,
    timeLimitMinutes: 45,
    topics: []
  };
}

/**
 * Returns summary list of all 30 tests
 */
export function getTestsList() {
  const tests = questionsData.tests || {};
  const list = [];

  for (let i = 1; i <= 30; i++) {
    const key = String(i);
    const questions = tests[key] || [];
    const topicsSet = new Set();
    questions.forEach(q => {
      if (q.topic && q.topic !== 'undefined') topicsSet.add(q.topic);
    });

    list.push({
      id: i,
      testNumber: i,
      title: `Practice Test ${i}`,
      questionCount: questions.length || 20,
      topics: Array.from(topicsSet)
    });
  }

  return list;
}

/**
 * Returns questions for a specific test number (1..30)
 */
export function getTestQuestions(testNumber) {
  const key = String(testNumber);
  const questions = questionsData.tests?.[key] || [];
  return questions.map(q => ({
    ...q,
    // Ensure clean topic display
    cleanTopic: (!q.topic || q.topic === 'undefined') ? 'Rights and Responsibilities of Citizenship' : q.topic
  }));
}

/**
 * Returns all distinct topics with their question counts
 */
export function getTopicsList() {
  const byTopic = questionsData.byTopic || {};
  const topicsList = [];

  Object.keys(byTopic).forEach(topicName => {
    const cleanName = (!topicName || topicName === 'undefined') ? 'Rights and Responsibilities of Citizenship' : topicName;
    const existing = topicsList.find(t => t.name === cleanName);
    const count = byTopic[topicName].length;

    if (existing) {
      existing.count += count;
      existing.questionIds.push(...byTopic[topicName]);
    } else {
      topicsList.push({
        name: cleanName,
        count,
        questionIds: [...byTopic[topicName]]
      });
    }
  });

  return topicsList.sort((a, b) => b.count - a.count);
}

/**
 * Returns questions for a specific topic
 */
export function getTopicQuestions(topicName, limit = 20) {
  const all = questionsData.all || [];
  const matched = all.filter(q => {
    const qTopic = (!q.topic || q.topic === 'undefined') ? 'Rights and Responsibilities of Citizenship' : q.topic;
    return qTopic.toLowerCase() === topicName.toLowerCase();
  });

  // Shuffle and limit
  const shuffled = [...matched].sort(() => Math.random() - 0.5);
  return (limit ? shuffled.slice(0, limit) : shuffled).map(q => ({
    ...q,
    cleanTopic: topicName
  }));
}

/**
 * Returns a randomized 20-question exam simulating the official IRCC citizenship test
 */
export function getRandomSimulation(count = 20) {
  const all = questionsData.all || [];
  if (all.length === 0) return [];

  // Group by topic to sample representatively
  const topicsList = getTopicsList();
  const selected = [];
  const selectedIds = new Set();

  // Try to pick at least 1 question per major topic
  topicsList.forEach(topic => {
    if (selected.length < count && topic.questionIds.length > 0) {
      const available = topic.questionIds.filter(id => !selectedIds.has(id));
      if (available.length > 0) {
        const randomId = available[Math.floor(Math.random() * available.length)];
        const q = all.find(item => item.id === randomId);
        if (q) {
          selected.push({
            ...q,
            cleanTopic: topic.name
          });
          selectedIds.add(q.id);
        }
      }
    }
  });

  // Fill the remainder randomly from remaining pool
  const pool = all.filter(q => !selectedIds.has(q.id));
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);

  while (selected.length < count && shuffledPool.length > 0) {
    const q = shuffledPool.pop();
    selected.push({
      ...q,
      cleanTopic: (!q.topic || q.topic === 'undefined') ? 'Rights and Responsibilities of Citizenship' : q.topic
    });
  }

  // Final shuffle of the selected 20 questions
  return selected.sort(() => Math.random() - 0.5);
}

/**
 * Returns questions by a list of question IDs
 */
export function getQuestionsByIds(ids = []) {
  const all = questionsData.all || [];
  const idSet = new Set(ids);
  return all
    .filter(q => idSet.has(q.id))
    .map(q => ({
      ...q,
      cleanTopic: (!q.topic || q.topic === 'undefined') ? 'Rights and Responsibilities of Citizenship' : q.topic
    }));
}

/**
 * Load user progress from localStorage
 */
export function loadUserProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw);
    return {
      completedTests: parsed.completedTests || {},
      simulationHistory: parsed.simulationHistory || [],
      mistakeQuestionIds: parsed.mistakeQuestionIds || [],
      savedQuestionIds: parsed.savedQuestionIds || [],
      streakDays: parsed.streakDays || 1,
      lastActiveDate: parsed.lastActiveDate || new Date().toISOString()
    };
  } catch (e) {
    console.error('Failed to load citizenship progress:', e);
    return getDefaultProgress();
  }
}

function getDefaultProgress() {
  return {
    completedTests: {},
    simulationHistory: [],
    mistakeQuestionIds: [],
    savedQuestionIds: [],
    streakDays: 1,
    lastActiveDate: new Date().toISOString()
  };
}

/**
 * Save user progress to localStorage
 */
export function saveUserProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save citizenship progress:', e);
  }
}

/**
 * Record completed test attempt
 */
export function recordTestCompletion(testNumber, score, total, userAnswers = {}, questions = []) {
  const progress = loadUserProgress();
  const testKey = String(testNumber);
  const passed = score >= 15;

  // Update completedTests
  const existing = progress.completedTests[testKey];
  const bestScore = existing ? Math.max(existing.score, score) : score;

  progress.completedTests[testKey] = {
    testNumber,
    score,
    total,
    bestScore,
    passed: bestScore >= 15,
    lastAttemptDate: new Date().toISOString(),
    attemptsCount: (existing?.attemptsCount || 0) + 1
  };

  // Update mistakes: add wrong questions, remove newly corrected ones
  const mistakeSet = new Set(progress.mistakeQuestionIds);
  questions.forEach(q => {
    const userAnswer = userAnswers[q.id];
    if (userAnswer) {
      if (userAnswer === q.correct) {
        mistakeSet.delete(q.id);
      } else {
        mistakeSet.add(q.id);
      }
    }
  });
  progress.mistakeQuestionIds = Array.from(mistakeSet);
  progress.lastActiveDate = new Date().toISOString();

  saveUserProgress(progress);
  return progress;
}

/**
 * Record completed simulation exam attempt
 */
export function recordSimulationCompletion(score, total, timeSpentSeconds, userAnswers = {}, questions = []) {
  const progress = loadUserProgress();
  const passed = score >= 15;

  const simulationEntry = {
    id: `sim_${Date.now()}`,
    score,
    total,
    percentage: Math.round((score / total) * 100),
    passed,
    timeSpentSeconds,
    date: new Date().toISOString()
  };

  progress.simulationHistory.unshift(simulationEntry);
  if (progress.simulationHistory.length > 20) {
    progress.simulationHistory = progress.simulationHistory.slice(0, 20);
  }

  // Update mistakes
  const mistakeSet = new Set(progress.mistakeQuestionIds);
  questions.forEach(q => {
    const userAnswer = userAnswers[q.id];
    if (userAnswer) {
      if (userAnswer === q.correct) {
        mistakeSet.delete(q.id);
      } else {
        mistakeSet.add(q.id);
      }
    }
  });
  progress.mistakeQuestionIds = Array.from(mistakeSet);
  progress.lastActiveDate = new Date().toISOString();

  saveUserProgress(progress);
  return progress;
}

/**
 * Toggle bookmark on a question
 */
export function toggleBookmarkQuestion(questionId) {
  const progress = loadUserProgress();
  const set = new Set(progress.savedQuestionIds);
  if (set.has(questionId)) {
    set.delete(questionId);
  } else {
    set.add(questionId);
  }
  progress.savedQuestionIds = Array.from(set);
  saveUserProgress(progress);
  return progress;
}

/**
 * Remove a question from the mistakes list
 */
export function removeMistakeQuestion(questionId) {
  const progress = loadUserProgress();
  progress.mistakeQuestionIds = progress.mistakeQuestionIds.filter(id => id !== questionId);
  saveUserProgress(progress);
  return progress;
}

/**
 * Reset all user progress
 */
export function resetAllProgress() {
  const fresh = getDefaultProgress();
  saveUserProgress(fresh);
  return fresh;
}

/**
 * Computes high-level readiness metrics for the dashboard
 */
export function calculateReadiness(progress) {
  const completedKeys = Object.keys(progress.completedTests || {});
  const completedCount = completedKeys.length;
  const totalTests = 30;

  let totalScore = 0;
  let passedCount = 0;

  completedKeys.forEach(k => {
    const test = progress.completedTests[k];
    totalScore += (test.bestScore / test.total);
    if (test.passed) passedCount++;
  });

  const avgScore = completedCount > 0 ? Math.round((totalScore / completedCount) * 100) : 0;
  const completionRate = Math.round((completedCount / totalTests) * 100);
  
  // Readiness is a weighted blend of coverage (40%) and average accuracy (60%)
  const readiness = completedCount > 0
    ? Math.min(100, Math.round((completionRate * 0.4) + (avgScore * 0.6)))
    : 0;

  return {
    readiness,
    completedCount,
    totalTests,
    passedCount,
    avgScore,
    simulationsCount: (progress.simulationHistory || []).length,
    mistakesCount: (progress.mistakeQuestionIds || []).length,
    savedCount: (progress.savedQuestionIds || []).length
  };
}
