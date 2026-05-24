import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categoria } from "./categoria";
import { Usuario } from "./usuario";

@Entity("transacciones")
export class Transaccion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  monto!: number;

  @Column({ nullable: true })
  descripcion!: string;

  @Column({ type: "date" })
  fecha!: string;

  @Column({ type: "enum", enum: ["ingreso", "gasto"] })
  tipo!: "ingreso" | "gasto";

  @Column()
  categoriaId!: number;

  @Column()
  usuarioId!: number;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: "categoriaId" })
  categoria!: Categoria;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;
}
