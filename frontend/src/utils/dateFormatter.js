export const isTaskOverdue = (dueDate, status) => {
  if (!dueDate || status === 'DONE') return false;
  const targetDate = new Date(dueDate);
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  return targetDate < today;
};

export const formatDisplayDate = (dateString, fallback = '-') => {
  if (!dateString) return fallback;
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
