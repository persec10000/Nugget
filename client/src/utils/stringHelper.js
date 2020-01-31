export const getFixedNumber = (value, point = 2) => {
  if (Number.isNaN(value)) return 0;

  return Number(Number(value).toFixed(point));
};
