import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Address } from "./address.entity";
import { Image } from "./image.entity";

@Entity({ name: 'migrant' })
export class Migrant {
  @PrimaryGeneratedColumn({ name: 'migrantId' })
  migrantId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  enssn: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  createdAt: string;

  @OneToMany(() => Address, (address: Address) => address.migrantId, { eager: false })
  addresses: Address[];

  @OneToMany(() => Image, (image: Image) => image.migrantId, { eager: false })
  images: Image[];
}
