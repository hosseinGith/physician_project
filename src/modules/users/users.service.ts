import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import UserDtoAdd from './dtos/user-add.dto';
import UserUpdateDto from './dtos/user-update.dto';
import { AccessType } from 'src/types';
@Injectable()
export class UsersService {
 constructor(
  @InjectRepository(Users)
  private usersRepository: Repository<Users>,
 ) {}

 async findActiveDoctors() {
  return await this.usersRepository.findOneBy({
   access: AccessType.DOCTOR,
   is_active: true,
  });
 }
 async get(id?: number) {
  let res: FindOptionsWhere<Users> | FindOptionsWhere<Users>[] | null;
  if (!Number.isNaN(id)) {
   res = await this.usersRepository.findOneBy({ id });
  } else res = await this.usersRepository.find();
  if (res) return res;
  throw new NotFoundException();
 }
 async add(body: UserDtoAdd) {
  if (await this.usersRepository.findOneBy({ username: body?.username }))
   throw new BadRequestException(
    'این نام کاربری استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
    'username',
   );
  if (body?.national_id)
   if (await this.usersRepository.findOneBy({ national_id: body.national_id }))
    throw new BadRequestException('این کد ملی استفاده شده است.', 'national_id');
  const create_status = this.usersRepository.create(body);
  const user = await this.usersRepository.save(create_status);
  return user;
 }
 async update(id: number, body: UserUpdateDto) {
  if (!id) throw new BadRequestException('', 'id');
  if (body?.username)
   if (await this.usersRepository.findOneBy({ username: body?.username }))
    throw new BadRequestException(
     'این نام کاربری استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
     'username',
    );
  if (body?.national_id)
   if (await this.usersRepository.findOneBy({ national_id: body.national_id }))
    throw new BadRequestException('این کد ملی استفاده شده است.', 'national_id');

  const user = await this.usersRepository.findOneBy({ id });
  const fieldsToUpdate = Object.keys(body).length;

  if (fieldsToUpdate === 0) {
   throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
  }

  if (user)
   return (
    (await this.usersRepository.update({ id: user.id }, body)).affected === 1
   );
  throw new NotFoundException();
 }
 async delete(id: number) {
  if (!id) throw new BadRequestException('id not found', 'id');
  const res = await this.usersRepository.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return true;
 }
}
