// ابتدا یک decorator سفارشی بسازید
// access.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AccessType } from 'src/types';

export const Access = (...accessTypes: AccessType[]) =>
 SetMetadata('accessTypes', accessTypes);
