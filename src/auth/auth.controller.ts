import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Request,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyMyIdDto } from './dto/verify-myid.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { multerConfig } from '../upload/multer.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return await this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-myid')
  async verifyMyId(@Request() req, @Body() verifyMyIdDto: VerifyMyIdDto) {
    return await this.authService.verifyMyId(req.user.id, verifyMyIdDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {
      message: 'Profile retrieved successfully',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('upload-avatar')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return await this.authService.uploadAvatar(req.user.id, file);
  }
}
