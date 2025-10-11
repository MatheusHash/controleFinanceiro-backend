// categories.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bill } from './bill.entity';

@Entity({ name: 'categories' })
export class Categorie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  color: string;

  @OneToMany(() => Bill, (bill) => bill.categorie)
  bills: Bill[];
}
