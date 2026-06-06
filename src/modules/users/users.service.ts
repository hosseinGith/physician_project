import {
 BadRequestException,
 Injectable,
 InternalServerErrorException,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import {
 FindOptionsRelationByString,
 FindOptionsRelations,
 FindOptionsSelect,
 FindOptionsSelectByString,
 FindOptionsWhere,
 Repository,
} from 'typeorm';
import { AdminAddUser } from './dtos/user-add.dto';
import UserUpdateDto from './dtos/user-update.dto';
import { AccessType } from 'src/types';
import find from 'src/shared/utils/find';
import UserUpdatePublicDto from './dtos/user-update-public.dto';
@Injectable()
export class UsersService {
 constructor(
  @InjectRepository(Users)
  private users: Repository<Users>,
 ) {}

 async findOne(
  id: string,
  relations?: FindOptionsRelations<Users> | FindOptionsRelationByString,
  select?: FindOptionsSelect<Users> | FindOptionsSelectByString<Users>,
  throwError = true,
 ) {
  const user = await this.users.findOne({
   where: { id },
   relations,
   select,
  });
  if (throwError && !user) throw new NotFoundException();
  return user;
 }
 async findOneByWhere(
  where: FindOptionsWhere<Users> | FindOptionsWhere<Users>[],
  relations?: FindOptionsRelationByString | FindOptionsRelations<Users>,
  select?: FindOptionsSelect<Users> | FindOptionsSelectByString<Users>,
 ): Promise<Users> {
  const res = await this.users.findOne({ where, relations, select });
  if (!res) throw new NotFoundException();
  return res;
 }
 async findAllByWhere(
  where: FindOptionsWhere<Users> | FindOptionsWhere<Users>[],
  relations?: FindOptionsRelationByString | FindOptionsRelations<Users>,
  select?: FindOptionsSelect<Users> | FindOptionsSelectByString<Users>,
 ): Promise<Users[]> {
  const res = await this.users.find({ where, relations, select });
  return res;
 }
 async findActiveDoctors() {
  return await this.users.findBy({
   access: AccessType.DOCTOR,
   is_active: true,
  });
 }

 async getProfile(id: string) {
  const userData = await this.users.findOne({
   relations: ['doctor', 'patient'],
   where: { id },
  });
  if (!userData) throw new UnauthorizedException();
  return userData;
 }
 async get(id?: string) {
  return await find<Users>(this.users, id);
 }
 async create(body: AdminAddUser) {
  const existingUser = await this.users.findOne({
   where: { number: body.user.number },
  });

  if (existingUser) {
   throw new BadRequestException(
    'این نام کاربری استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
   );
  }

  const is_active = body.user.access === AccessType.PATIENT;

  const queryRunner = this.users.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
   const user = this.users.create({
    ...body.user,
    is_active,
    ...(body.user.access === AccessType.PATIENT && { patient: body.patient }),
    ...(body.user.access === AccessType.DOCTOR && { doctor: body.doctor }),
   });

   const savedUser = await queryRunner.manager.save(Users, user);

   await queryRunner.commitTransaction();

   return {
    user: { ...savedUser, number: body.user.number, password: undefined },
   };
  } catch {
   await queryRunner.rollbackTransaction();
   throw new BadRequestException('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
  } finally {
   await queryRunner.release();
  }
 }
 private async updateCheckUserData(
  id: string,
  body: {
   number?: string;
   national_id?: string;
  },
 ) {
  if (body?.number)
   if (await this.users.findOneBy({ number: body?.number }))
    throw new BadRequestException(
     'این نام کاربری استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
     'number',
    );

  if (body?.national_id)
   if (await this.users.findOneBy({ national_id: body.national_id }))
    throw new BadRequestException('این کد ملی استفاده شده است.', 'national_id');

  const user = await this.users.findOneBy({ id });
  const fieldsToUpdate = Object.keys(body).length;

  if (fieldsToUpdate === 0) {
   throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
  }
  return user;
 }
 async update(id: string, body: UserUpdateDto) {
  return (await this.users.update({ id }, body)).affected === 1;
 }
 async updateUserData(body: UserUpdatePublicDto, id: string) {
  const user = await this.updateCheckUserData(id, body);
  if (user)
   return (await this.users.update({ id: user.id }, body)).affected === 1;
  throw new NotFoundException();
 }
 async remove(id: string) {
  if (!id) throw new BadRequestException('id not found', 'id');

  const queryRunner = this.users.manager.connection.createQueryRunner();
  // get user with relations to check if it's doctor or patient and delete related data accordingly
  const user = await this.users.findOne({
   where: { id },
   relations: ['doctor', 'patient'],
  });

  if (!user) throw new NotFoundException();

  try {
   await queryRunner.connect();
   await queryRunner.startTransaction();
   // delete related data based on user access type
   if (user?.access === AccessType.DOCTOR && user.doctor) {
    await queryRunner.manager.delete('doctor_hours', {
     doctor: { id: user.doctor.id },
    });
    await queryRunner.manager.delete('doctors', { id });
   } else if (user?.access === AccessType.PATIENT && user.patient) {
    await queryRunner.manager.delete('patients', { id: user.patient.id });
   }
   await queryRunner.manager.delete('users', { id });
   await queryRunner.commitTransaction();

   return true;
  } catch {
   await queryRunner.rollbackTransaction();
   throw new InternalServerErrorException(); // ✅
  } finally {
   await queryRunner.release();
  }
 }
}
