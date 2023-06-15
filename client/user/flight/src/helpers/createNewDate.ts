export const createNewDate = (
  year: number,
  month: number,
  date: number
): Date => {
  return new Date(year, month, date);
};

export const dateToStringWithSlash = (date: Date): string => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const dateToStringAmadeus = (date: Date): string => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)
  }-${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}`;
};
