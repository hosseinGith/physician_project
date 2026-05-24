import {
 BadRequestException,
 Injectable,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { Repository } from 'typeorm';
import { AdminAddUser } from './dtos/user-add.dto';
import UserUpdateDto from './dtos/user-update.dto';
import { AccessType } from 'src/types';
import { Patients } from 'src/entitys/patients.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { JwtService } from '@nestjs/jwt';
import find from 'src/shared/utils/find';
import UserUpdatePublicDto from './dtos/user-update-public.dto';
import getDataFromUserToken from 'src/shared/utils/getDataFromUserToken';
import { Request } from 'express';
@Injectable()
export class UsersService {
 constructor(
  @InjectRepository(Users)
  private users: Repository<Users>,
  @InjectRepository(Patients)
  private patients: Repository<Patients>,
  @InjectRepository(Doctors)
  private doctors: Repository<Doctors>,
  private jwtService: JwtService,
 ) {}

 async findActiveDoctors() {
  return await this.users.findOneBy({
   access: AccessType.DOCTOR,
   is_active: true,
  });
 }

 async getUserInitialInfo(request: Request) {
  const token = getDataFromUserToken(request);
  console.log(token);
  
  const id = token?.id;
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
 async add(body: AdminAddUser) {
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
   });

   const savedUser = await queryRunner.manager.save(user);

   if (body.user.access === AccessType.PATIENT) {
    const patient = this.patients.create({ user: savedUser, ...body.patient });
    await queryRunner.manager.save(patient);
   } else if (body.user.access === AccessType.DOCTOR) {
    const doctor = this.doctors.create({ user: savedUser, ...body.doctor });
    await queryRunner.manager.save(doctor);
   }

   await queryRunner.commitTransaction();

   const token = this.jwtService.sign({
    id: savedUser.id,
    number: body.user.number,
    role: body.user.access,
   });

   return {
    token,
    user: { ...savedUser, number: body.user.number },
   };
  } catch (err) {
   console.error(err);

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
  if (!id) throw new BadRequestException('', 'id');
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
  const user = await this.updateCheckUserData(id, body);
  if (user)
   return (await this.users.update({ id: user.id }, body)).affected === 1;
  throw new NotFoundException();
 }
 async updateUserData(body: UserUpdatePublicDto, request: Request) {
  const token = getDataFromUserToken(request);
  if (!token) throw new UnauthorizedException();

  const user = await this.updateCheckUserData(token.id, body);

  if (user)
   return (await this.users.update({ id: user.id }, body)).affected === 1;
  throw new NotFoundException();
 }
 async delete(id: string) {
  if (!id) throw new BadRequestException('id not found', 'id');

  const queryRunner = this.users.manager.connection.createQueryRunner();
  const user = await this.users.findOneBy({ id });
  if (!user) throw new NotFoundException();
  try {
   await queryRunner.connect();
   await queryRunner.startTransaction();

   if (user?.access === AccessType.DOCTOR) {
    const id = (await this.doctors.findOneBy({ user: { id: user.id } }))?.id;

    await queryRunner.manager.delete('doctor_hours', { doctor: { id } });
    await queryRunner.manager.delete('doctors', { id });
   } else if (user?.access === AccessType.PATIENT) {
    const id = (await this.patients.findOneBy({ user: { id: user.id } }))?.id;
    await queryRunner.manager.delete('patients', { id });
   }
   await queryRunner.manager.delete('users', { id });
   await queryRunner.commitTransaction();

   return true;
  } catch (error) {
   await queryRunner.rollbackTransaction();
   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
   return error;
  } finally {
   await queryRunner.release();
  }
 }
}
