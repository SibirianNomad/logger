import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../modules/user/models/user.model';
import { LogInfoDto } from '../dto/response/log-info.dto';

@Entity('log.logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  ip: string;

  @Column()
  url: string;

  @Column()
  browser: string;

  @Column()
  query: string;

  @Column()
  body: string;

  @Column({ name: 'created_at' })
  createdAt: string;

  @Column({ name: 'updated_at' })
  updatedAt: string;

  toInfoDto() {
    return new LogInfoDto(this);
  }
}
