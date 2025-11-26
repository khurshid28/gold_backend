import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyMyIdDto } from './dto/verify-myid.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, name, password, phone } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      access_token: token,
    };
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;

    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new BadRequestException('User with this phone not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Phone already verified');
    }

    // Generate 6 digit OTP (100000 - 999999)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // OTP expires in 2 minutes
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this.prisma.user.update({
      where: { phone },
      data: {
        otp,
        otpExpiresAt,
      },
    });

    // TODO: Send OTP via SMS provider (Eskiz.uz, Playmobile.uz, etc.)
    console.log(`📱 OTP for ${phone}: ${otp} (expires in 2 minutes)`);

    return {
      message: 'OTP sent successfully. Valid for 2 minutes.',
      expiresIn: '2 minutes',
      // Remove this in production!
      otp: otp, // Only for development/testing
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone, otp } = verifyOtpDto;

    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Phone already verified');
    }

    if (!user.otp || !user.otpExpiresAt) {
      throw new BadRequestException('OTP not sent. Please request a new OTP.');
    }

    // Check if OTP has expired (2 minutes)
    const now = new Date();
    if (now > user.otpExpiresAt) {
      // Clear expired OTP from database
      await this.prisma.user.update({
        where: { phone },
        data: {
          otp: null,
          otpExpiresAt: null,
        },
      });
      throw new BadRequestException('OTP expired. Please request a new OTP.');
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Mark user as verified and clear OTP
    await this.prisma.user.update({
      where: { phone },
      data: {
        isVerified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Phone verified successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isVerified: true,
      },
      access_token: token,
    };
  }

  private generateToken(userId: number, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    };
  }

  async verifyMyId(userId: number, verifyMyIdDto: VerifyMyIdDto) {
    const { code } = verifyMyIdDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { myIdData: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // For testing: simulate MyID API call
    // In production, you would call actual MyID API here
    // Example: const response = await this.myIdApi.verify(code);
    
    // Test data based on code
    const testData = {
      responseId: `MYID-${Date.now()}`,
      comparisonValue: 98.5,
      passportSeries: 'AA',
      passportNumber: '1234567',
      fullName: 'Xurshid Ismoilov',
      birthDate: '1990-01-15',
      address: 'Toshkent shahar, Chilonzor tumani',
      nationality: 'O\'zbekiston',
      profile: {
        photo: 'base64_encoded_photo_here',
        issueDate: '2020-01-15',
        expiryDate: '2030-01-15',
        issuedBy: 'IIB Toshkent',
      },
    };

    // Check if MyID data already exists
    if (user.myIdData) {
      // Update existing MyID data
      const myIdData = await this.prisma.myId.update({
        where: { userId },
        data: {
          responseId: testData.responseId,
          comparisonValue: testData.comparisonValue,
          passportSeries: testData.passportSeries,
          passportNumber: testData.passportNumber,
          fullName: testData.fullName,
          birthDate: testData.birthDate,
          address: testData.address,
          nationality: testData.nationality,
          profile: testData.profile,
          isVerified: true,
        },
      });

      return {
        message: 'MyID verification successful',
        myIdData: {
          fullName: myIdData.fullName,
          passportSeries: myIdData.passportSeries,
          passportNumber: myIdData.passportNumber,
          birthDate: myIdData.birthDate,
          isVerified: myIdData.isVerified,
        },
      };
    }

    // Create new MyID data
    const myIdData = await this.prisma.myId.create({
      data: {
        userId,
        responseId: testData.responseId,
        comparisonValue: testData.comparisonValue,
        passportSeries: testData.passportSeries,
        passportNumber: testData.passportNumber,
        fullName: testData.fullName,
        birthDate: testData.birthDate,
        address: testData.address,
        nationality: testData.nationality,
        profile: testData.profile,
        isVerified: true,
      },
    });

    return {
      message: 'MyID verification successful',
      myIdData: {
        fullName: myIdData.fullName,
        passportSeries: myIdData.passportSeries,
        passportNumber: myIdData.passportNumber,
        birthDate: myIdData.birthDate,
        address: myIdData.address,
        isVerified: myIdData.isVerified,
      },
    };
  }

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = `/public/uploads/${file.filename}`;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { imageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        imageUrl: true,
        role: true,
        isVerified: true,
      },
    });

    return {
      message: 'Avatar uploaded successfully',
      user,
    };
  }
}
