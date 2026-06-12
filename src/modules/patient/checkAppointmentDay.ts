import moment from 'moment';
import { EnglishDaysEnum } from './types';

export default function getNextValidDate(targetDayName: EnglishDaysEnum) {
 const today = moment().startOf('day');
 const targetDate = moment().day(targetDayName).startOf('day');
 const nextWeek = today.add(1, 'week');

 if (
  targetDayName.toLowerCase() === 'friday' ||
  targetDate.isBefore(today) ||
  targetDate.isAfter(nextWeek)
 ) {
  return null;
 }
 return targetDate.toDate();
}
