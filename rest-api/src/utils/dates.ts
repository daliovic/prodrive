const incrementDateByDay = (date: Date) => {
  const auxDate = date.getTime() + (23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000);
  const incrementedDate = new Date(auxDate);
  return incrementedDate;
};

export { incrementDateByDay };
