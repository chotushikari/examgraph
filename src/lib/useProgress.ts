"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudyMode, SubtopicStatus, Unit } from "@/lib/types";

type ProgressState = {
  unit: Unit | null; subtopicStatus: Record<string, SubtopicStatus>; subtopicConfidence: Record<string, number>; conceptBlocksRead: Record<string, number>; selfTestScore: Record<string, number>; selfTestCorrect: Record<string, string[]>; mode: StudyMode;
  setUnit: (unit: Unit) => void; startSubtopic: (id: string) => void; markConceptRead: (id: string, count: number) => void; markSubtopicDone: (id: string, confidence?: number) => void; setConfidence: (id: string, confidence: number) => void; toggleSelfTestCorrect: (subtopicId: string, questionId: string, total: number) => void; setMode: (mode: StudyMode) => void; resetUnit: () => void;
};
const blank = { unit: null, subtopicStatus: {}, subtopicConfidence: {}, conceptBlocksRead: {}, selfTestScore: {}, selfTestCorrect: {} };
export const useProgress = create<ProgressState>()(persist((set) => ({
  ...blank, mode: "deep",
  setUnit: (unit) => { const ids = unit.topics.flatMap((t) => t.subtopics.map((s) => s.id)); set({ unit, subtopicStatus: Object.fromEntries(ids.map((id) => [id, "not_started"])), subtopicConfidence: Object.fromEntries(ids.map((id) => [id, 0])), conceptBlocksRead: Object.fromEntries(ids.map((id) => [id, 0])), selfTestScore: Object.fromEntries(ids.map((id) => [id, 0])), selfTestCorrect: Object.fromEntries(ids.map((id) => [id, []])) }); },
  startSubtopic: (id) => set((s) => ({ subtopicStatus: { ...s.subtopicStatus, [id]: s.subtopicStatus[id] === "not_started" ? "in_progress" : s.subtopicStatus[id] } })),
  markConceptRead: (id, count) => set((s) => ({ conceptBlocksRead: { ...s.conceptBlocksRead, [id]: Math.max(s.conceptBlocksRead[id] || 0, count) } })),
  markSubtopicDone: (id, confidence = 3) => set((s) => ({ subtopicStatus: { ...s.subtopicStatus, [id]: "done" }, subtopicConfidence: { ...s.subtopicConfidence, [id]: confidence } })),
  setConfidence: (id, confidence) => set((s) => ({ subtopicConfidence: { ...s.subtopicConfidence, [id]: confidence } })),
  toggleSelfTestCorrect: (subtopicId, questionId, total) => set((s) => { const prior = s.selfTestCorrect[subtopicId] || []; const next = prior.includes(questionId) ? prior.filter((id) => id !== questionId) : [...prior, questionId]; return { selfTestCorrect: { ...s.selfTestCorrect, [subtopicId]: next }, selfTestScore: { ...s.selfTestScore, [subtopicId]: Math.round(next.length / total * 100) } }; }),
  setMode: (mode) => set({ mode }), resetUnit: () => set(blank),
}), { name: "examgraph-progress-v2", partialize: (s) => ({ unit: s.unit, subtopicStatus: s.subtopicStatus, subtopicConfidence: s.subtopicConfidence, conceptBlocksRead: s.conceptBlocksRead, selfTestScore: s.selfTestScore, selfTestCorrect: s.selfTestCorrect, mode: s.mode }) }));
