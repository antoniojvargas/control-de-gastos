import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./usuario";

@Entity("categorias")
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ type: "enum", enum: ["ingreso", "gasto"] })
  tipo!: "ingreso" | "gasto";

  @Column({ nullable: true })
  color!: string;

  @Column({ nullable: true })
  icono!: string;

  @Column()
  usuarioId!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;
}
