import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Client } from '../../clients/entities/client.entity';
import { Sale } from '../../sales/entities/sale.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 200 })
  name: string;

  @Column({ unique: true, length: 50, nullable: true })
  businessId: string; // RUC, NIT, RFC, etc.

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ length: 100, nullable: true })
  industry: string; // retail, restaurant, services, etc.

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  subscriptionEndsAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Product, (product) => product.company)
  products: Product[];

  @OneToMany(() => Client, (client) => client.company)
  clients: Client[];

  @OneToMany(() => Sale, (sale) => sale.company)
  sales: Sale[];
}
