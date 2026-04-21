import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
enum UseTypeEnum {
 CONVERSITION = 'conversition',
 ADMINUPLOAD = 'adminUpload',
}

@Entity()
export class Files {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 url: string;
 @Column({
  enum: UseTypeEnum,
  enumName: 'UseType',
  default: UseTypeEnum.CONVERSITION,
 })
 @Column()
 use_type: string;
 @Column()
 type: string;
}
