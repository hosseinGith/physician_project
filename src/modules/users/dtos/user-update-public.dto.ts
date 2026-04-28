import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { Users } from 'src/entitys/users.entity';

export default class UserUpdatePublicDto extends PartialType(
 OmitType(Users, [
  'access',
  'doctor',
  'patient',
  'created_at',
  'id',
  'is_active',
  'number',
 ]),
) {}
