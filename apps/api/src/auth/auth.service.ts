import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(email: string, pass: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new ConflictException('User already exists');
            }

            const hashedPassword = await bcrypt.hash(pass, 10);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            const { password, ...result } = user;
            return result;
        } catch (error) {
            this.logger.error(`Registration failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async login(email: string, pass: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(pass, user.password);
            if (!isMatch) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const payload = { email: user.email, sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                }
            };
        } catch (error) {
            this.logger.error(`Login failed: ${error.message}`, error.stack);
            throw error;
        }
    }
}
