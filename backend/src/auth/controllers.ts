import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserDocument } from './models';
import { ConflictException, UnauthorizedException } from '../exceptions/http.exception';

export class AuthController {
  constructor(
    private userModel: Model<UserDocument>,
    private jwtSecret: string
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nombre, email, password } = req.body;

      const existingUser = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está registrado.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({
        nombre,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      const savedUser = await user.save();

      res.status(201).json({
        message: 'Usuario registrado exitosamente.',
        user: {
          id: savedUser._id.toString(),
          nombre: savedUser.nombre,
          email: savedUser.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }

      const payload = { sub: user._id.toString(), email: user.email };
      const access_token = jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });

      res.status(200).json({
        user: {
          id: user._id.toString(),
          nombre: user.nombre,
          email: user.email,
        },
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ message: 'No autorizado.' });
        return;
      }
      res.status(200).json({
        id: user._id.toString(),
        nombre: user.nombre,
        email: user.email,
      });
    } catch (err) {
      next(err);
    }
  }
}
