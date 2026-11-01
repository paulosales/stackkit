import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Play,
  Grid,
  Check,
  Info,
  AlertTriangle,
  X,
  Compass
} from 'lucide-react';

import {
  getTestsList,
  getTestQuestions,
  getTopicsList,
  getTopicQuestions,
  getRandomSimulation,
  getQuestionsByIds,
  loadUserProgress,
  recordTestCompletion,
  recordSimulationCompletion,
  toggleBookmarkQuestion,
  removeMistakeQuestion,
  calculateReadiness
} from './citizenship/citizenshipData';

import { citizenshipTranslations } from './citizenship/citizenshipTranslations';
import './CanadianCitizenshipTest.css';

export default function CanadianCitizenshipTest({ lang: appLang = 'en', onToast }) {
  const { i18n } = useTranslation();
  const activeLang = i18n.language || appLang;

  const getResolvedLang = (l) => {
    if (l === 'pt') return 'pt';
    if (l === 'es') return 'es';
    if (l === 'fr') return 'fr';
    return 'en';
  };

  // Allow user to select EN, PT, ES or FR, defaulting to app language
  const [currentLang, setCurrentLang] = useState(() => getResolvedLang(activeLang));

  // Sync when active language changes in StackKit
  useEffect(() => {
    setCurrentLang(getResolvedLang(activeLang));
  }, [activeLang]);

  const t = citizenshipTranslations[currentLang] || citizenshipTranslations.en;

  // Navigation views: 'hub' | 'practice_list' | 'quiz' | 'simulation_intro' | 'simulation_quiz' | 'simulation_results' | 'review' | 'study'
  const [view, setView] = useState('hub');
  const [activeModal, setActiveModal] = useState(null); // 'info' | 'faq' | 'reset' | null

  // User progress stored in localStorage
  const [userProgress, setUserProgress] = useState(() => loadUserProgress());

  // Active quiz session state
  const [activeTestNum, setActiveTestNum] = useState(1);
  const [activeSessionTitle, setActiveSessionTitle] = useState('');
  const [quizMode, setQuizMode] = useState('practice'); // 'practice' | 'simulation' | 'topic' | 'review_mistakes' | 'review_saved'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOption }
  const [flaggedIds, setFlaggedIds] = useState(new Set()); // for simulation
  const [showMatrix, setShowMatrix] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // Timers
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(45 * 60); // 45 minutes for simulation
  const [timeExpired, setTimeExpired] = useState(false);
  const timerRef = useRef(null);

  // Simulation results
  const [simResult, setSimResult] = useState(null);

  // Filter for practice list: 'all' | 'passed' | 'pending'
  const [testFilter, setTestFilter] = useState('all');

  // Review tab: 'mistakes' | 'saved'
  const [reviewTab, setReviewTab] = useState('mistakes');

  const readinessStats = useMemo(() => {
    return calculateReadiness(userProgress);
  }, [userProgress]);

  const allTests = useMemo(() => getTestsList(), []);
  const allTopics = useMemo(() => getTopicsList(), []);

  // Timer effect for quiz and simulation
  useEffect(() => {
    if (view === 'quiz') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else if (view === 'simulation_quiz') {
      timerRef.current = setInterval(() => {
        setCountdownSeconds(s => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setTimeExpired(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // Start Test Handlers
  // -------------------------------------------------------------
  const handleStartPracticeTest = (testNum) => {
    const testQs = getTestQuestions(testNum);
    setActiveTestNum(testNum);
    setActiveSessionTitle(`${t.practiceTest} ${testNum}`);
    setQuizMode('practice');
    setQuestions(testQs);
    setCurrentIndex(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setView('quiz');
  };

  const handleStartTopicTest = (topicName) => {
    const topicQs = getTopicQuestions(topicName, 20);
    setActiveSessionTitle(topicName);
    setQuizMode('topic');
    setQuestions(topicQs);
    setCurrentIndex(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setView('quiz');
  };

  const handleStartSimulation = () => {
    const simQs = getRandomSimulation(20);
    setActiveSessionTitle(t.simulation);
    setQuizMode('simulation');
    setQuestions(simQs);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedIds(new Set());
    setCountdownSeconds(45 * 60);
    setView('simulation_quiz');
  };

  const handleStartMistakesQuiz = () => {
    const mistakeQs = getQuestionsByIds(userProgress.mistakeQuestionIds);
    if (mistakeQs.length === 0) return;
    setActiveSessionTitle(t.reviewMistakes);
    setQuizMode('review_mistakes');
    setQuestions(mistakeQs);
    setCurrentIndex(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setView('quiz');
  };

  const handleStartSavedQuiz = () => {
    const savedQs = getQuestionsByIds(userProgress.savedQuestionIds);
    if (savedQs.length === 0) return;
    setActiveSessionTitle(t.saved);
    setQuizMode('review_saved');
    setQuestions(savedQs);
    setCurrentIndex(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setView('quiz');
  };

  // -------------------------------------------------------------
  // Quiz Interaction
  // -------------------------------------------------------------
  const currentQuestion = questions[currentIndex] || null;
  const isQuestionSaved = currentQuestion ? userProgress.savedQuestionIds.includes(currentQuestion.id) : false;
  const isCurrentFlagged = currentQuestion ? flaggedIds.has(currentQuestion.id) : false;

  const handleSelectOption = (option) => {
    if (!currentQuestion) return;
    // In practice mode, lock once selected
    if (quizMode === 'practice' || quizMode === 'topic' || quizMode === 'review_mistakes' || quizMode === 'review_saved') {
      if (userAnswers[currentQuestion.id]) return;
    }

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handleToggleBookmark = (questionId) => {
    const updated = toggleBookmarkQuestion(questionId);
    setUserProgress(updated);
    if (onToast) {
      const isSaved = updated.savedQuestionIds.includes(questionId);
      onToast(isSaved ? t.savedBookmarkToast : t.removedBookmarkToast);
    }
  };

  const handleToggleFlag = (questionId) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleFinishPractice = () => {
    // Calculate score
    let score = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correct) score++;
    });

    if (quizMode === 'practice') {
      const updated = recordTestCompletion(activeTestNum, score, questions.length, userAnswers, questions);
      setUserProgress(updated);
    }

    setView('practice_list');
    if (onToast) {
      const pct = Math.round((score / questions.length) * 100);
      onToast(t.testCompletedToast.replace('{{score}}', score).replace('{{total}}', questions.length).replace('{{pct}}', pct));
    }
  };

  const handleSubmitSimulation = useCallback(() => {
    let score = 0;
    const topicStats = {};

    questions.forEach(q => {
      const correct = userAnswers[q.id] === q.correct;
      if (correct) score++;

      const topicKey = q.cleanTopic || 'General';
      if (!topicStats[topicKey]) {
        topicStats[topicKey] = { total: 0, correct: 0 };
      }
      topicStats[topicKey].total++;
      if (correct) topicStats[topicKey].correct++;
    });

    const total = questions.length || 20;
    const timeSpentSeconds = (45 * 60) - countdownSeconds;
    const passed = score >= 15;

    const updated = recordSimulationCompletion(score, total, timeSpentSeconds, userAnswers, questions);
    setUserProgress(updated);

    setSimResult({
      score,
      total,
      percentage: Math.round((score / total) * 100),
      passed,
      timeSpentSeconds,
      topicStats,
      questions,
      answers: userAnswers
    });

    setConfirmSubmitOpen(false);
    setView('simulation_results');
  }, [questions, userAnswers, countdownSeconds]);

  useEffect(() => {
    if (timeExpired && view === 'simulation_quiz') {
      handleSubmitSimulation();
      setTimeExpired(false);
    }
  }, [timeExpired, view, handleSubmitSimulation]);

  // -------------------------------------------------------------
  // Filtered Practice Tests
  // -------------------------------------------------------------
  const filteredTests = useMemo(() => {
    return allTests.filter(test => {
      const key = String(test.testNumber);
      const testData = userProgress.completedTests[key];
      if (testFilter === 'passed') return testData && testData.passed;
      if (testFilter === 'pending') return !testData || !testData.passed;
      return true;
    });
  }, [allTests, userProgress, testFilter]);

  // Current practice score in active practice test
  const currentLiveScore = useMemo(() => {
    let correct = 0;
    let answered = 0;
    questions.forEach(q => {
      if (userAnswers[q.id]) {
        answered++;
        if (userAnswers[q.id] === q.correct) correct++;
      }
    });
    return { correct, answered };
  }, [questions, userAnswers]);

  // =============================================================
  // RENDER SECTIONS
  // =============================================================

  // Shared Sub-Header Banner (Navigation between modes)
  const renderNavBanner = () => (
    <div className="cct-nav-banner">
      <div className="cct-brand" onClick={() => setView('hub')}>
        <div className="cct-leaf-logo">
          <Award size={18} />
        </div>
        <div className="cct-brand-text">
          <span className="cct-brand-name">Discover Canada</span>
          <span className="cct-brand-tag">{t.subtitle.split(',')[0]}</span>
        </div>
      </div>

      <div className="cct-nav-links">
        <button
          className={`cct-nav-btn ${view === 'hub' ? 'active' : ''}`}
          onClick={() => setView('hub')}
        >
          {t.home}
        </button>
        <button
          className={`cct-nav-btn ${view === 'practice_list' || (view === 'quiz' && quizMode === 'practice') ? 'active' : ''}`}
          onClick={() => setView('practice_list')}
        >
          {t.practice}
        </button>
        <button
          className={`cct-nav-btn ${view.startsWith('simulation') ? 'active' : ''}`}
          onClick={() => setView('simulation_intro')}
        >
          {t.simulation}
        </button>
        <button
          className={`cct-nav-btn ${view === 'review' ? 'active' : ''}`}
          onClick={() => setView('review')}
        >
          {t.review}
          {userProgress.mistakeQuestionIds.length > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: 10,
              padding: '1px 5px',
              borderRadius: 10,
              fontWeight: 700
            }}>
              {userProgress.mistakeQuestionIds.length}
            </span>
          )}
        </button>
        <button
          className={`cct-nav-btn ${view === 'study' ? 'active' : ''}`}
          onClick={() => setView('study')}
        >
          {t.study}
        </button>
      </div>

      <div className="cct-lang-selector">
        {['en', 'pt', 'es', 'fr'].map(l => (
          <button
            key={l}
            className={`cct-lang-btn ${currentLang === l ? 'active' : ''}`}
            onClick={() => setCurrentLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // 1. HUB / DASHBOARD VIEW
  // -------------------------------------------------------------
  const renderHub = () => (
    <div className="cct-wrapper">
      {renderNavBanner()}

      {/* Hero Title */}
      <div className="cct-hero">
        <h1 className="cct-hero-title">
          <span className="accent">Canadian</span><br />
          Citizenship Test
        </h1>
        <p className="cct-hero-sub">{t.subtitle}</p>
        <div className="cct-hero-badges">
          <button
            className="cct-badge-pill gold"
            onClick={() => setActiveModal('info')}
            style={{ cursor: 'pointer' }}
          >
            <Info size={13} />
            <span>{t.testInfo}</span>
          </button>
          <button
            className="cct-badge-pill"
            onClick={() => setActiveModal('faq')}
            style={{ cursor: 'pointer' }}
          >
            <HelpCircle size={13} />
            <span>{t.faq}</span>
          </button>
          <span className="cct-badge-pill">
            <Clock size={13} />
            <span>{t.testSpecs}</span>
          </span>
        </div>
      </div>

      {/* Readiness Gauge Card */}
      <div className="cct-readiness-card">
        <div className="cct-readiness-left">
          <div className="cct-gauge-wrapper">
            <svg className="cct-gauge-svg" viewBox="0 0 72 72">
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="var(--border-subtle, rgba(255,255,255,0.1))"
                strokeWidth="6"
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="#d97706"
                strokeWidth="6"
                strokeDasharray="188.4"
                strokeDashoffset={188.4 - (188.4 * readinessStats.readiness) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <span className="cct-gauge-value">{readinessStats.readiness}%</span>
          </div>

          <div className="cct-readiness-info">
            <h3>{t.readinessScore}</h3>
            <p>
              {readinessStats.completedCount === 0
                ? t.startPracticingHint
                : t.testsPassedSummary.replace('{{count}}', readinessStats.passedCount)}
            </p>
          </div>
        </div>

        <div className="cct-stats-grid">
          <div className="cct-stat-box">
            <span className="cct-stat-num">{readinessStats.completedCount}/30</span>
            <span className="cct-stat-label">{t.completed}</span>
          </div>
          <div className="cct-stat-box">
            <span className="cct-stat-num">{readinessStats.avgScore}%</span>
            <span className="cct-stat-label">{t.avgScore}</span>
          </div>
          <div className="cct-stat-box">
            <span className="cct-stat-num">{readinessStats.mistakesCount}</span>
            <span className="cct-stat-label">{t.mistakes}</span>
          </div>
        </div>
      </div>

      {/* Main 4 Action Cards (Study, Practice, Review, Mock) */}
      <div className="cct-cards-grid">
        {/* Practice Card */}
        <div className="cct-card" onClick={() => setView('practice_list')}>
          <div className="cct-card-left">
            <div className="cct-card-icon">
              <GraduationCap size={26} />
            </div>
            <div className="cct-card-text">
              <h3 className="cct-card-title">{t.practice}</h3>
              <p className="cct-card-desc">{t.practiceDesc}</p>
              <div className="cct-card-meta">
                {t.practiceMeta.replace('{{completed}}', readinessStats.completedCount).replace('{{passed}}', readinessStats.passedCount)}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" />
        </div>

        {/* Mock Simulation Card */}
        <div className="cct-card" onClick={() => setView('simulation_intro')}>
          <div className="cct-card-left">
            <div className="cct-card-icon red">
              <Award size={26} />
            </div>
            <div className="cct-card-text">
              <h3 className="cct-card-title">{t.simulation}</h3>
              <p className="cct-card-desc">{t.simulationDesc}</p>
              <div className="cct-card-meta">
                {t.attemptsCount.replace('{{count}}', userProgress.simulationHistory.length)}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" />
        </div>

        {/* Review Card */}
        <div className="cct-card" onClick={() => setView('review')}>
          <div className="cct-card-left">
            <div className="cct-card-icon blue">
              <RotateCcw size={26} />
            </div>
            <div className="cct-card-text">
              <h3 className="cct-card-title">{t.review}</h3>
              <p className="cct-card-desc">{t.reviewDesc}</p>
              <div className="cct-card-meta">
                {t.reviewMeta.replace('{{mistakes}}', userProgress.mistakeQuestionIds.length).replace('{{saved}}', userProgress.savedQuestionIds.length)}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" />
        </div>

        {/* Study Chapters Card */}
        <div className="cct-card" onClick={() => setView('study')}>
          <div className="cct-card-left">
            <div className="cct-card-icon emerald">
              <BookOpen size={26} />
            </div>
            <div className="cct-card-text">
              <h3 className="cct-card-title">{t.study}</h3>
              <p className="cct-card-desc">{t.studyDesc}</p>
              <div className="cct-card-meta">
                {t.chaptersMeta.replace('{{count}}', allTopics.length)}
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" />
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // 2. PRACTICE TESTS LIST VIEW
  // -------------------------------------------------------------
  const renderPracticeList = () => (
    <div className="cct-wrapper">
      {renderNavBanner()}

      <div className="cct-practice-section">
        <div className="cct-tests-header">
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>
              {t.practice}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
              {t.completedLabel} <strong>{readinessStats.completedCount}/30</strong> · {t.avgScoreLabel} <strong>{readinessStats.avgScore}%</strong>
            </p>
          </div>

          <div className="cct-filter-tabs">
            <button
              className={`cct-filter-btn ${testFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTestFilter('all')}
            >
              {t.filterAll} (30)
            </button>
            <button
              className={`cct-filter-btn ${testFilter === 'passed' ? 'active' : ''}`}
              onClick={() => setTestFilter('passed')}
            >
              {t.filterPassed} ({readinessStats.passedCount})
            </button>
            <button
              className={`cct-filter-btn ${testFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setTestFilter('pending')}
            >
              {t.filterPending} ({30 - readinessStats.passedCount})
            </button>
          </div>
        </div>

        {/* 30-Test Matrix Grid */}
        <div className="cct-leaf-grid-box">
          <div className="cct-leaf-grid">
            {allTests.map(test => {
              const testKey = String(test.testNumber);
              const result = userProgress.completedTests[testKey];
              let statusClass = 'not-started';
              if (result) {
                statusClass = result.passed ? 'passed' : 'attempted';
              }

              return (
                <div
                  key={test.id}
                  className={`cct-leaf-item ${statusClass}`}
                  onClick={() => handleStartPracticeTest(test.testNumber)}
                  title={`${t.practiceTest} ${test.testNumber}: ${result ? `${result.score}/20 (${result.passed ? t.passed : t.needsPractice})` : t.notStarted}`}
                >
                  {result?.passed ? <Check size={12} strokeWidth={3} /> : test.testNumber}
                </div>
              );
            })}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {t.leafLegend}
          </span>
        </div>

        {/* Cards list for filtered tests */}
        <div className="cct-tests-cards-grid">
          {filteredTests.map(test => {
            const testKey = String(test.testNumber);
            const result = userProgress.completedTests[testKey];

            return (
              <div
                key={test.id}
                className="cct-test-item-card"
                onClick={() => handleStartPracticeTest(test.testNumber)}
              >
                <div className="cct-test-item-left">
                  <div className={`cct-test-num-badge ${result?.passed ? 'passed' : ''}`}>
                    {test.testNumber}
                  </div>
                  <div className="cct-test-meta">
                    <h4>{t.practiceTest} {test.testNumber}</h4>
                    <p>
                      {result ? (
                        <span style={{ color: result.passed ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                          {t.bestScoreLabel} {result.bestScore}/20 ({Math.round((result.bestScore / 20) * 100)}%)
                        </span>
                      ) : (
                        <span>20 {t.questions} · {t.notStarted}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d97706' }}>
                  <Play size={18} fill="#d97706" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // 3. ACTIVE QUIZ (Practice / Topic / Mistakes / Saved)
  // -------------------------------------------------------------
  const renderQuiz = () => {
    if (!currentQuestion) {
      return (
        <div className="cct-wrapper" style={{ textAlign: 'center', padding: 40 }}>
          <p>{t.noQuestionsInSession}</p>
          <button className="btn-primary" onClick={() => setView('hub')}>
            {t.returnToHub}
          </button>
        </div>
      );
    }

    const selectedOption = userAnswers[currentQuestion.id];
    const isAnswered = Boolean(selectedOption);
    const isCorrect = selectedOption === currentQuestion.correct;
    const isLast = currentIndex === questions.length - 1;

    return (
      <div className="cct-wrapper">
        <div className="cct-quiz-container">
          {/* Sub Top Bar */}
          <div className="cct-quiz-top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className="cct-nav-btn"
                onClick={() => {
                  if (quizMode === 'practice') handleFinishPractice();
                  else setView('hub');
                }}
              >
                <ChevronLeft size={16} />
                <span>{t.exit}</span>
              </button>
              {activeSessionTitle && (
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {activeSessionTitle}
                </span>
              )}
            </div>

            <div className="cct-quiz-timer">
              <Clock size={15} />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            <button
              className="cct-quiz-counter-btn"
              onClick={() => setShowMatrix(true)}
              title={t.viewAllQuestions}
            >
              <span>{t.question} {currentIndex + 1} {t.of} {questions.length}</span>
              <Grid size={14} />
            </button>
          </div>

          {/* 20-Segment Progress Bar */}
          <div className="cct-segment-bar">
            {questions.map((q, idx) => {
              const ans = userAnswers[q.id];
              let segClass = '';
              if (idx === currentIndex) segClass = 'current';
              else if (ans) {
                segClass = ans === q.correct ? 'correct' : 'incorrect';
              }
              return (
                <div
                  key={q.id}
                  className={`cct-segment ${segClass}`}
                  onClick={() => setCurrentIndex(idx)}
                  style={{ cursor: 'pointer' }}
                  title={`${t.question} ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Question Card */}
          <div className="cct-question-card">
            <div className="cct-question-card-header">
              <span className="cct-topic-pill">
                <Compass size={13} />
                <span>{currentQuestion.cleanTopic}</span>
              </span>

              <button
                className="btn-secondary"
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  gap: 6,
                  color: isQuestionSaved ? '#ef4444' : 'var(--text-secondary)'
                }}
                onClick={() => handleToggleBookmark(currentQuestion.id)}
              >
                <Bookmark
                  size={14}
                  fill={isQuestionSaved ? '#ef4444' : 'none'}
                  color={isQuestionSaved ? '#ef4444' : 'currentColor'}
                />
                <span>{isQuestionSaved ? t.unsaveQuestion : t.saveQuestion}</span>
              </button>
            </div>

            <h2 className="cct-question-text">
              {currentQuestion.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="cct-options-list">
              {currentQuestion.options.map((opt, oIdx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const isSelected = selectedOption === opt;
                let optClass = '';

                if (isAnswered) {
                  if (opt === currentQuestion.correct) {
                    optClass = 'correct';
                  } else if (isSelected) {
                    optClass = 'incorrect';
                  }
                } else if (isSelected) {
                  optClass = 'selected';
                }

                return (
                  <button
                    key={oIdx}
                    className={`cct-option-btn ${optClass}`}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                  >
                    <div className="cct-option-letter">
                      {letters[oIdx] || String(oIdx + 1)}
                    </div>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isAnswered && opt === currentQuestion.correct && (
                      <CheckCircle2 size={18} color="#10b981" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle size={18} color="#ef4444" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation Box in Practice Mode */}
            {isAnswered && (
              <div className={`cct-explanation-card ${isCorrect ? 'is-correct' : 'is-incorrect'}`}>
                <div className={`cct-exp-header ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>{isCorrect ? t.correct : t.incorrect}</span>
                </div>
                <div className="cct-exp-body">
                  {!isCorrect && (
                    <div style={{ marginBottom: 4 }}>
                      <strong>{t.correctAnswerIs}</strong> {currentQuestion.correct}
                    </div>
                  )}
                  <div>
                    {t.officialCitation}: <em>{currentQuestion.cleanTopic}</em> (Discover Canada)
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="cct-quiz-nav">
              <button
                className="btn-secondary"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={16} />
                <span>{t.previous}</span>
              </button>

              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                {t.score}: {currentLiveScore.correct} / {currentLiveScore.answered}
              </div>

              {isLast ? (
                <button
                  className="btn-primary"
                  onClick={handleFinishPractice}
                  style={{ background: '#d97706', borderColor: '#d97706' }}
                >
                  <Check size={16} />
                  <span>{t.finishTest}</span>
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                  style={{ background: '#d97706', borderColor: '#d97706' }}
                >
                  <span>{t.next}</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Matrix Navigator Popover */}
        {showMatrix && renderMatrixModal()}
      </div>
    );
  };

  // -------------------------------------------------------------
  // 4. SIMULATION INTRO BRIEFING
  // -------------------------------------------------------------
  const renderSimulationIntro = () => (
    <div className="cct-wrapper">
      {renderNavBanner()}

      <div className="cct-intro-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={28} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800 }}>
              {t.simulationIntroTitle}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
              {t.simulationIntroDesc}
            </p>
          </div>
        </div>

        <div className="cct-intro-rules">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>{t.simulationRule1}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>{t.simulationRule2}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>{t.simulationRule3}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>{t.simulationRule4}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: 15,
              fontWeight: 700,
              background: '#b45309',
              borderColor: '#b45309'
            }}
            onClick={handleStartSimulation}
          >
            <Play size={18} fill="#fff" />
            <span>{t.startSimulation}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // 5. ACTIVE SIMULATION EXAM (Authentic Official IRCC Test Interface)
  // -------------------------------------------------------------
  const renderSimulationQuiz = () => {
    if (!currentQuestion) return null;

    const selectedOption = userAnswers[currentQuestion.id];
    const answeredCount = Object.keys(userAnswers).length;
    const isUrgent = countdownSeconds < 5 * 60; // < 5 mins

    return (
      <div className="cct-wrapper">
        <div className="cct-official-test-wrapper">
          {/* Government of Canada Top Header */}
          <div className="cct-gov-header">
            <div className="cct-gov-brand">
              <div className="cct-flag-emblem">
                <span className="cct-flag-leaf">🍁</span>
              </div>
              <div className="cct-gov-text">
                <span className="cct-gov-title-en">Government of Canada</span>
                <span className="cct-gov-title-fr">Gouvernement du Canada</span>
              </div>
            </div>
            <div className="cct-gov-app-meta">
              <span>{t.appNumber} <strong>M2222222222</strong></span>
              <span>{t.uciNumber} <strong>1234567890</strong></span>
            </div>
          </div>

          {/* Test Title with Red Accent Line */}
          <div className="cct-gov-title-section">
            <h1 className="cct-gov-main-title">{t.onlineTestTitle}</h1>
            <div className="cct-gov-red-line" />
          </div>

          {/* Official 2-Column Test Layout */}
          <div className="cct-gov-layout">
            {/* Left Column: Question, Radio Options, Review Later & Actions */}
            <div className="cct-gov-question-col">
              <div className="cct-gov-q-counter">
                {t.question} {currentIndex + 1} {t.of} {questions.length}
              </div>

              <div className="cct-gov-q-prompt">
                {currentQuestion.question}
              </div>

              {/* Radio Multiple Choice Options */}
              <div className="cct-gov-options-list">
                {currentQuestion.options.map((opt, oIdx) => (
                  <label key={oIdx} className="cct-gov-option-row">
                    <input
                      type="radio"
                      name={`gov-question-${currentQuestion.id}`}
                      className="cct-gov-radio"
                      checked={selectedOption === opt}
                      onChange={() => handleSelectOption(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              {/* Review Later Checkbox */}
              <label className="cct-gov-review-later">
                <input
                  type="checkbox"
                  className="cct-gov-checkbox"
                  checked={isCurrentFlagged}
                  onChange={() => handleToggleFlag(currentQuestion.id)}
                />
                <span>{t.reviewLater}</span>
              </label>

              {/* Navigation Action Buttons */}
              <div className="cct-gov-btn-row">
                <button
                  className="cct-gov-btn-nav"
                  onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                >
                  {t.prevQuestion}
                </button>
                <button
                  className="cct-gov-btn-nav"
                  onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                  disabled={currentIndex === questions.length - 1}
                >
                  {t.nextQuestion}
                </button>
              </div>

              {/* Confirm Submission */}
              <div style={{ marginTop: 10 }}>
                <button
                  className="cct-gov-btn-submit"
                  onClick={() => {
                    if (answeredCount < questions.length) {
                      setConfirmSubmitOpen(true);
                    } else {
                      handleSubmitSimulation();
                    }
                  }}
                >
                  {t.confirmSubmission}
                </button>
              </div>

              {/* Exit Test simulation option */}
              <div style={{ marginTop: 22 }}>
                <button
                  onClick={() => {
                    if (window.confirm(t.exitSimConfirm)) {
                      setView('hub');
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: 13,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {t.exitSimBtn}
                </button>
              </div>
            </div>

            {/* Right Sidebar: Timer, 5x4 Grid Palette & Official Legend */}
            <div className="cct-gov-sidebar">
              <div className={`cct-gov-timer-box ${isUrgent ? 'urgent' : ''}`}>
                {t.timeLeft} {formatTime(countdownSeconds)}
              </div>

              <h3 className="cct-gov-sidebar-title">{t.questions}</h3>

              <div className="cct-gov-grid-palette">
                {questions.map((q, idx) => {
                  const isCur = idx === currentIndex;
                  const isFlagged = flaggedIds.has(q.id);
                  const isAns = Boolean(userAnswers[q.id]);

                  let statusClass = 'not-answered';
                  if (isCur) statusClass = 'current';
                  else if (isFlagged) statusClass = 'flagged';
                  else if (isAns) statusClass = 'answered';

                  return (
                    <button
                      key={q.id}
                      className={`cct-gov-q-btn ${statusClass}`}
                      onClick={() => setCurrentIndex(idx)}
                      title={`${t.question} ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Official Color Legend */}
              <div className="cct-gov-legend">
                <div className="cct-gov-legend-item">
                  <span className="cct-gov-legend-color yellow" />
                  <span>{t.toBeReviewed}</span>
                </div>
                <div className="cct-gov-legend-item">
                  <span className="cct-gov-legend-color gray" />
                  <span>{t.notAnswered}</span>
                </div>
                <div className="cct-gov-legend-item">
                  <span className="cct-gov-legend-color blue" />
                  <span>{t.answered}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Submit Dialog if questions remain unanswered */}
        {confirmSubmitOpen && (
          <div className="cct-matrix-overlay">
            <div className="cct-matrix-modal">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={24} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: 18 }}>{t.confirmSubmitTitle}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
                {t.simUnansweredWarning
                  .replace('{{answered}}', answeredCount)
                  .replace('{{total}}', questions.length)
                  .replace('{{remaining}}', questions.length - answeredCount)}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button className="btn-secondary" onClick={() => setConfirmSubmitOpen(false)}>
                  {t.cancel}
                </button>
                <button className="btn-primary" onClick={handleSubmitSimulation} style={{ background: '#ef4444', borderColor: '#ef4444' }}>
                  {t.confirmSubmitBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------
  // 6. SIMULATION RESULTS REPORT (Official Test Results)
  // -------------------------------------------------------------
  const renderSimulationResults = () => {
    if (!simResult) return null;
    const { score, total, percentage, passed, timeSpentSeconds, topicStats, questions: simQuestions, answers } = simResult;

    return (
      <div className="cct-wrapper">
        <div className="cct-official-test-wrapper">
          {/* Government of Canada Top Header */}
          <div className="cct-gov-header">
            <div className="cct-gov-brand">
              <div className="cct-flag-emblem">
                <span className="cct-flag-leaf">🍁</span>
              </div>
              <div className="cct-gov-text">
                <span className="cct-gov-title-en">Government of Canada</span>
                <span className="cct-gov-title-fr">Gouvernement du Canada</span>
              </div>
            </div>
            <div className="cct-gov-app-meta">
              <span>{t.appNumber} <strong>M2222222222</strong></span>
              <span>{t.uciNumber} <strong>1234567890</strong></span>
            </div>
          </div>

          {/* Test Title with Red Accent Line */}
          <div className="cct-gov-title-section">
            <h1 className="cct-gov-main-title">{t.onlineTestResultsTitle}</h1>
            <div className="cct-gov-red-line" />
          </div>

          <div className="cct-gov-results-card">
            {/* Pass/Fail Banner */}
            <div className={`cct-gov-result-banner ${passed ? 'passed' : 'failed'}`}>
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800 }}>
                  {passed ? t.simPassedTitle : t.simFailedTitle}
                </h2>
                <p style={{ margin: 0, fontSize: 14 }}>
                  {passed ? t.simPassedDesc : t.simFailedDesc}
                </p>
              </div>
            </div>

            {/* Score summary row */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid #e4e6eb', paddingBottom: 20 }}>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{t.finalScore}</div>
                <div className="cct-gov-score-hero" style={{ color: passed ? '#059669' : '#dc2626' }}>
                  {score} / {total}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{t.percentage}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#18181b' }}>{percentage}%</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{t.timeUsed}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#18181b' }}>{formatTime(timeSpentSeconds)}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{t.passingCriteria}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#18181b' }}>15 / 20 (75%)</div>
              </div>
            </div>

            {/* Breakdown by Discover Canada Topic */}
            <div>
              <h3 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700, color: '#18181b' }}>
                {t.perfByTopic}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(topicStats).map(([topic, stats]) => {
                  const topicPct = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={topic} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ fontWeight: 600 }}>{topic}</span>
                        <span style={{ fontWeight: 700, color: topicPct >= 75 ? '#059669' : '#d97706' }}>
                          {stats.correct} / {stats.total} ({topicPct}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: 7, background: '#e4e6eb', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${topicPct}%`, height: '100%', background: topicPct >= 75 ? '#10b981' : '#f59e0b', borderRadius: 4 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 10 }}>
              <button
                className="cct-gov-btn-submit"
                style={{ width: 'auto', padding: '10px 24px' }}
                onClick={handleStartSimulation}
              >
                {t.retakeSimulation}
              </button>
              {userProgress.mistakeQuestionIds.length > 0 && (
                <button
                  className="cct-gov-btn-nav"
                  style={{ width: 'auto', minWidth: 'auto', padding: '10px 20px' }}
                  onClick={handleStartMistakesQuiz}
                >
                  {t.reviewMistakesBtn.replace('{{count}}', userProgress.mistakeQuestionIds.length)}
                </button>
              )}
              <button
                className="cct-gov-btn-nav"
                style={{ width: 'auto', minWidth: 'auto', padding: '10px 20px' }}
                onClick={() => setView('hub')}
              >
                {t.returnToTestCenter}
              </button>
            </div>

            {/* Detailed Question Review List */}
            <div style={{ marginTop: 12 }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700, color: '#18181b' }}>
                {t.detailedBreakdown}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {simQuestions.map((q, qIdx) => {
                  const userAns = answers[q.id];
                  const isQCorrect = userAns === q.correct;
                  return (
                    <div key={q.id} className="cct-gov-review-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280' }}>
                          {t.question} {qIdx + 1} · {q.cleanTopic}
                        </span>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isQCorrect ? '#059669' : '#dc2626'
                        }}>
                          {isQCorrect ? t.correctTag : t.incorrectTag}
                        </span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#18181b' }}>
                        {q.question}
                      </div>
                      <div style={{ fontSize: 13 }}>
                        <span style={{ color: '#4b5563' }}>{t.yourAnswer} </span>
                        <strong style={{ color: isQCorrect ? '#059669' : '#dc2626' }}>
                          {userAns || t.noAnswerProvided}
                        </strong>
                      </div>
                      {!isQCorrect && (
                        <div style={{ fontSize: 13 }}>
                          <span style={{ color: '#4b5563' }}>{t.correctAnswerIs} </span>
                          <strong style={{ color: '#059669' }}>{q.correct}</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // 7. REVIEW CENTER (Mistakes & Bookmarks)
  // -------------------------------------------------------------
  const renderReview = () => {
    const mistakeQuestions = getQuestionsByIds(userProgress.mistakeQuestionIds);
    const savedQuestions = getQuestionsByIds(userProgress.savedQuestionIds);

    return (
      <div className="cct-wrapper">
        {renderNavBanner()}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>
                {t.review}
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                {t.reviewMeta.replace('{{mistakes}}', userProgress.mistakeQuestionIds.length).replace('{{saved}}', userProgress.savedQuestionIds.length)}
              </p>
            </div>

            <div className="cct-filter-tabs">
              <button
                className={`cct-filter-btn ${reviewTab === 'mistakes' ? 'active' : ''}`}
                onClick={() => setReviewTab('mistakes')}
              >
                {t.mistakes} ({mistakeQuestions.length})
              </button>
              <button
                className={`cct-filter-btn ${reviewTab === 'saved' ? 'active' : ''}`}
                onClick={() => setReviewTab('saved')}
              >
                {t.saved} ({savedQuestions.length})
              </button>
            </div>
          </div>

          {/* Action Bar */}
          {reviewTab === 'mistakes' && mistakeQuestions.length > 0 && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" onClick={handleStartMistakesQuiz} style={{ background: '#b45309', borderColor: '#b45309' }}>
                <Play size={16} fill="#fff" />
                <span>{t.practiceAllMistakes} ({mistakeQuestions.length})</span>
              </button>
            </div>
          )}

          {reviewTab === 'saved' && savedQuestions.length > 0 && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" onClick={handleStartSavedQuiz} style={{ background: '#b45309', borderColor: '#b45309' }}>
                <Play size={16} fill="#fff" />
                <span>{t.practiceAllSaved} ({savedQuestions.length})</span>
              </button>
            </div>
          )}

          {/* Questions list or Empty State */}
          {reviewTab === 'mistakes' ? (
            mistakeQuestions.length === 0 ? (
              <div className="cct-empty-review">
                <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{t.noMistakesTitle}</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
                  {t.noMistakesDesc}
                </p>
              </div>
            ) : (
              <div className="cct-review-list">
                {mistakeQuestions.map(q => (
                  <div key={q.id} className="cct-review-item">
                    <div className="cct-review-header">
                      <span className="cct-topic-pill" style={{ fontSize: 11 }}>
                        {q.cleanTopic}
                      </span>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          const updated = removeMistakeQuestion(q.id);
                          setUserProgress(updated);
                        }}
                        title={t.removeFromMistakes}
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      {q.question}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      <strong>{t.correctAnswerIs}</strong> <span style={{ color: '#10b981' }}>{q.correct}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            savedQuestions.length === 0 ? (
              <div className="cct-empty-review">
                <Bookmark size={40} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{t.noSavedTitle}</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
                  {t.noSavedDesc}
                </p>
              </div>
            ) : (
              <div className="cct-review-list">
                {savedQuestions.map(q => (
                  <div key={q.id} className="cct-review-item">
                    <div className="cct-review-header">
                      <span className="cct-topic-pill" style={{ fontSize: 11 }}>
                        {q.cleanTopic}
                      </span>
                      <button
                        className="btn-icon"
                        onClick={() => handleToggleBookmark(q.id)}
                        title={t.removeFromSaved}
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      {q.question}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      <strong>{t.correctAnswerIs}</strong> <span style={{ color: '#10b981' }}>{q.correct}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // 8. STUDY BY CHAPTER / TOPIC VIEW
  // -------------------------------------------------------------
  const renderStudy = () => (
    <div className="cct-wrapper">
      {renderNavBanner()}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>
            {t.study}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
            {t.studySubtitle}
          </p>
        </div>

        <div className="cct-chapters-grid">
          {allTopics.map(topic => (
            <div key={topic.name} className="cct-chapter-card">
              <div>
                <span className="cct-topic-pill" style={{ marginBottom: 10 }}>
                  <Compass size={12} />
                  <span>Discover Canada</span>
                </span>
                <h3 style={{ margin: '6px 0 4px', fontSize: 16, fontWeight: 700 }}>
                  {topic.name}
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                  {topic.count} {t.totalInBank}
                </p>
              </div>

              <button
                className="btn-primary"
                style={{
                  background: '#d97706',
                  borderColor: '#d97706',
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: 13
                }}
                onClick={() => handleStartTopicTest(topic.name)}
              >
                <Play size={14} fill="#fff" />
                <span>{t.practiceChapter}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // Question Matrix Popover (Jump to Question)
  // -------------------------------------------------------------
  const renderMatrixModal = () => (
    <div className="cct-matrix-overlay" onClick={() => setShowMatrix(false)}>
      <div className="cct-matrix-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
            {t.questionMatrix}
          </h3>
          <button className="btn-icon" onClick={() => setShowMatrix(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="cct-matrix-grid">
          {questions.map((q, idx) => {
            const isCur = idx === currentIndex;
            const ans = userAnswers[q.id];
            const flagged = flaggedIds.has(q.id);
            let cls = '';
            if (isCur) cls = 'current';
            else if (flagged) cls = 'flagged';
            else if (ans) cls = 'answered';

            return (
              <button
                key={q.id}
                className={`cct-matrix-num-btn ${cls}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowMatrix(false);
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          fontSize: 12,
          color: 'var(--text-muted)',
          paddingTop: 8,
          borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.1))'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
            {t.answered}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }} />
            {t.flagged}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-subtle, rgba(255,255,255,0.2))' }} />
            {t.unanswered}
          </span>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // Test Info & FAQ Modals
  // -------------------------------------------------------------
  const renderModals = () => {
    if (!activeModal) return null;

    return (
      <div className="cct-matrix-overlay" onClick={() => setActiveModal(null)}>
        <div className="cct-matrix-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              {activeModal === 'info' ? t.irccInfoTitle : t.faq}
            </h3>
            <button className="btn-icon" onClick={() => setActiveModal(null)}>
              <X size={18} />
            </button>
          </div>

          <div className="cct-modal-content">
            {activeModal === 'info' ? (
              <>
                <p>{t.irccInfoBody}</p>
                <h3>{t.irccRequirements}</h3>
                <ul>
                  <li>{t.fact1}</li>
                  <li>{t.fact2}</li>
                  <li>{t.fact3}</li>
                  <li>{t.fact4}</li>
                </ul>
                <h3>{t.officialStudyGuide}</h3>
                <p>
                  {t.officialStudyGuideDesc}
                </p>
              </>
            ) : (
              <>
                <h3>{t.faqQ1}</h3>
                <p>
                  {t.faqA1}
                </p>
                <h3>{t.faqQ2}</h3>
                <p>
                  {t.faqA2}
                </p>
                <h3>{t.faqQ3}</h3>
                <p>
                  {t.faqA3}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // Main View Switcher
  // -------------------------------------------------------------
  return (
    <div style={{ width: '100%', padding: '8px 0' }}>
      {view === 'hub' && renderHub()}
      {view === 'practice_list' && renderPracticeList()}
      {view === 'quiz' && renderQuiz()}
      {view === 'simulation_intro' && renderSimulationIntro()}
      {view === 'simulation_quiz' && renderSimulationQuiz()}
      {view === 'simulation_results' && renderSimulationResults()}
      {view === 'review' && renderReview()}
      {view === 'study' && renderStudy()}

      {renderModals()}
    </div>
  );
}
