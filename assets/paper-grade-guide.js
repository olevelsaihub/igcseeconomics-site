(function (root) {
  'use strict';

  // Pearson International GCSE Economics 4EC1, June 2026 overall subject boundaries.
  // These apply to the named complete Paper 1 + Paper 2 pair, never to selected question parts.
  const boundaries = Object.freeze({
    standard: Object.freeze({9: 122, 8: 112, 7: 102, 6: 93, 5: 85, 4: 77, 3: 64, 2: 51, 1: 38}),
    regional: Object.freeze({9: 121, 8: 111, 7: 101, 6: 94, 5: 87, 4: 81, 3: 69, 2: 57, 1: 45})
  });

  function assessOfficialPair(variant, score) {
    const table = boundaries[variant];
    if (!table || !Number.isInteger(score) || score < 0 || score > 160) return null;
    const grade = [9, 8, 7, 6, 5, 4, 3, 2, 1].find(level => score >= table[level]) || 0;
    const secureGrade = [9, 8, 7, 6, 5, 4, 3, 2, 1].find(level => score >= table[level] + 10) || 0;
    const nextGrade = grade < 9 ? grade + 1 : null;
    return {
      variant, score, grade, secureGrade, nextGrade,
      nextMarks: nextGrade ? table[nextGrade] - score : 0,
      boundaries: table
    };
  }

  function describeCustomPaper(paper, types) {
    const topics = new Set();
    const difficultyMarks = {Easy: 0, Medium: 0, Difficult: 0, 'Very Difficult': 0};
    let total = 0;
    let legacyMarks = 0;
    for (const part of paper.parts || []) {
      const marks = Number(part.marks);
      if (!Number.isInteger(marks) || marks < 1) continue;
      total += marks;
      if (String(part.source || '').startsWith('4EC1-LEGACY-')) legacyMarks += marks;
      const type = types.get(part.typeKey);
      if (type?.topicId) topics.add(type.topicId);
      if (type?.difficulty in difficultyMarks) difficultyMarks[type.difficulty] += marks;
    }
    const filters = paper.filters || {};
    const focused = Boolean(filters.topic || filters.difficulty || filters.plan || filters.scopeMode) || total < 120 || topics.size < 5;
    return {total, topics: topics.size, difficultyMarks, legacyMarks, focused};
  }

  root.OlvPaperGradeGuide = Object.freeze({boundaries, assessOfficialPair, describeCustomPaper});
})(typeof window !== 'undefined' ? window : globalThis);
