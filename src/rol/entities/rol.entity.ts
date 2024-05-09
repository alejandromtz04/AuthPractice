import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rolName: string;

    @Column({ default : true })
    isActivated: boolean
}
