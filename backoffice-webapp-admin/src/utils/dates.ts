const incrementDateByDay = (date: Date) => {
  let auxDate =
    date.getTime() + (23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000);

  let incrementedDate = new Date(auxDate);
  return incrementedDate;
};

export { incrementDateByDay };
