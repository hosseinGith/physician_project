import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { BlockedTimes } from './blockedTimes.entity';
import { DoctorService } from '../doctor.service';

@Injectable()
export class BlockedTimesService {
 constructor(
  @InjectRepository(BlockedTimes)
  private readonly BlockedTimes: Repository<BlockedTimes>,
  private readonly doctors: DoctorService,
 ) {}

 async findOne(id: string, userId: string) {
  const doctor = await this.doctors.findOne({ user: { id: userId } });
  if (!doctor) throw new NotFoundException('دکتر پیدا نشد.');

  const blockedItem = await this.BlockedTimes.findOne({
   where: { id, doctor: { id: doctor.id } },
  });
  if (!blockedItem) throw new NotFoundException('رکورد مورد نظر پیدا نشد.');
  return blockedItem;
 }

 async findAll(userId: string) {
  const doctor = await this.doctors.findOne({ user: { id: userId } });
  if (!doctor) throw new NotFoundException('دکتر پیدا نشد.');

  const blockedItem = await this.BlockedTimes.find({
   where: { doctor: { id: doctor.id } },
  });
  return blockedItem;
 }

 async remove(id: string, userId: string) {
  const blockedItem = await this.findOne(id, userId);
  return await this.BlockedTimes.delete(blockedItem.id);
 }
}
