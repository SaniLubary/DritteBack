import { Injectable, Logger } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.userModel.create(user);
      if (createdUser) {
        this.logger.log(`User ${createdUser} created`);
      } else {
        this.logger.log(`User ${user.name} was not created`);
      }
      return createdUser;
    } catch (error) {
      this.logger.error('Some error occurred: ', error);
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      const users: User[] = await this.userModel.find({ email: email }).exec();
      console.log('User found', users);
      if (users.length > 0) {
        return users[0];
      } else {
        console.log('User not found with mail: ', email);
        return null;
      }
    } catch (error) {
      console.log('Error trying to find user', error);
    }
  }

  async update(email: string, user: CreateUserDto): Promise<User> {
    console.log('Updateing User with: ', user);
    if (typeof user.lenguagePreference !== 'string') {
      user.lenguagePreference = user.lenguagePreference[0];
    }

    try {
      await this.userModel.findOneAndUpdate({ email: email }, user);
      return this.findOne(user.email);
    } catch (error) {
      console.log('Error updating user', error);
    }
  }
}
