import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('food_entries')
export class Nutrition {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ type: 'int4' })
    calories!: number;

    @Column({ type: 'varchar', length: 20 })
    meal_type!: 'breakfast' | 'lunch' | 'dinner' | 'snack';

    @Column({ type: 'int4' })
    protein!: number;

    @Column({ type: 'int4' })
    carbs!: number;

    @Column({ type: 'int4' })
    fats!: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    log_date!: Date;

    @ManyToOne(() => User, user => user.food_entries, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
