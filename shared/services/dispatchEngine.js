/**
 * Dispatch Engine v1
 * Setup-driven weighted scoring that can be tuned in setup_settings.
 */

const DEFAULT_WEIGHTS = {
  distance: 0.25,
  workload: 0.15,
  skill: 0.2,
  inventoryFit: 0.15,
  weather: 0.1,
  daylight: 0.1,
  carryover: 0.05,
};

function normalize(value, min = 0, max = 100) {
  if (max <= min) return 0;
  const n = (value - min) / (max - min);
  return Math.max(0, Math.min(1, n));
}

function scoreCandidate(job, tech, context, weights) {
  const distanceScore = 1 - normalize(context.distanceMiles?.[tech.id] ?? 100, 0, 150);
  const workloadScore = 1 - normalize(context.workloadMinutes?.[tech.id] ?? 480, 0, 600);
  const skillScore = normalize(context.skillByTech?.[tech.id]?.[job.problemType] ?? 50, 0, 100);
  const inventoryScore = normalize(context.inventoryFit?.[tech.id]?.[job.id] ?? 50, 0, 100);
  const weatherScore = normalize(context.weatherFeasibility?.[tech.id]?.[job.id] ?? 50, 0, 100);
  const daylightScore = normalize(context.daylightFeasibility?.[tech.id]?.[job.id] ?? 50, 0, 100);
  const carryoverScore = job.isCarryover ? 1 : 0.5;

  const total =
    (distanceScore * weights.distance) +
    (workloadScore * weights.workload) +
    (skillScore * weights.skill) +
    (inventoryScore * weights.inventoryFit) +
    (weatherScore * weights.weather) +
    (daylightScore * weights.daylight) +
    (carryoverScore * weights.carryover);

  return {
    techId: tech.id,
    total,
    components: {
      distanceScore,
      workloadScore,
      skillScore,
      inventoryScore,
      weatherScore,
      daylightScore,
      carryoverScore,
    },
  };
}

export function recommendAssignments(jobs, techs, context = {}, setupWeights = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...(setupWeights || {}) };
  return jobs.map((job) => {
    const candidates = techs.map((tech) => scoreCandidate(job, tech, context, weights));
    candidates.sort((a, b) => b.total - a.total);
    return {
      jobId: job.id,
      recommendedTechId: candidates[0]?.techId || null,
      candidates,
      evaluatedAt: new Date().toISOString(),
    };
  });
}
