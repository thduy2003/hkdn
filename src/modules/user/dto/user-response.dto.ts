import { Exclude, Expose } from 'class-transformer';
import { USER_ROLE } from '@shared/enum/user.enum';

@Exclude()
export class UserResponeDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  role: USER_ROLE;
}
