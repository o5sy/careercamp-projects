import questions from './questions.json'
import { INTRO_BRANCH_ID } from '../constants'

/**
 * @typedef {Object} Choice
 * @property {string} text
 * @property {boolean} correct
 * @property {string} feedback
 *
 * @typedef {Object} Question
 * @property {'역할'|'상황'|'형식'|'목적'} element
 * @property {string} prompt
 * @property {Choice[]} choices
 *
 * @typedef {Object} BeforeAfter
 * @property {string} before_question
 * @property {string} before_answer
 * @property {string} after_answer
 *
 * @typedef {Object} Branch
 * @property {string} branch_id
 * @property {string} branch_label
 * @property {string} situation_card
 * @property {Question[]} questions
 * @property {string} assembled_question
 * @property {BeforeAfter} before_after
 *
 * @typedef {Object} Topic
 * @property {string} topic
 * @property {string} topic_label
 * @property {string} topic_icon
 * @property {Branch[]} branches
 */

/** @type {Topic[]} — topic을 추가하면 허브 카드가 자동으로 늘어납니다. */
export const TOPICS = questions.topics

/** branch_id → { topic, branch } 조회용 인덱스 */
const BRANCH_INDEX = new Map()
for (const topic of TOPICS) {
  for (const branch of topic.branches) {
    BRANCH_INDEX.set(branch.branch_id, { topic, branch })
  }
}

/** 전체 분기(진행 단위) 목록 — 허브 · 결과 집계의 분모로 사용 (하드코딩 금지) */
export const ALL_BRANCHES = [...BRANCH_INDEX.values()]

/** 전체 분기 개수 (현재 데이터: 8) */
export const TOTAL_BRANCHES = ALL_BRANCHES.length

/** 전체 문항 개수 (현재 데이터: 32) */
export const TOTAL_QUESTIONS = ALL_BRANCHES.reduce(
  (sum, { branch }) => sum + branch.questions.length,
  0,
)

/**
 * @param {string} branchId
 * @returns {{ topic: Topic, branch: Branch } | undefined}
 */
export function findBranch(branchId) {
  return BRANCH_INDEX.get(branchId)
}

/** @param {string} topicId */
export function findTopic(topicId) {
  return TOPICS.find((t) => t.topic === topicId)
}

/** 인트로 데모용 분기 — 지정한 분기가 없으면 첫 번째 분기로 대체 */
export const INTRO_BRANCH =
  findBranch(INTRO_BRANCH_ID)?.branch ?? TOPICS[0]?.branches[0]
