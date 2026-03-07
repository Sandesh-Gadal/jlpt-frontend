import type { LessonData } from '@/types/lesson';

export const LESSON_DATA: LessonData = {
  id:            'l8',
  courseId:      'course-n3-grammar-001',
  title:         'Conditional Forms',
  subtitle:      'ば・たら・なら — Choosing the right conditional',
  number:        8,
  totalInCourse: 15,
  duration:      40,
  xpReward:      35,
  level:         'N3',
  category:      'Grammar',
  content: [
    {
      type: 'heading',
      text: 'Overview',
      level: 2,
    },
    {
      type: 'paragraph',
      text: 'Japanese has four main conditional forms, each used in different situations. Mastering when to use each one is key to sounding natural in Japanese. In this lesson we focus on ば, たら, and なら.',
    },
    {
      type: 'tip',
      label: '💡 Key Insight',
      tip: 'Think of conditionals like this: ば = logical/natural result, たら = "when/if that happens", なら = "if that is the case".',
    },
    {
      type: 'heading',
      text: '1. ～ば (if, logical condition)',
      level: 2,
    },
    {
      type: 'paragraph',
      text: 'The ば-form expresses a logical or natural condition — if A happens, then B naturally follows. It is often used for general truths or advice.',
    },
    {
      type: 'grammar',
      grammar: {
        pattern:   'Verb (ば-form) + result',
        meaning:   'If [condition], then [result] (logical/natural)',
        structure: 'Godan verbs: u → eba | Ichidan verbs: ru → reba | する → すれば | くる → くれば',
        examples: [
          { jp: '春になれば、桜が咲く。', en: 'When spring comes, the cherry blossoms bloom.' },
          { jp: '毎日練習すれば、上手になる。', en: 'If you practice every day, you will improve.' },
        ],
      },
    },
    {
      type: 'furigana',
      segments: [
        { text: '春', reading: 'はる' },
        { text: 'に' },
        { text: 'なれば、' },
        { text: '桜', reading: 'さくら' },
        { text: 'が' },
        { text: '咲', reading: 'さ' },
        { text: 'く。' },
      ],
    },
    {
      type: 'heading',
      text: '2. ～たら (when / if — after completion)',
      level: 2,
    },
    {
      type: 'paragraph',
      text: 'たら expresses "when" or "if" something is completed or happens. It is the most versatile conditional and can be used in most situations. The result can be in the past, present, or future.',
    },
    {
      type: 'grammar',
      grammar: {
        pattern:   'Verb (た-form) + ら + result',
        meaning:   '"When / after" condition is met — very versatile',
        structure: 'Take the plain past form (た) and add ら: 食べた → 食べたら | 行った → 行ったら',
        examples: [
          { jp: '家に帰ったら、手を洗ってください。', en: 'When you get home, please wash your hands.' },
          { jp: '宿題が終わったら、遊んでいいよ。', en: 'Once your homework is done, you can play.' },
        ],
      },
    },
    {
      type: 'furigana',
      segments: [
        { text: '家', reading: 'いえ' },
        { text: 'に' },
        { text: '帰', reading: 'かえ' },
        { text: 'ったら、' },
        { text: '手', reading: 'て' },
        { text: 'を' },
        { text: '洗', reading: 'あら' },
        { text: 'ってください。' },
      ],
    },
    {
      type: 'heading',
      text: '3. ～なら (if that is the case)',
      level: 2,
    },
    {
      type: 'paragraph',
      text: 'なら is used when the condition is something already known, assumed, or just mentioned. It responds to a situation with "if that is the case / given that..." The speaker reacts to information.',
    },
    {
      type: 'grammar',
      grammar: {
        pattern:   'Noun / plain form + なら + statement',
        meaning:   '"If that is the case / given that..." — responds to context',
        structure: 'Noun + なら | Verb (plain) + なら | い-adj + なら | な-adj + なら',
        examples: [
          { jp: '東京に行くなら、新幹線が便利ですよ。', en: 'If you are going to Tokyo, the Shinkansen is convenient.' },
          { jp: '彼が来ないなら、私も行きません。', en: 'If he is not coming, I will not go either.' },
        ],
      },
    },
    {
      type: 'furigana',
      segments: [
        { text: '東京', reading: 'とうきょう' },
        { text: 'に' },
        { text: '行', reading: 'い' },
        { text: 'くなら、' },
        { text: '新幹線', reading: 'しんかんせん' },
        { text: 'が' },
        { text: '便利', reading: 'べんり' },
        { text: 'ですよ。' },
      ],
    },
    {
      type: 'heading',
      text: 'Vocabulary in this Lesson',
      level: 2,
    },
    {
      type: 'vocabulary',
      vocab: [
        { word: '条件',  reading: 'じょうけん', meaning: 'condition, requirement',    example: '条件を確認してください。' },
        { word: '場合',  reading: 'ばあい',     meaning: 'case, situation, occasion', example: 'その場合はどうしますか。' },
        { word: '結果',  reading: 'けっか',     meaning: 'result, outcome',           example: '結果を待ちましょう。' },
        { word: '練習',  reading: 'れんしゅう', meaning: 'practice',                  example: '毎日練習すれば上手になる。' },
        { word: '便利',  reading: 'べんり',     meaning: 'convenient, handy',         example: 'スマホはとても便利です。' },
        { word: '新幹線', reading: 'しんかんせん', meaning: 'Shinkansen, bullet train', example: '新幹線は速いです。' },
      ],
    },
    {
      type: 'tip',
      label: '⚠️ Common Mistake',
      tip: 'Do not use たら for general truths or habits — use ば or と instead. たら is best for one-time events or instructions.',
    },
    {
      type: 'divider',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Which conditional is MOST natural for general truths like "If it rains, the ground gets wet"?',
      options: [
        { id: 'a', text: '～たら (tara)' },
        { id: 'b', text: '～ば (ba)' },
        { id: 'c', text: '～なら (nara)' },
        { id: 'd', text: '～のに (noni)' },
      ],
      correct: 'b',
      explanation: '～ば is used for logical/natural conditions and general truths. 雨が降れば、地面が濡れる。',
    },
    {
      id: 'q2',
      question: '「東京に___、新幹線が便利ですよ。」— Fill in the blank.',
      options: [
        { id: 'a', text: '行けば' },
        { id: 'b', text: '行ったら' },
        { id: 'c', text: '行くなら' },
        { id: 'd', text: '行くと' },
      ],
      correct: 'c',
      explanation: 'なら is correct because the speaker is responding to something already mentioned — "if you are going to Tokyo (as you said)".',
    },
    {
      id: 'q3',
      question: 'Choose the correct sentence using ～たら for instructions:',
      options: [
        { id: 'a', text: '家に帰れば、手を洗ってください。' },
        { id: 'b', text: '家に帰るなら、手を洗ってください。' },
        { id: 'c', text: '家に帰ったら、手を洗ってください。' },
        { id: 'd', text: '家に帰ると、手を洗ってください。' },
      ],
      correct: 'c',
      explanation: '～たら is the natural choice for instructions like "when you get home, do X". It implies the action happens after the condition is completed.',
    },
    {
      id: 'q4',
      question: 'What is the ば-form of the verb 書く (kaku — to write)?',
      options: [
        { id: 'a', text: '書いたら' },
        { id: 'b', text: '書くなら' },
        { id: 'c', text: '書けば' },
        { id: 'd', text: '書くれば' },
      ],
      correct: 'c',
      explanation: 'For godan verbs ending in く, change く → けば. So 書く → 書けば.',
    },
  ],
};

export const MOCK_LESSON_MAP: Record<string, LessonData> = {
  'l8': LESSON_DATA,
};