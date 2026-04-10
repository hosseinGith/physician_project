import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import SignInDto from './dtos/signin.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('login')
    signin(@Body() body: SignInDto) {
        return this.authService.signin(body)
    }
    @Post('registery')
    registery(@Body() body: SignInDto) {
        return this.authService.registery(body)
    }


}
