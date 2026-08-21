import { Injectable } from '@nestjs/common';
import { ApiClientService } from '../api/api-client.service';

export interface LoginResponse {
  token: string;
  user_id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly apiClient: ApiClientService) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    return this.apiClient.post<LoginResponse>('/auth/login/', { username, password });
  }
}
