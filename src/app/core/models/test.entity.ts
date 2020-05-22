import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Experiment } from './experiment.entity';
import { Behavior } from './behavior.entity';

@Entity({ name: 'test' })
export class Test extends BaseEntity {

  @PrimaryGeneratedColumn()
  Id: number;

  @PrimaryColumn()
  idExperiment: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  time: number;

  @ManyToOne(() => Experiment, (experiment) => experiment.tests, {
    onDelete: "CASCADE",
  })

  @JoinColumn([{ name: "idExperiment", referencedColumnName: "idExperiment" }])
  idExperiment2: Experiment;

  @OneToMany(() => Behavior, (behavior) => behavior.idTest2)
  behaviors: Behavior[];
}