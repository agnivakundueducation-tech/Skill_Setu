export interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Reasoning';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

export interface AptitudeEvaluationResult {
  totalScore: number; // 0-100
  quantitativeScore: number; // 0-100
  logicalScore: number; // 0-100
  verbalScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  correctCount: number;
  totalQuestions: number;
  categoryBreakdown: {
    category: 'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Reasoning';
    score: number;
    correct: number;
    total: number;
  }[];
}

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  // --- Quantitative Aptitude (4 questions) ---
  {
    id: 'quant-1',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'If 6 engineers can build a microservice module in 12 days working 8 hours/day, how many days will 8 engineers take to build the identical module working 6 hours/day?',
    options: ['12 days', '10 days', '16 days', '8 days'],
    correctAnswer: 0,
    explanation: 'Total effort required = 6 × 12 × 8 = 576 engineer-hours. With 8 engineers working 6 hours/day (48 engineer-hours/day), the time needed = 576 ÷ 48 = 12 days.'
  },
  {
    id: 'quant-2',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'A cloud provider offers a server instance at $0.40/hr on-demand. A 1-year commitment grants a 30% discount, and annual upfront billing provides an additional 10% discount on the reduced price. What is the effective hourly cost?',
    options: ['$0.252 / hr', '$0.280 / hr', '$0.240 / hr', '$0.265 / hr'],
    correctAnswer: 0,
    explanation: 'First discount: $0.40 × (1 - 0.30) = $0.28. Second discount: $0.28 × (1 - 0.10) = $0.252/hr.'
  },
  {
    id: 'quant-3',
    category: 'Quantitative Aptitude',
    difficulty: 'Hard',
    question: 'A distributed data pipeline transmits 100 log batches, each 4.5 Megabytes (MB) in size. Over a network connection with effective bandwidth of 120 Megabits per second (Mbps), how long will the transmission take?',
    options: ['30.0 seconds', '37.5 seconds', '24.0 seconds', '45.0 seconds'],
    correctAnswer: 0,
    explanation: 'Total volume = 100 × 4.5 MB = 450 MB = 450 × 8 Mb = 3,600 Megabits. Total time = 3,600 Mb ÷ 120 Mbps = 30.0 seconds.'
  },
  {
    id: 'quant-4',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'A highly available database cluster has 2 independent replica nodes, each having an uptime probability of 0.95. What is the probability that at least one replica is operational at any given instant?',
    options: ['0.9975 (99.75%)', '0.9500 (95.00%)', '0.9025 (90.25%)', '0.9850 (98.50%)'],
    correctAnswer: 0,
    explanation: 'P(at least one up) = 1 - P(both fail) = 1 - (0.05 × 0.05) = 1 - 0.0025 = 0.9975 (99.75%).'
  },

  // --- Logical Reasoning (4 questions) ---
  {
    id: 'logic-1',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    question: 'Consider the server scaling progression: 4, 12, 36, 108, [ X ], 972. What is the value of X?',
    options: ['324', '216', '432', '540'],
    correctAnswer: 0,
    explanation: 'Each term is multiplied by a constant ratio of 3 (4 × 3 = 12; 12 × 3 = 36; 36 × 3 = 108; 108 × 3 = 324; 324 × 3 = 972).'
  },
  {
    id: 'logic-2',
    category: 'Logical Reasoning',
    difficulty: 'Hard',
    question: 'Premises:\n1. All microservices are containerized.\n2. Some containerized applications use Kubernetes orchestration.\nConclusion I: Some microservices use Kubernetes.\nConclusion II: All applications using Kubernetes are microservices.\nWhich conclusion logically follows with absolute certainty?',
    options: [
      'Neither conclusion I nor II necessarily follows',
      'Only conclusion I follows',
      'Only conclusion II follows',
      'Both conclusions I and II follow'
    ],
    correctAnswer: 0,
    explanation: 'The containerized subset using Kubernetes might only contain non-microservice applications. Hence, neither conclusion is guaranteed by classical deductive logic without additional premises.'
  },
  {
    id: 'logic-3',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'An automated guided vehicle in a smart factory starts at origin Point A, moves 12 meters North, turns 90° clockwise and moves 5 meters East, then turns 90° clockwise and moves 12 meters South. What is its shortest distance and direction from Point A?',
    options: ['5 meters East', '12 meters South', '17 meters East', '0 meters (at origin)'],
    correctAnswer: 0,
    explanation: '12m North and 12m South cancel each other out along the vertical axis, leaving a net displacement of exactly 5m East.'
  },
  {
    id: 'logic-4',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'Pointing to a systems architect on the team dashboard, Priya states: "His manager is the only offspring of my father." Given Priya has no siblings, how is Priya related to the systems architect?',
    options: ['Mother', 'Sister', 'Aunt', 'Manager'],
    correctAnswer: 0,
    explanation: 'Since Priya has no siblings, "the only offspring of my father" refers to Priya herself. Therefore, Priya is the mother (and manager) of the architect.'
  },

  // --- Verbal Reasoning (4 questions) ---
  {
    id: 'verbal-1',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'Statement: "While unit tests verify syntactic and functional correctness of isolated functions, distributed integration tests remain indispensable for detecting concurrency race conditions and schema drift across asynchronous brokers."\nWhat is the primary conclusion drawn from this statement?',
    options: [
      'Unit testing alone cannot guarantee full system reliability in distributed, concurrent architectures.',
      'Asynchronous message brokers eliminate the requirement for unit tests.',
      'Race conditions only occur during local functional testing.',
      'Integration testing is slower and should be deprecated.'
    ],
    correctAnswer: 0,
    explanation: 'The excerpt explicitly asserts that unit tests on isolated modules cannot substitute for distributed integration tests when concurrency and asynchronous brokers are involved.'
  },
  {
    id: 'verbal-2',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'Choose the pair of words that exhibits the same conceptual relationship as:\nLATENCY : SPEED :: JITTER : ____',
    options: ['CONSISTENCY', 'BANDWIDTH', 'AMPLITUDE', 'CAPACITY'],
    correctAnswer: 0,
    explanation: 'Latency measures duration (the inverse of raw transmission speed), while jitter measures variability/fluctuation in delivery timing (the inverse of stream consistency).'
  },
  {
    id: 'verbal-3',
    category: 'Verbal Reasoning',
    difficulty: 'Hard',
    question: 'Select the sentence that maintains precise grammatical structure and avoids ambiguous modifier dangling in technical documentation:',
    options: [
      'The cluster scaled horizontally because the load balancer observed elevated request queue depth.',
      'Scaling horizontally, the elevated queue depth was observed on the cluster by the load balancer.',
      'The cluster was scaled by the load balancer because it had queue depth elevated horizontally.',
      'Observing elevated request queue depth, horizontal scaling was triggered by the cluster.'
    ],
    correctAnswer: 0,
    explanation: 'Option A provides clear, unambiguous active voice with correct subject-predicate attribution and no dangling participle modifiers.'
  },
  {
    id: 'verbal-4',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'Statement: "The engineering department replaced pen-and-paper assessments with proctored digital coding sandboxes to better align evaluations with industry hiring benchmarks."\nAssumption I: Industry hiring processes prioritize hands-on live code execution over theoretical written answers.\nAssumption II: Digital coding sandboxes provide a closer proxy to real-world software engineering workflows.\nWhich assumptions are implicit?',
    options: [
      'Both Assumption I and II are implicit',
      'Only Assumption I is implicit',
      'Only Assumption II is implicit',
      'Neither Assumption is implicit'
    ],
    correctAnswer: 0,
    explanation: 'The institutional decision relies on both assumptions: that industry evaluates via live code (I) and that sandbox tests accurately mirror those benchmarks (II).'
  }
];

