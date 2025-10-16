import { Account } from 'src/accounts/entities/account.entity';
import { Bill } from 'src/bills/entities/bill.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Account, (account) => account.categories, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @OneToMany(() => Bill, (bill) => bill.category)
  bills: Bill[];
}
