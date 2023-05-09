import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Migrant } from "./migrant.entity";

@Entity({ name: "address" })
export class Address {
  @PrimaryGeneratedColumn({ name: "addressId" })
  addressId: number;

  @ManyToOne(() => Migrant, (migrant: Migrant) => migrant.addresses, {
    eager: true,
    cascade: ["update"],
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "migrantId",
    referencedColumnName: "migrantId",
  })
  migrantId: Promise<Migrant>;

  @Column({ name: "address1", nullable: true })
  address1: string;

  @Column({ name: "address2", nullable: true })
  address2: string;

  @Column({ name: "createdAt", nullable: true })
  createdAt: string;
}
