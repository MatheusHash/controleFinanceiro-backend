import { IsNumber, IsString, maxLength, minLength } from 'class-validator';

export class CreateBillDto {
  @IsString({
    context: (val) => {
      maxLength(val, 100);
      minLength(val, 2);
    },
  })
  name: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  accountId: number;
}
