interface VerificationEmailProps {
  name: string;
  code: string;
}

export function verificationEmail({ name, code }: VerificationEmailProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background: #f5f5f5;
          font-family: Arial, sans-serif;
        "
      >
        <div
          style="
            max-width: 500px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 40px 30px;
          "
        >
          <h1
            style="
              margin: 0 0 20px;
              color: #111111;
              font-size: 28px;
            "
          >
            Verify your email
          </h1>

          <p
            style="
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
            "
          >
            Hi ${escapeHtml(name)},
          </p>

          <p
            style="
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
            "
          >
            Use the verification code below to verify
            your email address.
          </p>

          <div
            style="
              margin: 30px 0;
              padding: 20px;
              background: #f5f5f5;
              border-radius: 12px;
              text-align: center;
            "
          >
            <span
              style="
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 10px;
                color: #111111;
              "
            >
              ${code}
            </span>
          </div>

          <p
            style="
              color: #777777;
              font-size: 14px;
              line-height: 1.6;
            "
          >
            This code will expire in 10 minutes.
          </p>

          <p
            style="
              color: #777777;
              font-size: 14px;
              line-height: 1.6;
            "
          >
            If you did not create an account, you can
            safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
