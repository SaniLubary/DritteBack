import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  onModuleInit() {
    this.save({
      name: 'Santi',
      mail: 'santi@gmail.com',
      points: 10,
      achievements: [{ name: 'SuperCool' }],
      daily_activities: [
        {
          emotions: [{ name: 'Sad' }],
          daily_entry: { title: 'Daily entry', description: 'Hihi' },
        },
      ],
    });
  }

  async save(user: CreateUserDto): Promise<User> {
    try {
      const newUser = new this.userModel(user);
      return newUser.save();
    } catch (error) {
      new Logger('User creation').error(error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
