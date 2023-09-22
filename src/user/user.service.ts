import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  onModuleInit() {
    // this._mockAUser();
  }

  _mockAUser() {
    this.create({
      name: 'Santi',
      email: 'santiago.lp.cop@gmail.com',
      achievements: [{ name: 'SuperCool' }],
      birthDate: new Date('2000-01-01'),
      pronouns: ['he'],
      lenguagePreference: 'spanish',
      profileUri:
        'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png',
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userModel.create(user);
      if (newUser) {
        this.logger.log(`User ${newUser.name} created`);
      } else {
        this.logger.log(`User ${user.name} was not created`);
      }
      return newUser;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOne(email: string): Promise<User[]> {
    try {
      return await this.userModel.find({ email: email }).exec();
    } catch (error) {
      console.log(error);
    }
  }

  async update(email: string, user: CreateUserDto): Promise<User> {
    return await this.userModel.findOneAndUpdate({ email: email }, user);
  }
}
