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
  {
    id: 'quant-5',
    category: 'Quantitative Aptitude',
    difficulty: 'Easy',
    question: 'A software project requires 240 developer-hours. If 6 developers work equally for 5 hours per day, how many days will the project take?',
    options: ['6 days', '8 days', '10 days', '12 days'],
    correctAnswer: 1,
    explanation: 'Daily work = 6 × 5 = 30 developer-hours. Required days = 240 ÷ 30 = 8 days.'
  },
  {
    id: 'quant-6',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'A database contains 8,000 records. If the number of records increases by 15%, what will be the new total?',
    options: ['8,800', '9,000', '9,200', '9,500'],
    correctAnswer: 2,
    explanation: 'Increase = 15% of 8,000 = 1,200. New total = 8,000 + 1,200 = 9,200.'
  },
  {
    id: 'quant-7',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'A cloud storage service costs ₹2,400 per month. If the company receives a 25% discount, what is the discounted monthly cost?',
    options: ['₹1,600', '₹1,800', '₹2,000', '₹2,100'],
    correctAnswer: 1,
    explanation: 'Discount = 25% of ₹2,400 = ₹600. Final cost = ₹2,400 - ₹600 = ₹1,800.'
  },
  {
    id: 'quant-8',
    category: 'Quantitative Aptitude',
    difficulty: 'Hard',
    question: 'A server processes 1,200 requests in 30 seconds. At the same processing rate, how many requests can it process in 2 minutes?',
    options: ['2,400', '3,600', '4,800', '6,000'],
    correctAnswer: 2,
    explanation: '2 minutes = 120 seconds, which is 4 times 30 seconds. Therefore, 1,200 × 4 = 4,800 requests.'
  },
  {
    id: 'quant-9',
    category: 'Quantitative Aptitude',
    difficulty: 'Easy',
    question: 'A server handles 500 requests per second. How many requests will it handle in 3 minutes?',
    options: ['30,000', '60,000', '90,000', '120,000'],
    correctAnswer: 2,
    explanation: '3 minutes = 180 seconds. Requests = 500 × 180 = 90,000.'
  },
  {
    id: 'quant-10',
    category: 'Quantitative Aptitude',
    difficulty: 'Easy',
    question: 'A developer earns ₹40,000 per month. If the salary increases by 20%, what is the new salary?',
    options: ['₹44,000', '₹46,000', '₹48,000', '₹50,000'],
    correctAnswer: 2,
    explanation: '20% of ₹40,000 = ₹8,000. New salary = ₹40,000 + ₹8,000 = ₹48,000.'
  },
  {
    id: 'quant-11',
    category: 'Quantitative Aptitude',
    difficulty: 'Easy',
    question: 'A file of 600 MB is downloaded at a speed of 20 MB/s. How long will the download take?',
    options: ['20 seconds', '30 seconds', '40 seconds', '60 seconds'],
    correctAnswer: 1,
    explanation: 'Time = File size ÷ Download speed = 600 ÷ 20 = 30 seconds.'
  },
  {
    id: 'quant-12',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'The ratio of frontend developers to backend developers is 3:2. If there are 15 frontend developers, how many backend developers are there?',
    options: ['8', '10', '12', '15'],
    correctAnswer: 1,
    explanation: '3 parts represent 15 developers, so 1 part = 5. Backend developers = 2 × 5 = 10.'
  },
  {
    id: 'quant-13',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'A database query takes 800 ms. After optimization, its execution time decreases by 25%. What is the new execution time?',
    options: ['500 ms', '550 ms', '600 ms', '650 ms'],
    correctAnswer: 2,
    explanation: '25% of 800 = 200 ms. New execution time = 800 - 200 = 600 ms.'
  },
  {
    id: 'quant-14',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'A system has 99% uptime. Approximately how much downtime can occur in a 100-hour period?',
    options: ['0.1 hour', '1 hour', '5 hours', '10 hours'],
    correctAnswer: 1,
    explanation: 'Downtime = 100% - 99% = 1%. 1% of 100 hours = 1 hour.'
  },
  {
    id: 'quant-15',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'If 4 programmers complete a task in 15 days, assuming equal productivity, how many days would 10 programmers take?',
    options: ['4 days', '5 days', '6 days', '8 days'],
    correctAnswer: 2,
    explanation: 'Total work = 4 × 15 = 60 programmer-days. For 10 programmers, time = 60 ÷ 10 = 6 days.'
  },
  {
    id: 'quant-16',
    category: 'Quantitative Aptitude',
    difficulty: 'Easy',
    question: 'A network packet has a size of 2 KB. How much data is transmitted by 5,000 such packets?',
    options: ['5 MB', '10 MB', '15 MB', '20 MB'],
    correctAnswer: 1,
    explanation: 'Total data = 2 KB × 5,000 = 10,000 KB = 10 MB using the standard simplified conversion.'
  },
  {
    id: 'quant-17',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    question: 'A company spends ₹80,000 on infrastructure. If 35% is spent on cloud services, how much is spent on cloud services?',
    options: ['₹24,000', '₹26,000', '₹28,000', '₹30,000'],
    correctAnswer: 2,
    explanation: '35% of ₹80,000 = (35/100) × 80,000 = ₹28,000.'
  },
  {
    id: 'quant-18',
    category: 'Quantitative Aptitude',
    difficulty: 'Hard',
    question: 'The average response time of five API calls is 200 ms. Four calls take 150, 180, 220 and 250 ms. What is the response time of the fifth call?',
    options: ['180 ms', '200 ms', '220 ms', '250 ms'],
    correctAnswer: 2,
    explanation: 'Total required = 5 × 200 = 1,000 ms. Existing total = 150 + 180 + 220 + 250 = 800 ms. Fifth call = 1,000 - 800 = 200 ms.'
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
  {
    id: 'logic-5',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    question: 'Find the next number in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '44'],
    correctAnswer: 2,
    explanation: 'The differences are +4, +6, +8, +10. The next difference is +12, so 30 + 12 = 42.'
  },
  {
    id: 'logic-6',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'All programmers are problem solvers. Some problem solvers are designers. Which statement is definitely true?',
    options: [
      'All designers are programmers',
      'Some programmers are designers',
      'All programmers are problem solvers',
      'No problem solver is a designer'
    ],
    correctAnswer: 2,
    explanation: 'The first premise directly states that all programmers are problem solvers. The other conclusions are not guaranteed.'
  },
  {
    id: 'logic-7',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'A person walks 10 meters East, then 10 meters North, then 10 meters West. Where is the person relative to the starting point?',
    options: ['10 meters North', '10 meters South', '10 meters East', 'At the starting point'],
    correctAnswer: 0,
    explanation: 'The East and West movements cancel each other. The remaining displacement is 10 meters North.'
  },
  {
    id: 'logic-8',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    question: 'Find the next number in the sequence: 3, 9, 27, 81, ?',
    options: ['162', '189', '243', '324'],
    correctAnswer: 2,
    explanation: 'Each number is multiplied by 3. Therefore, 81 × 3 = 243.'
  },
  {
    id: 'logic-9',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    question: 'Find the missing number: 5, 10, 20, 40, ?',
    options: ['60', '70', '80', '100'],
    correctAnswer: 2,
    explanation: 'Each number is multiplied by 2. Therefore, 40 × 2 = 80.'
  },
  {
    id: 'logic-10',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'If CODE is written as DPEF, how would JAVA be written using the same pattern?',
    options: ['KBWB', 'KAVB', 'KBXA', 'JAWB'],
    correctAnswer: 0,
    explanation: 'Each letter is shifted one position forward in the alphabet: J→K, A→B, V→W, A→B. Therefore JAVA becomes KBWB.'
  },
  {
    id: 'logic-11',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    question: 'All programmers are problem solvers. Ravi is a programmer. Which conclusion follows?',
    options: [
      'Ravi is a problem solver',
      'All problem solvers are programmers',
      'Ravi is not a problem solver',
      'No conclusion can be made'
    ],
    correctAnswer: 0,
    explanation: 'Since all programmers are problem solvers and Ravi is a programmer, Ravi must be a problem solver.'
  },
  {
    id: 'logic-12',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'A person faces North. He turns right, then right again, and then left. Which direction is he facing?',
    options: ['North', 'South', 'East', 'West'],
    correctAnswer: 2,
    explanation: 'Starting North, right turn gives East, another right gives South, and a left turn gives East.'
  },
  {
    id: 'logic-13',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    question: 'Find the odd one out.',
    options: ['Python', 'Java', 'C++', 'MySQL'],
    correctAnswer: 3,
    explanation: 'Python, Java and C++ are programming languages. MySQL is a relational database management system.'
  },
  {
    id: 'logic-14',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'If today is Wednesday, what day will it be after 45 days?',
    options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    correctAnswer: 1,
    explanation: '45 divided by 7 leaves a remainder of 3. Three days after Wednesday is Saturday.'
  },
  {
    id: 'logic-15',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'Five developers A, B, C, D and E are standing in a line. A is before B, B is before C, and D is after C. If E is at the last position, who must be before E?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'Since A is before B, B is before C, and D is after C, A must necessarily be before E when E is last.'
  },
  {
    id: 'logic-16',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    question: 'Find the next pair: AB, DE, GH, JK, ?',
    options: ['LM', 'MN', 'NO', 'OP'],
    correctAnswer: 1,
    explanation: 'The starting letters progress by 3: A, D, G, J, M. Therefore, the next pair is MN.'
  },
  {
    id: 'logic-17',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'All APIs are interfaces. Some interfaces are secure. Which statement is definitely true?',
    options: [
      'All APIs are secure',
      'Some APIs are secure',
      'All APIs are interfaces',
      'No APIs are secure'
    ],
    correctAnswer: 2,
    explanation: 'The first premise directly states that all APIs are interfaces. Nothing proves that APIs are necessarily secure.'
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
  },
  {
    id: 'verbal-5',
    category: 'Verbal Reasoning',
    difficulty: 'Easy',
    question: 'Choose the word that is most similar in meaning to "OPTIMIZE" in the context of software performance.',
    options: ['Worsen', 'Improve', 'Ignore', 'Duplicate'],
    correctAnswer: 1,
    explanation: 'To optimize means to improve something to achieve better efficiency or performance.'
  },
  {
    id: 'verbal-6',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'Choose the sentence with correct grammar:',
    options: [
      'The developers has completed the project.',
      'The developers have completed the project.',
      'The developers is completing the project.',
      'The developers was completed the project.'
    ],
    correctAnswer: 1,
    explanation: 'The plural subject "developers" requires the plural auxiliary verb "have".'
  },
  {
    id: 'verbal-7',
    category: 'Verbal Reasoning',
    difficulty: 'Hard',
    question: 'Statement: "Although the new algorithm requires more memory, it significantly reduces execution time for large datasets." What can be inferred?',
    options: [
      'The algorithm uses less memory and less time.',
      'The algorithm involves a trade-off between memory usage and execution speed.',
      'The algorithm is slower for large datasets.',
      'The algorithm cannot process large datasets.'
    ],
    correctAnswer: 1,
    explanation: 'The statement explicitly presents a trade-off: increased memory consumption in exchange for reduced execution time.'
  },
  {
    id: 'verbal-8',
    category: 'Verbal Reasoning',
    difficulty: 'Easy',
    question: 'Choose the word closest in meaning to "RELIABLE".',
    options: ['Uncertain', 'Dependable', 'Temporary', 'Weak'],
    correctAnswer: 1,
    explanation: 'Reliable means dependable or trustworthy.'
  },
  {
    id: 'verbal-9',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'Choose the opposite of "SCALABLE" in a technical context.',
    options: ['Flexible', 'Expandable', 'Limited', 'Efficient'],
    correctAnswer: 2,
    explanation: 'A scalable system can grow with increased demand, while a limited system cannot easily handle increased demand.'
  },
  {
    id: 'verbal-10',
    category: 'Verbal Reasoning',
    difficulty: 'Easy',
    question: 'Choose the grammatically correct sentence.',
    options: [
      'The server have restarted.',
      'The server has restarted.',
      'The server having restarted.',
      'The server were restarted.'
    ],
    correctAnswer: 1,
    explanation: 'The singular subject "server" requires the singular auxiliary verb "has".'
  },
  {
    id: 'verbal-11',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'Complete the analogy: DATABASE : DATA :: LIBRARY : ?',
    options: ['Books', 'Computers', 'Internet', 'Servers'],
    correctAnswer: 0,
    explanation: 'A database stores data, just as a library stores books.'
  },
  {
    id: 'verbal-12',
    category: 'Verbal Reasoning',
    difficulty: 'Easy',
    question: 'What does the statement mean? "The application failed because the server was unavailable."',
    options: [
      'The application caused the server failure.',
      'The server was unavailable, causing the application failure.',
      'The application was unavailable but the server worked.',
      'Neither system failed.'
    ],
    correctAnswer: 1,
    explanation: 'The statement identifies server unavailability as the reason for the application failure.'
  },
  {
    id: 'verbal-13',
    category: 'Verbal Reasoning',
    difficulty: 'Easy',
    question: 'Choose the correctly spelled word.',
    options: ['Dependancy', 'Dependencey', 'Dependency', 'Dependensy'],
    correctAnswer: 2,
    explanation: 'The correct spelling is "Dependency".'
  },
  {
    id: 'verbal-14',
    category: 'Verbal Reasoning',
    difficulty: 'Easy',
    question: 'Choose the sentence with the clearest meaning.',
    options: [
      'The developer fixed quickly the bug.',
      'Quickly the bug developer fixed.',
      'The developer quickly fixed the bug.',
      'Fixed the developer the bug quickly.'
    ],
    correctAnswer: 2,
    explanation: 'Option C follows a clear subject-verb-object structure and correctly places the adverb.'
  },
  {
    id: 'verbal-15',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'CONCURRENT : SIMULTANEOUS :: SEQUENTIAL : ?',
    options: ['Parallel', 'Ordered', 'Random', 'Instant'],
    correctAnswer: 1,
    explanation: 'Concurrent means occurring simultaneously, while sequential means occurring in an ordered sequence.'
  },
  {
    id: 'verbal-16',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'Statement: "The team introduced automated testing, reducing the number of defects reaching production." What can be inferred?',
    options: [
      'Automated testing increased defects.',
      'Automated testing helped identify problems before production.',
      'Production was eliminated.',
      'Manual testing became impossible.'
    ],
    correctAnswer: 1,
    explanation: 'The reduction in production defects suggests that automated testing helped detect problems before deployment.'
  },
  {
    id: 'verbal-17',
    category: 'Verbal Reasoning',
    difficulty: 'Medium',
    question: 'Choose the word closest in meaning to "MITIGATE" in the sentence: "The security patch was deployed to mitigate the vulnerability."',
    options: ['Increase', 'Hide', 'Reduce or lessen', 'Create'],
    correctAnswer: 2,
    explanation: 'Mitigate means to reduce the severity, impact, or harmful effect of something.'
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
