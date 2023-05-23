import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column({
        select: false
    })
    password: string

    @Column()
    is_embassador: boolean;

    get name(): string {
        return this.first_name + ' ' + this.last_name
    }
}