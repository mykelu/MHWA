import { z } from 'zod';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'PHQ9' | 'GAD7';
  questions: AssessmentQuestion[];
  scoring: {
    ranges: ScoringRange[];
    calculation: 'sum' | 'average';
  };
  frequency?: string;
  timeLimit?: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'scale' | 'multiChoice' | 'text';
  required?: boolean;
  minValue?: number;
  maxValue?: number;
  options?: string[];
  labels?: Record<number, string>;
  scaleType?: 'frequency' | 'severity' | 'agreement';
}

export interface ScoringRange {
  min: number;
  max: number;
  label: string;
  description: string;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  userId: string;
  responses: Array<{
    questionId: string;
    value: string | number;
  }>;
  score: number;
  interpretation: string;
  completedAt: string;
}

export const PHQ9_TEMPLATE: Assessment = {
  id: 'phq9',
  title: 'PHQ-9 Depression Scale',
  description: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  type: 'PHQ9',
  questions: [
    {
      id: 'phq9_1',
      text: 'Little interest or pleasure in doing things',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'phq9_2',
      text: 'Feeling down, depressed, or hopeless',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'phq9_3',
      text: 'Trouble falling or staying asleep, or sleeping too much',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'phq9_4',
      text: 'Feeling tired or having little energy',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'phq9_5',
      text: 'Poor appetite or overeating',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'phq9_6',
      text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'phq9_7',
      text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'phq9_8',
      text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'phq9_9',
      text: 'Thoughts that you would be better off dead or of hurting yourself in some way',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
  ],
  scoring: {
    ranges: [
      { min: 0, max: 4, label: 'Minimal', description: 'Minimal depression - Monitor and follow up if needed' },
      { min: 5, max: 9, label: 'Mild', description: 'Mild depression - Watchful waiting, repeat PHQ-9 at follow-up' },
      { min: 10, max: 14, label: 'Moderate', description: 'Moderate depression - Treatment plan, counseling, follow-up and/or pharmacotherapy' },
      { min: 15, max: 19, label: 'Moderately Severe', description: 'Moderately severe depression - Active treatment with pharmacotherapy and/or psychotherapy' },
      { min: 20, max: 27, label: 'Severe', description: 'Severe depression - Immediate initiation of pharmacotherapy and/or psychotherapy' },
    ],
    calculation: 'sum',
  },
  frequency: 'weekly',
};

export const GAD7_TEMPLATE: Assessment = {
  id: 'gad7',
  title: 'GAD-7 Anxiety Scale',
  description: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  type: 'GAD7',
  questions: [
    {
      id: 'gad7_1',
      text: 'Feeling nervous, anxious, or on edge',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'gad7_2',
      text: 'Not being able to stop or control worrying',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'gad7_3',
      text: 'Worrying too much about different things',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'gad7_4',
      text: 'Trouble relaxing',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'gad7_5',
      text: 'Being so restless that it is hard to sit still',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'gad7_6',
      text: 'Becoming easily annoyed or irritable',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
    {
      id: 'gad7_7',
      text: 'Feeling afraid as if something awful might happen',
      type: 'scale',
      scaleType: 'frequency',
      required: true,
      minValue: 0,
      maxValue: 3,
      labels: {
        0: 'Not at all',
        1: 'Several days',
        2: 'More than half the days',
        3: 'Nearly every day',
      },
    },
  ],
  scoring: {
    ranges: [
      { min: 0, max: 4, label: 'Minimal', description: 'Minimal anxiety - Monitor and follow up if needed' },
      { min: 5, max: 9, label: 'Mild', description: 'Mild anxiety - Watchful waiting, repeat GAD-7 at follow-up' },
      { min: 10, max: 14, label: 'Moderate', description: 'Moderate anxiety - Consider counseling, follow-up and/or pharmacotherapy' },
      { min: 15, max: 21, label: 'Severe', description: 'Severe anxiety - Active treatment with pharmacotherapy and/or psychotherapy recommended' },
    ],
    calculation: 'sum',
  },
  frequency: 'weekly',
};