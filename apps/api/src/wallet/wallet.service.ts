import { BadRequestException, Injectable } from '@nestjs/common';

export type WalletProvider = 'apple' | 'google' | 'samsung';
export type IssuePassInput = { cardId: string; provider: WalletProvider; returnUrl?: string };

@Injectable()
export class WalletService {
  async issue(input: IssuePassInput) {
    const configured = {
      apple: Boolean(process.env.APPLE_PASS_TYPE_IDENTIFIER && process.env.APPLE_PASS_CERTIFICATE_BASE64),
      google: Boolean(process.env.GOOGLE_WALLET_ISSUER_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64),
      samsung: Boolean(process.env.SAMSUNG_WALLET_PARTNER_ID && process.env.SAMSUNG_WALLET_PRIVATE_KEY_BASE64),
    }[input.provider];
    if (!configured) throw new BadRequestException(`${input.provider} Wallet no está configurado`);

    // La emisión real vive en workers aislados por proveedor. Nunca se comparte lógica criptográfica.
    return { status: 'queued', provider: input.provider, cardId: input.cardId };
  }
}

