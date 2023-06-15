import { dayShortNames, monthFullNames } from "../consts";

export const getTotalDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstLastDayIndexInMonth = (
  year: number,
  month: number
): number[] => {
  const currentDate = new Date(year, month);
  const firstDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const lastDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDay();
  return [firstDayIndex, lastDayIndex];
};

export const getLastDateLastMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const getLastDayIndexLastMonth = (
  year: number,
  month: number
): number => {
  return new Date(year, month, 0).getDay();
};

export const getDayList = (year: number, month: number): number[] => {
  const totalDays = getTotalDaysInMonth(year, month);
  const [firstDayIndex, lastDayIndex] = getFirstLastDayIndexInMonth(
    year,
    month
  );
  const lastDateLastMonth = getLastDateLastMonth(year, month);
  const dayList: number[] = [];
  // Add date last month
  for (let l = lastDateLastMonth; l > lastDateLastMonth - firstDayIndex; l--) {
    dayList.push(0);
  }
  // Add date current month
  for (let c = 1; c <= totalDays; c++) {
    dayList.push(c);
  }
  // Add date next month
  for (let n = 1; n <= 6 - lastDayIndex; n++) {
    dayList.push(0);
  }
  return dayList;
};
