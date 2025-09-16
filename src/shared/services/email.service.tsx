// // src/email/email.service.ts
// import { Injectable } from '@nestjs/common';
// import CheapDealMail from 'emails/cheap-deal-mail'; // Import the email component
// import ForgotPassword from 'emails/forgot-password';
// import CustomerSupportEmail from 'emails/respond-support';
// import { Resend } from 'resend';
// import envConfig from 'src/shared/config';
// @Injectable()
// export class EmailService {
//   private resend: Resend;

//   constructor() {
//     this.resend = new Resend(envConfig.RESEND_API_KEY); // Đặt trong .env
//   }

//   async sendEmail({
//     email,
//     name,
//     code,
//     type = 'verify',
//     data,
//   }: {
//     email: string;
//     name: string;
//     code?: string;
//     type: 'verify' | 'respond' | 'reset';
//     data?: any;
//   }) {
//     const { resolution, supportContent, issueDescription } = data || {};
//     console.log(supportContent);
//     const result = await this.resend.emails.send({
//       from: 'Cheap Deals <noreply@fink.io.vn>',
//       to: email,
//       subject:
//         type === 'verify'
//           ? 'Verify your Cheap Deals account'
//           : type === 'respond'
//             ? 'Response to your Cheap Deals support request'
//             : 'Reset your Cheap Deals password',
//       react:
//         type === 'verify' ? (
//           <CheapDealMail loginCode={code} />
//         ) : type === 'respond' ? (
//           <CustomerSupportEmail
//             resolution={resolution}
//             supportContent={supportContent}
//             issueDescription={issueDescription}
//           />
//         ) : (
//           <ForgotPassword forgotCode={code} userName={name} />
//         ),
//     });
//     return result;
//   }
// }
