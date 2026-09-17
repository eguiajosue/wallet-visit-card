import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RegisterVisitDto {
  @IsString() @IsNotEmpty() cardToken!: string;
  @IsString() @IsNotEmpty() branchId!: string;
  @IsString() @IsNotEmpty() ticketNumber!: string;
  @IsInt() @Min(0) purchaseCents!: number;
  @IsString() @IsNotEmpty() idempotencyKey!: string;
}

