import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  LoginPayloadType,
  RegisterPayloadType,
} from 'src/routes/auth/auth.api.model';
import envConfig from '../config';

@Injectable()
export class AuthApisService {
  private readonly key = envConfig.AUTH_SERVICE_KEY;
  private readonly urlBackend = envConfig.AUTH_SERVICE_URL;
  constructor(private readonly httpService: HttpService) {}

  register({ resUrl, body }: { resUrl: string; body: RegisterPayloadType }) {
    const fullUrl = new URL(resUrl, this.urlBackend).toString();

    return lastValueFrom(
      this.httpService.post(
        fullUrl,
        { ...body, key: this.key },
        { headers: { 'Content-Type': 'application/json' } },
      ),
    );
  }

  login({ resUrl, body }: { resUrl: string; body: LoginPayloadType }) {
    const fullUrl = new URL(resUrl, this.urlBackend).toString();
    return lastValueFrom(
      this.httpService.post(
        fullUrl,
        { ...body, key: this.key },
        { headers: { 'Content-Type': 'application/json' } },
      ),
    );
  }
}
