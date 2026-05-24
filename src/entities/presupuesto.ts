import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categoria } from "./categoria";
import { Usuario } from "./usuario";

@Entity("presupuestos")
export class Presupuesto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  monto!: number;

  @Column()
  mes!: number;

  @Column()
  anio!: number;

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
