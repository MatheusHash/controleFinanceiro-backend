// bill.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categorie } from './categories.entity';

@Entity({ name: 'bills' })
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'float' })
  value: number;

  @ManyToOne(() => Categorie, (categorie) => categorie.bills, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categorie_id' })
  categorie: Categorie;

  // opcional, se quiser acesso direto ao id da categoria
  @Column({ nullable: true })
  categorie_id: number;
}
