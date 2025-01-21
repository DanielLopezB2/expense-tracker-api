import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('expenses')
export class Expense { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('float', {
        default: 0
    })
    amount: number;

    @ManyToOne(
        () => User,
        (user) => user.expense,
        { eager: true }
    )
    user: User

    @ManyToOne(
        () => Category,
        (category) => category.expense,
        { eager: true }
    )
    category: Category

    @CreateDateColumn()
    createdAt?: string;

    @UpdateDateColumn()
    updatedAt?: string;

    @DeleteDateColumn()
    deletedAt?: string;

}
