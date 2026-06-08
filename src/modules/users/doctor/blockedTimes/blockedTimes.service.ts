import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { BlockedTimes } from './blockedTimes.entity';

@Injectable()
export class BlockedTimesService {
 constructor(
  @InjectRepository(BlockedTimes)
  private readonly BlockedTimes: Repository<BlockedTimes>,
 ) {}
}
