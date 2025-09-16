export interface TokenPayload {
  userId: number;
  role: string;
  isVerified: boolean;
  exp: number;
  iat: number;
}
