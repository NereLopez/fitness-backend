import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exercises')

export class Exercise {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column ({ type: 'varbinary', length: 50 })
    muscle_group!: string;
}
