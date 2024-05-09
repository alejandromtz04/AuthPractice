import { TypeOrmModule } from "@nestjs/typeorm";
import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column({ unique: true })
    userName: string;

    @Column()
    password: string;

    @Column({ default : true })
    isActivated: boolean;
}