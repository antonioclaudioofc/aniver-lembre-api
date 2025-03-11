import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createUserDto: CreateUserDto) {
    const db = await this.firebaseService.getFirestore();

    const userData = {
      ...JSON.parse(JSON.stringify(createUserDto)),
      createdAt: new Date(),
    };

    const userRef = await db.collection('users').add(userData);

    return { message: 'User added successfully', userId: userRef.id };
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
