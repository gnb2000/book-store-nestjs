import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_details')
export class UserDetails extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 25, nullable: false})
    name: string;

    @Column({type: 'varchar', nullable: true})
    lastname: string

    @Column({type: 'varchar', default: 'ACTIVE', length: 8})
    status: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}