import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany, JoinColumn} from 'typeorm';
import { Role } from '../role/role.entity';
import { UserDetails } from './user.details.entity';

@Entity('users')
export class User extends BaseEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', unique: true, length: 25, nullable: false})
    username: string;

    @Column({type: 'varchar', nullable: false})
    email: string

    @Column({type: 'varchar', nullable: false})
    password: string;

    @OneToOne(type => UserDetails, {
        cascade: true, 
        nullable: false, 
        eager: true
    })
    @JoinColumn({name: 'detail_id'})
    details: UserDetails;

    @ManyToMany(type => Role, role => role.users)
    @JoinTable({name: 'user_roles'})
    roles: Role[];

    @Column({type: 'varchar', default: 'ACTIVE', length: 8})
    status: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}