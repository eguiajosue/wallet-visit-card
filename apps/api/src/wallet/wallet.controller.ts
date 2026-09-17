import { Body, Controller, Post } from '@nestjs/common';
import { IsIn, IsString } from 'class-validator';
import { WalletProvider, WalletService } from './wallet.service';

class IssuePassDto {
  @IsString() cardId!: string;
  @IsIn(['apple', 'google', 'samsung']) provider!: WalletProvider;
}

@Controller('wallet-passes')
export class WalletController {
  constructor(private readonly wallet: WalletService) {}
  @Post() issue(@Body() dto: IssuePassDto) { return this.wallet.issue(dto); }
}
