import { ConflictException } from '@nestjs/common';
import { Users } from 'src/entitys/users.entity';
import { QueryFailedError, Repository } from 'typeorm';

export default async function addUser(
 usersRepository: Repository<Users>,
 body: any,
) {
 try {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const create_status = usersRepository.create(body);
  const user = await usersRepository.save(create_status);
  return user;
 } catch (error) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (
   error instanceof QueryFailedError &&
   error.driverError?.code === 'ER_DUP_ENTRY'
  ) {
   throw new ConflictException(
    'این نام کاربری قبلاً استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
    'username',
   );
  } else {
   throw error;
  }
 }
}
