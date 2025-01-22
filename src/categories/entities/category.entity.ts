import { Exclude } from "class-transformer";
import { Expense } from "src/expenses/entities/expense.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('categories')
export class Category { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @OneToMany(
        () => Expense,
        (expense) => expense.category,
        { cascade: true}
    )
    expense: Expense

    @ManyToOne(
        () => User,
        (user) => user.category,
        { eager: true }
    )
    user: User

    @CreateDateColumn()
    createdAt?: string;

    @UpdateDateColumn()
    updatedAt?: string;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: string;

}
