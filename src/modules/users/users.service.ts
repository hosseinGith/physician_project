import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { Repository } from 'typeorm';
import { AdminAddUser } from './dtos/user-add.dto';
import UserUpdateDto from './dtos/user-update.dto';
import bcrypt from 'bcrypt';
import { AccessType } from 'src/types';
import { Patients } from 'src/entitys/patients.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
 constructor(
  @InjectRepository(Users)
  private usersRepository: Repository<Users>,
  @InjectRepository(Patients)
  private patients: Repository<Patients>,
  @InjectRepository(Doctors)
  private doctors: Repository<Doctors>,
  private jwtService: JwtService,
 ) {}

 async findActiveDoctors() {
  return await this.usersRepository.findOneBy({
   access: AccessType.DOCTOR,
   is_active: true,
  });
 }
 async get(id?: number) {
  if (!Number.isNaN(id) && id) {
   return await this.usersRepository.findOneBy({ id });
  }
  return await this.usersRepository.find();
 }
 async add(body: AdminAddUser) {
  const existingUser = await this.usersRepository.findOne({
   where: { number: body.user.number },
  });

  if (existingUser) {
   throw new BadRequestException(
    'این نام کاربری استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
   );
  }

  const is_active = body.user.access === AccessType.PATIENT;

  const queryRunner =
   this.usersRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
   const user = this.usersRepository.create({
    number: body.user.number,
    is_active,
    access: body.user.access,
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
    number: savedUser.number,
    role: body.user.access,
   });

   return {
    token,
    user: savedUser,
   };
  } catch {
   await queryRunner.rollbackTransaction();
   throw new BadRequestException('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
  } finally {
   await queryRunner.release();
  }
 }
 async update(id: number, body: UserUpdateDto) {
  if (!id) throw new BadRequestException('', 'id');
  if (body?.number)
   if (await this.usersRepository.findOneBy({ number: body?.number }))
    throw new BadRequestException(
     'این نام کاربری استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
     'number',
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

  const queryRunner =
   this.usersRepository.manager.connection.createQueryRunner();
  const user = await this.usersRepository.findOneBy({ id });
  if (!user) throw new NotFoundException();
  try {
   await queryRunner.connect();
   await queryRunner.startTransaction();

   if (user?.access === AccessType.DOCTOR) {
    const id = (await this.doctors.findOneBy({ user }))?.id;
    await queryRunner.manager.delete('doctors', { id });
   } else if (user?.access === AccessType.PATIENT) {
    const id = (await this.patients.findOneBy({ user }))?.id;
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
