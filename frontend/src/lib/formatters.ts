export const formatViewCount = (views: number): string => {
  if (views >= 1000) {
    const thousands = views / 1000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
  }
  return views.toString();
};