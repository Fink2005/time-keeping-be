// import {
//     CallHandler,
//     ExecutionContext,
//     Injectable,
//     NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// export interface Response<T> {
//   data: T;
// }

// @Injectable()
// export class TransformInterceptor<T>
//   implements NestInterceptor<T, Response<T>>
// {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler
//   ): Observable<Response<T>> {
//     return next.handle().pipe(
//       map((data) => {
//         // console.log(data);
//         const ctx = context.switchToHttp();
//         // console.log({ ctx });
//         const response = ctx.getResponse();
//         // console.log(response, 'Response');
//         const statusCode = response.statusCode;
//         return { data, statusCode }; // Ensure the returned object matches the Response<T> interface
//       })
//     );
//   }
// }
