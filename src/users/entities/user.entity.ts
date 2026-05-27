import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users') //Le decimos a TypeORM que esta clase se corresponde con la tabla "users" de la base de datos
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 150 })
    password!: string;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Column({ type: 'int', nullable: true })
    age!: number;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    weight!: number;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    height!: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    gender!: string;

    @Column({ name: 'fitness_goal', type: 'varchar', length: 50, nullable: true })
    fitnessGoal!: string;

    @CreateDateColumn({ name: 'create_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}
