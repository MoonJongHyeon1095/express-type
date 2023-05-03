import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PatientAddress } from "./patient_address.entity";
import { PatientImage } from "./patient_image.entity";

@Entity({ name: 'patient' })
export class Patient {
  @PrimaryGeneratedColumn({ name: 'patientId' })
  patientId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  ssn: string;

  @Column({ nullable: true })
  enssn: string;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  cellPhone: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  createdAt: string;

  @OneToMany(() => PatientAddress, (patientAddress: PatientAddress) => patientAddress.patientId, { eager: false })
  addresses: PatientAddress[];

  @OneToMany(() => PatientImage, (patientImage: PatientImage) => patientImage.patientId, { eager: false })
  images: PatientImage[];
}
