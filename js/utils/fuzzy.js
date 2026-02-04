function fuzzyScore(query, target) {
  query = query.toLowerCase();
  target = target.toLowerCase();

  // Exact substring match = huge bonus
  if (target.includes(query)) {
    return 1000 - target.indexOf(query);
  }

  // In-order character match
  let score = 0;
  let tIndex = 0;

  for (let q of query) {
    const found = target.indexOf(q, tIndex);
    if (found === -1) return -1;
    score += 10;
    tIndex = found + 1;
  }

  // Prefer shorter names
  score -= (target.length - query.length);

  return score;
}

function fuzzyFilter(list, query, limit = 10) {
  if (!query) return [];

  return list
    .map(item => ({
      item,
      score: fuzzyScore(query, item.name)
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.item);
}