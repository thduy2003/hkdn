import { EnterResultDto } from '@modules/exam/dto/enter-result.dto';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateResultDto extends PickType<EnterResultDto, 'result' | 'examId'>(EnterResultDto, [
  'result',
  'examId',
]) {}
