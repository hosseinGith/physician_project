import { OmitType } from '@nestjs/swagger';
import { BlockedTimes } from '../entities/blockedTimes.entity';
import { IsString } from 'class-validator';

export default class CreateBlockedTimeDto extends OmitType(BlockedTimes, [
 'id',
 'doctor',
 'reason',
]) {
 @IsString()
 reason?: string;
}
