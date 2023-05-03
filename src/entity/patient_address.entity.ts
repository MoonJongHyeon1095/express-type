import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Patient } from "./patient.entity";

@Entity({ name: "patient_address" })
export class PatientAddress {
  @PrimaryGeneratedColumn({ name: "addressId" })
  addressId: number;

  @ManyToOne(() => Patient, (patient: Patient) => patient.addresses, {
    eager: true,
    cascade: ["update"],
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "patientId",
    referencedColumnName: "patientId",
  })
  patientId: Promise<Patient>;

  @Column({ name: "address1", nullable: true })
  address1: string;

  @Column({ name: "address2", nullable: true })
  address2: string;

  @Column({ name: "createdAt", nullable: true })
  createdAt: string;
}
