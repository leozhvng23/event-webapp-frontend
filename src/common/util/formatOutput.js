import { format } from "date-fns";

export const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  return format(date, "MM/dd/yy");
};

export const formatTime = (isoDateString) => {
  const date = new Date(isoDateString);
  return format(date, "hh:mm a");
};
