import moment from 'moment';
import { EnglishDaysEnum } from './types';
import { BadRequestException } from '@nestjs/common';

export default function getNextValidDate(
 targetDayName: EnglishDaysEnum,
 callbackGetLog?: () => void,
) {
 const today = moment().startOf('day');
 const targetDate = moment().day(targetDayName).startOf('day');
 const nextWeek = today.add(1, 'week');

 if (
  targetDayName.toLowerCase() === 'friday' ||
  targetDate.isBefore(today) ||
  targetDate.isAfter(nextWeek)
 ) {
  if (callbackGetLog) callbackGetLog();
  if (targetDayName.toLowerCase() === 'friday')
   throw new BadRequestException('روز جمعه تعطیل هست.');
  else throw new BadRequestException('از ارسال روز اشتباه خوداری کنید.');
 }
 return targetDate.toDate();
}
