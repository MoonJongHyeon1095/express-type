import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Migrant } from "./migrant.entity";

@Entity({ name: 'image' })
export class Image {
  @PrimaryGeneratedColumn({ name: 'imageId' })
  imageId: number;

  @ManyToOne(() => Migrant, (migrant: Migrant) => migrant.images, {
    eager: true,
    cascade: ["update"],
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "migrantId",
    referencedColumnName: "migrantId",
  })
  migrantId: Promise<Migrant>;

  @Column({ name: 'imageUrl', nullable: true })
  imageUrl: string;

  @Column({ name: 'imageTxt', nullable: true })
  imageTxt: string;

  @Column({ name: 'createdAt', nullable: true })
  createdAt: string;
}