import { Exclude } from "class-transformer";
import { Category } from "src/categories/entities/category.entity";
import { Expense } from "src/expenses/entities/expense.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text',
        {
            unique: true
        }
    )
    email: string;

    @Column('text')
    password: string;

    @OneToMany(
        () => Expense,
        (expense) => expense.user,
        { cascade: true }
    )
    expense: Expense

    @OneToMany(
        () => Category,
        (category) => category.user,
        { cascade: true }
    )
    category: Category

    @CreateDateColumn()
    createdAt?: string;

    @UpdateDateColumn()
    updatedAt?: string;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: string;

}
