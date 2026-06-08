import {
 Controller,
 UseGuards,
 UseInterceptors,
 UsePipes,
} from '@nestjs/common';
import { AccessType } from 'src/types';
import { BlockedTimesService } from './blockedTimes.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import { Access } from 'src/shared/decorators/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';

@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@ApiBearerAuth()
@Controller('/api/doctorhours')
@Access(AccessType.DOCTOR)
@UseGuards(AuthGuard, AccessGuard)
export class BlockedTimesController {
 constructor(private readonly service: BlockedTimesService) {}
}
