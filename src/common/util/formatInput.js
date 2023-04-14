export const combineDateAndTime = (date, time) => {
  const dateTime = new Date(date + "T" + time);
  return dateTime.toISOString();
};
