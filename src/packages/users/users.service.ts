import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import UserDtoAdd from './dtos/user-add.dto';
import addUser from 'src/shared/utils/add-user';
import UserUpdateDto from './dtos/user-update.dto';
@Injectable()

export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }
    async get(id?: number) {
        let res: FindOptionsWhere<Users> | FindOptionsWhere<Users>[] | null
        if (!Number.isNaN(id)) {
            res = await this.usersRepository.findOneBy({ id })
        }
        else res = await this.usersRepository.find()
        if (res)
            return res
        throw new NotFoundException()
    }
    async add(body: UserDtoAdd) {
        return await addUser(this.usersRepository, body)
    }
    async update(id: number, body: UserUpdateDto) {
        try {
            if (!id)
                throw new BadRequestException("", 'id')

            const user = await this.usersRepository.findOneBy({ id })
            const fieldsToUpdate = Object.keys(body).length;

            if (fieldsToUpdate === 0) {
                throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
            }

            if (user)
                return (await this.usersRepository.update({ id: user.id }, body)).affected === 1
            throw new NotFoundException()
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error instanceof QueryFailedError && error.driverError?.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('این نام کاربری قبلاً استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.', 'username');
            } else {
                throw error;
            }
        }
    }
    async delete(id: number) {
        if (!id) throw new BadRequestException('id not found', 'id')
        const res = await this.usersRepository.delete({ id })
        if (!res.affected) throw new NotFoundException()
        return true

    }
}
