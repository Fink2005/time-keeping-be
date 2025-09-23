import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

export const RegisterBodySchema = UserSchema.pick({
  email: true,
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword'], // or password, là array nên format lại ở app.module
      });
    }
  });

export const RegisterResSchema = z.object({
  message: z.string(),
  email: z.string(),
});

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([
    TypeOfVerificationCode.REGISTER,
    TypeOfVerificationCode.FORGOT_PASSWORD,
    TypeOfVerificationCode.LOGIN,
    TypeOfVerificationCode.DISABLE_2FA,
  ]),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict();

export const LoginBodySchema = UserSchema.pick({
  email: true,
})
  .extend({
    totpCode: z.string().length(6).optional(), //2FA code
    code: z.string().length(6).optional(), // Email OTP code
    password: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ totpCode, code }, ctx) => {
    if (totpCode !== undefined && code !== undefined) {
      //Nếu truyền cùng lúc 2 cái sẽ báo về client
      ctx.addIssue({
        path: ['totpCode'],
        message: 'Have to provide otp or 2FA code',
        code: 'custom',
      });
      ctx.addIssue({
        path: ['code'],
        message: 'Have to provide otp or 2FA code',
        code: 'custom',
      });
    }
  });

export const LoginResSchema = UserSchema.pick({
  refreshToken: true,
}).extend({
  accessToken: z.string(),
});

export const RefreshTokenResSchema = LoginResSchema;
export const RefreshTokenBodySchema = z.object({
  refreshToken: z.string(),
});

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;
export type RegisterResType = z.infer<typeof RegisterResSchema>;
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;
export type LoginBodyType = z.infer<typeof LoginBodySchema>;
export type LoginResType = z.infer<typeof LoginResSchema>;
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;
export type RefreshTokenResType = LoginResType;
