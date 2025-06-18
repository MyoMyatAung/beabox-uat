/**
 * Lucky Spin Wheel Configuration
 * Defines prizes, segments, and wheel behavior
 */

import type { Prize, WheelSegment, SpinResult } from '../types';

// Prize definitions
export const PRIZES: Record<string, Prize> = {
  PRIZE_200: {
    id: 'prize_200',
    name: '200元',
    value: 200,
    type: 'cash',
    segment: 0
  },
  PRIZE_CONSOLATION: {
    id: 'prize_consolation',
    name: '谢谢参与',
    value: 0,
    type: 'consolation',
    segment: 1
  },
  PRIZE_50: {
    id: 'prize_50',
    name: '50元',
    value: 50,
    type: 'cash',
    segment: 2
  },
  PRIZE_20: {
    id: 'prize_20',
    name: '20元',
    value: 20,
    type: 'cash',
    segment: 3
  },
  PRIZE_PHONE_CREDIT: {
    id: 'prize_phone_credit',
    name: '电话费',
    value: 50,
    type: 'service',
    segment: 4
  },
  PRIZE_10: {
    id: 'prize_10',
    name: '10元',
    value: 10,
    type: 'cash',
    segment: 5
  },
  PRIZE_PHONE: {
    id: 'prize_phone',
    name: 'iPhone 16 Pro Max',
    value: 10000,
    type: 'product',
    segment: 6
  },
  PRIZE_100: {
    id: 'prize_100',
    name: '100元',
    value: 100,
    type: 'cash',
    segment: 7
  }
};

// Wheel segment configuration (8 segments, 45 degrees each)
export const WHEEL_SEGMENTS: WheelSegment[] = [
  {
    segment: 0,
    prize: PRIZES.PRIZE_200,
    angle: 0,
    color: '#FFF7DF',
    probability: 0.02  // 2%
  },
  {
    segment: 1,
    prize: PRIZES.PRIZE_CONSOLATION,
    angle: 45,
    color: '#FFF7DF',
    probability: 0.40  // 40%
  },
  {
    segment: 2,
    prize: PRIZES.PRIZE_50,
    angle: 90,
    color: '#FFF7DF',
    probability: 0.20  // 20%
  },
  {
    segment: 3,
    prize: PRIZES.PRIZE_20,
    angle: 135,
    color: '#FFF7DF',
    probability: 0.15  // 15%
  },
  {
    segment: 4,
    prize: PRIZES.PRIZE_PHONE_CREDIT,
    angle: 180,
    color: '#FFF7DF',
    probability: 0.10  // 10%
  },
  {
    segment: 5,
    prize: PRIZES.PRIZE_10,
    angle: 225,
    color: '#FFF7DF',
    probability: 0.08  // 8%
  },
  {
    segment: 6,
    prize: PRIZES.PRIZE_PHONE,
    angle: 270,
    color: '#FFF7DF',
    probability: 0.01  // 1%
  },
  {
    segment: 7,
    prize: PRIZES.PRIZE_100,
    angle: 315,
    color: '#FFF7DF',
    probability: 0.04  // 4%
  }
];

// Wheel physics configuration
export const WHEEL_CONFIG = {
  SEGMENT_COUNT: 8,
  DEGREES_PER_SEGMENT: 45,
  MIN_SPINS: 5,
  MAX_SPINS: 10,
  SPIN_DURATION: 3000,
  EASING: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  POINTER_ANGLE: 0,
  INITIAL_ROTATION: 0
} as const;

/**
 * Calculate which segment the wheel landed on
 */
export function getWinningSegment(finalRotation: number): SpinResult {
  const normalizedRotation = ((finalRotation % 360) + 360) % 360;
  const effectiveAngle = (360 - normalizedRotation + WHEEL_CONFIG.POINTER_ANGLE) % 360;
  const segmentIndex = Math.floor(effectiveAngle / WHEEL_CONFIG.DEGREES_PER_SEGMENT);
  const winningSegment = WHEEL_SEGMENTS[segmentIndex % WHEEL_SEGMENTS.length];
  
  return {
    segment: winningSegment,
    segmentIndex,
    angle: effectiveAngle,
    normalizedRotation
  };
}

/**
 * Calculate rotation needed to land on specific segment
 */
export function calculateTargetRotation(targetSegment: number, currentRotation = 0): number {
  const targetAngle = WHEEL_SEGMENTS[targetSegment].angle;
  const minSpins = WHEEL_CONFIG.MIN_SPINS * 360;
  const maxSpins = WHEEL_CONFIG.MAX_SPINS * 360;
  const randomSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
  const segmentCenter = targetAngle + (WHEEL_CONFIG.DEGREES_PER_SEGMENT / 2);
  const finalAngle = 360 - segmentCenter;
  
  return currentRotation + randomSpins + finalAngle;
}

/**
 * Get random winning segment based on probabilities
 */
export function getRandomWinningSegment(): WheelSegment {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const segment of WHEEL_SEGMENTS) {
    cumulativeProbability += segment.probability;
    if (random <= cumulativeProbability) {
      return segment;
    }
  }
  
  // Fallback to consolation prize
  return WHEEL_SEGMENTS.find(s => s.prize.id === 'prize_consolation')!;
}

// Export segment count for convenience
export const SEGMENT_COUNT = WHEEL_CONFIG.SEGMENT_COUNT;

export default {
  PRIZES,
  WHEEL_SEGMENTS,
  WHEEL_CONFIG,
  getWinningSegment,
  calculateTargetRotation,
  getRandomWinningSegment
}; 