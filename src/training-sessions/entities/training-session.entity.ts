import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';


@Entity('training_sessions')
export class TrainingSession {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'date' })
    date!: Date;

    @Column({ length: 100 })
    title!: string;

    @Column({ type: 'int4', nullable: true })
    duration_minutes!: number;

    @Column({ type: 'int4', nullable: true })
    calories_burned!: number;

    // Relación limpia: Muchas sesiones pertenecen a un solo usuario (user_id)
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;
}