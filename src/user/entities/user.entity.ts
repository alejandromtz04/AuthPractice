import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcryptjs'
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

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default : true })
    isActivated: boolean;

    hashPassword(): void {
        const saltRounds = bcrypt.saltSync(10)
        this.password = bcrypt.hashSync(this.password, saltRounds)
    }

    checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password)
    }
}