/**
 * Deterministically evaluates answers to calculate aptitude scores and strength/weakness tags.
 */
export function evaluateAptitudeAnswers(answers: Record<string, number>): AptitudeEvaluationResult {
  let quantCorrect = 0;
  let quantTotal = 0;
  let logicCorrect = 0;
  let logicTotal = 0;
  let verbalCorrect = 0;
  let verbalTotal = 0;

  APTITUDE_QUESTIONS.forEach((q) => {
    const selected = answers[q.id];
    const isCorrect = selected !== undefined && selected === q.correctAnswer;

    if (q.category === 'Quantitative Aptitude') {
      quantTotal++;
      if (isCorrect) quantCorrect++;
    } else if (q.category === 'Logical Reasoning') {
      logicTotal++;
      if (isCorrect) logicCorrect++;
    } else if (q.category === 'Verbal Reasoning') {
      verbalTotal++;
      if (isCorrect) verbalCorrect++;
    }
  });

  const quantitativeScore = quantTotal > 0 ? Math.round((quantCorrect / quantTotal) * 100) : 0;
  const logicalScore = logicTotal > 0 ? Math.round((logicCorrect / logicTotal) * 100) : 0;
  const verbalScore = verbalTotal > 0 ? Math.round((verbalCorrect / verbalTotal) * 100) : 0;
  const totalCorrect = quantCorrect + logicCorrect + verbalCorrect;
  const totalQuestions = quantTotal + logicTotal + verbalTotal;
  const totalScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (quantitativeScore >= 75) {
    strengths.push('High Quantitative Problem Solving & Algorithmic Costing');
  } else if (quantitativeScore < 50) {
    weaknesses.push('Quantitative Math: Strengthen Unit Effort & Probability Calculations');
  }

  if (logicalScore >= 75) {
    strengths.push('Deductive Reasoning & Pattern Sequence Recognition');
  } else if (logicalScore < 50) {
    weaknesses.push('Logical Analysis: Review Syllogisms & Spatial Traversal Problems');
  }

  if (verbalScore >= 75) {
    strengths.push('Technical Verbal Comprehension & Structural Precision');
  } else if (verbalScore < 50) {
    weaknesses.push('Verbal Reasoning: Focus on Critical Inferences & Technical Syntax');
  }

  if (strengths.length === 0) {
    strengths.push('Consistent Baseline Cognitive Competency');
  }

  return {
    totalScore,
    quantitativeScore,
    logicalScore,
    verbalScore,
    strengths,
    weaknesses,
    correctCount: totalCorrect,
    totalQuestions,
    categoryBreakdown: [
      {
        category: 'Quantitative Aptitude',
        score: quantitativeScore,
        correct: quantCorrect,
        total: quantTotal
      },
      {
        category: 'Logical Reasoning',
        score: logicalScore,
        correct: logicCorrect,
        total: logicTotal
      },
      {
        category: 'Verbal Reasoning',
        score: verbalScore,
        correct: verbalCorrect,
        total: verbalTotal
      }
    ]
  };
}
