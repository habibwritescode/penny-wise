export const calculatePercent = (part: number, total: number) => {
  if (!total) return 0;

  const percentage = (part / total) * 100;
  return percentage >= 100 ? 100 : percentage;
};
