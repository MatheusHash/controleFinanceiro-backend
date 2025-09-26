import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Users } from './users.entity';

@Entity({ name: 'acounts' })
export class Account {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  // relacionamento: cada conta possui varios usuarios
  @OneToMany(() => Users, (user) => user.account)
  users: Users[];
}
