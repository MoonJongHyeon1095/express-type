import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from "./patient.entity";

@Entity({ name: 'patient_image' })
export class PatientImage {
  @PrimaryGeneratedColumn({ name: 'imageId' })
  imageId: number;

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

  @Column({ name: 'imageUrl', nullable: true })
  imageUrl: string;

  @Column({ name: 'imageSize', nullable: true })
  imageSize: number;

  @Column({ name: 'imageTxt', nullable: true })
  imageTxt: string;

  @Column({ name: 'createdAt', nullable: true })
  createdAt: string;
}