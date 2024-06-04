import { env } from "../schemas/env.schema.js";

// subjects
const resetPasswordSubject = "Reset Your Password for Baatchit";
const otpVerificationSubject = "Verify Your Email Address for Baatchit";
const welcomeEmailSubject = "Welcome to Baatchit! Get Started Today 🚀";
const privateKeyRecoverySubject = "Action Required: Verify Your Request to Recover Private Key"


const resetPasswordBody = (username: string, resetUrl: string) => {
  return `
    <html>
    <head>
        <style>
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                font-family: Arial, sans-serif;
                font-size: 16px;
                color: #333;
            }
            .cta-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <p>Hi ${username},</p>
            <p>We received a request to reset your password for your account on Baatchit.</p>
            <p>If you requested this password reset, please click the button below to create a new password:</p>
            <p><a href="${resetUrl}" class="cta-button">Reset Your Password Now</a></p>
            <p>This link will expire in ${env.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES} minutes.</p>
            <p>If you didn't request a password reset, you can safely ignore this email. However, we recommend that you change your password periodically to maintain the security of your account.</p>
            <p>Sincerely,</p>
            <p>The Baatchit Team</p>
        </div>
    </body>
    </html>
    `;
};

const otpVerificationBody = (username: string, otp: string) => {
  return `
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #007bff;
        }
        .content {
            margin-bottom: 20px;
        }
        .content p {
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            color: #888;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <p>Hi ${username},</p>
            <p>Thanks for signing up for Baatchit!</p>
            <p>To complete your registration, please verify your email address by entering the following OTP (one-time password) within ${env.OTP_EXPIRATION_MINUTES} minutes:</p>
            <p><strong>${otp}</strong></p>
            <p>If you didn't request this email, please ignore it.</p>
        </div>
        <div class="footer">
            <p>Thanks,</p>
            <p>The Baatchit Team</p>
        </div>
    </div>
    </body>
    </html>
    `;
};

const privateKeyRecoveryBody = (username:string,verificationUrl:string) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #4CAF50;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Hello ${username}</p>
        <p>
            We have received a request to recover your private key associated with your account on Baatchit. To ensure the security of your account, we require you to verify this request.
        </p>
        <p>
            Please click the button below to verify your request and proceed with the recovery process:
        </p>
        <a href="${verificationUrl}" class="button">Verify Request</a>
        <p>
            If you did not request to recover your private key, please ignore this email. Your account and private key will remain secure.
        </p>
        <p>
            For security reasons, this link will expire in ${env.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES} minutes.
        </p>
        <p>Thank you for your prompt attention to this matter.</p>
        <p>Best regards,</p>
        <p>Baatchit Support Team</p>
        <div class="footer">
            <p>&copy; 2024 Baatchit. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

const welcomeEmailBody = (username: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Baatchit!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #007bff;
        }
        .content {
            margin-bottom: 20px;
        }
        .content p {
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            color: #888;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Baatchit!</h1>
        </div>
        <div class="content">
            <p>Hi ${username},</p>
            <p>Welcome aboard! We're thrilled to have you join us at Baatchit.</p>
            <p>Our platform is designed to help you connect with others, share ideas, and collaborate effortlessly.</p>
            <p>To get started, explore our features, join conversations, and make new connections.</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p>Once again, welcome to Baatchit! We're excited to have you with us.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>The Baatchit Team</p>
        </div>
    </div>
    </body>
    </html>
    `;
};

export {
  resetPasswordSubject,
  otpVerificationSubject,
  welcomeEmailSubject,
  privateKeyRecoverySubject,
  resetPasswordBody,
  otpVerificationBody,
  welcomeEmailBody,
  privateKeyRecoveryBody,
};
