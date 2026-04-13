import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Products {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 title: string;
 @Column()
 slug: string;
 @Column()
 description: string;
 @Column()
 price: number;
 @Column({ default: null })
 stock?: number;
 @Column({ default: null })
 discount?: number;
 @Column({ default: null })
 old_price?: number;
 @Column()
 category_id: number;
}
