import { BadRequestException, Injectable } from '@nestjs/common';
import SignIn from './dtos/signin.dto';
import * as bcrypt from "bcrypt";
import { Users } from 'src/entitys/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import SignInDto from './dtos/signin.dto';
import addUser from 'src/shared/utils/add-user';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        private readonly jwtService: JwtService) { }
    async signin(body: SignIn) {
        const user = await this.usersRepository.findOneBy({ username: body.username })

        if (!user)
            throw new BadRequestException('نام کاربری یا رمز عبور اشتباه است.')
        const compare = await bcrypt.compare(body.password, user.password)
        if (!compare)
            throw new BadRequestException('نام کاربری یا رمز عبور اشتباه است.')
        const token = this.jwtService.sign({ id: user.id, username: user.username })
        return token
    }
    async registery(body: SignInDto) {
        const user = await addUser(this.usersRepository, body)
        if (!('username' in user) || !('id' in user)) return
        const token = this.jwtService.sign({ id: user.id, username: user.username }, {
            expiresIn: 1000
        })
        return { token }

    }

}