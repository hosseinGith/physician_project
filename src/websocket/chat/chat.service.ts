import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Conversitions } from 'src/entitys/conversitions.entity';
import { Users } from 'src/entitys/users.entity';
import { Repository } from 'typeorm';
import { Patients } from 'src/entitys/patients.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { AccessType } from 'src/types';
import { Messages } from 'src/entitys/messages.entity';
import { CryptoHash } from 'src/shared/utils/cryptoHash.service';

@Injectable()
export class ChatService {
 constructor(
  private readonly jwtService: JwtService,
  @InjectRepository(Users)
  private readonly users: Repository<Users>,
  @InjectRepository(Conversitions)
  private readonly conversitions: Repository<Conversitions>,
  @InjectRepository(Patients)
  private readonly patients: Repository<Patients>,
  @InjectRepository(Doctors)
  private readonly doctors: Repository<Doctors>,
  @InjectRepository(Messages)
  private readonly messages: Repository<Messages>,
 ) {}
 async contacts(client: Socket) {
  const clientUser = client['user'] as Users;
  if (!clientUser) return 'asd';
  try {
   const conversitions = await this.conversitions.find({
    where: { doctor: { user: { id: clientUser.id } } },
   });

   return conversitions;
  } catch {
   return false;
  }
 }
 async join(id: string, client: Socket) {
  const clientUser = client['user'] as Users;
  if (!clientUser) return 'اکانت شما پیدا نشد.';

  const clientAccessType = await this[
   clientUser.access === AccessType.DOCTOR ? 'doctors' : 'patients'
  ].findOne({
   where: { user: { id: clientUser.id } },
  });
  if (!clientAccessType) return 'اکانت شما پیدا نشد.';
  const patient = await this.patients.findOne({
   where: [{ id }, { user: { id } }],
  });

  if (!patient) return 'بیمار پیدا نشد.';
  let roomId: string = '';
  if (clientUser.access === AccessType.DOCTOR)
   roomId = `room_doctor_${clientAccessType.id}_patient_${patient.id}`;
  else roomId = `room_doctor_${patient.id}_patient_${clientAccessType.id}`;

  try {
   const conversition = await this.conversitions.findOne({
    where: { roomId },
   });
   if (!conversition)
    return 'مکالمه مورد نظر پیدا نشد یا اطلاعات شما نادرست است.';
   const joinStatus = await client.join(roomId);
   return joinStatus;
  } catch {
   return false;
  }
 }
 async addPatient(id: string, client: Socket) {
  try {
   const clientUser = client['user'] as Users;
   if (!clientUser) return 'اکانت شما پیدا نشد.';
   const doctor = await this.doctors.findOne({
    where: { user: { id: clientUser.id } },
   });
   if (!doctor) return 'اکانت شما پیدا نشد.';

   const patient = await this.patients.findOne({
    where: [{ id }, { user: { id } }],
   });

   if (!patient) return 'بیمار پیدا نشد.';
   const roomId = `room_doctor_${doctor.id}_patient_${patient.id}`;
   const conversition = await this.conversitions.findOne({
    where: { roomId: roomId },
   });
   if (conversition) return 'از قبل با این بیمار صفحبت کردید.';
   const create = this.conversitions.create({
    doctor,
    patient,
    roomId,
   });
   const create_result = await this.conversitions.save(create);
   return Boolean(create_result);
  } catch {
   return 'مشکل در سیستم.';
  }
 }
 async getMessages(targetUser: string, client: Socket) {
  try {
   const clientUser = client['user'] as Users;
   if (!clientUser) return 'کاربر پیدا نشد.';
   const conversitions = await this.conversitions.find({
    where: [{ doctor: { id: clientUser.id } }, { doctor: { id: targetUser } }],
   });

   return conversitions;
  } catch {
   return false;
  }
 }
 async send(roomId: string, content: string, client: Socket) {

  try {
   const clientUser = client['user'] as Users;
   if (!clientUser) return 'User not found';
   const conversition = await this.conversitions.findOne({
    where: [{ roomId }, { id: roomId }],
   });

   if (!conversition) return 'مکالمه مورد نظر پیدا نشد.';

   const message = this.messages.create({
    content: new CryptoHash().encrypt(content),
    conversition: { id: conversition.id },
    sender: { id: clientUser.id },
   });
   const save_message = this.messages.save(message);

   return save_message;
  } catch (err) {
   console.error(err);

   return false;
  }
 }
}
