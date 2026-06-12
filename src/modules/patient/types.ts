export enum SortedByEnum {
 NEWER = 'newer',
 OLDER = 'older',
}
export const englishDays = [
 'Sunday',
 'Monday',
 'Tuesday',
 'Wednesday',
 'Thursday',
 'Friday',
 'Saturday',
] as const;
export type EnglishDaysEnum = (typeof englishDays)[number];
