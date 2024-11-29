import { setMonth } from "date-fns";
export const createDaysOptions = (nbDays: number) => {
  return new Array(nbDays ? nbDays : 31).fill(null).map((_, index) => ({
    label: (index + 1).toString(),
    value: index + 1,
  }));
};
export const createMonthsOptions = (
  displayMonth: (timestamp: Date) => string
) => {
  return new Array(12).fill(null).map((_, index) => ({
    label: displayMonth(setMonth(new Date(), index)),
    value: index,
  }));
};
export const createYearsOptions = (
  [minYear, maxYear]: [number, number],
  sort: "ASC" | "DESC" = "ASC"
) => {
  const year = new Date().getFullYear() + minYear;
  const numYears = Math.abs(maxYear - minYear) + 1;
  const options = new Array(numYears).fill(null).map((_, index) => ({
    label: (year + index).toString(),
    value: year + index,
  }));
  return sort === "ASC"
    ? options
    : options.sort(
        (
          {
            value: valueA,
          }: {
            value: number;
          },
          {
            value: valueB,
          }: {
            value: number;
          }
        ) => valueB - valueA
      );
};
