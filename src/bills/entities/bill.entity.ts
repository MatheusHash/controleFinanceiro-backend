// bill.entity.ts
import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'bills' })
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Category, (category) => category.bills, {
    onDelete: 'SET NULL', // se a categoria for excluída, o campo fica NULL
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // Campo opcional para acesso direto ao id da categoria
  @Column({ nullable: true })
  category_id: number;
}
