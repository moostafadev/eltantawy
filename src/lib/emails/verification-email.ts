interface VerificationEmailProps {
  name: string;
  code: string;
}

export function verificationEmail({ name, code }: VerificationEmailProps) {
  const logoUrl = process.env.EMAIL_LOGO_URL;

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>تأكيد البريد الإلكتروني</title>
      </head>

      <body
        dir="rtl"
        style="
          margin: 0;
          padding: 0;
          background-color: #f6f6f6;
          font-family: Arial, Tahoma, sans-serif;
          color: #222222;
        "
      >
        <div
          style="
            width: 100%;
            padding: 40px 16px;
            box-sizing: border-box;
          "
        >
          <div
            style="
              max-width: 520px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid #eeeeee;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
            "
          >

            <!-- Header -->
            <div
              style="
                padding: 28px 30px;
                text-align: center;
                background-color: #ffffff;
                border-bottom: 1px solid #f0f0f0;
              "
            >
              ${
                logoUrl
                  ? `
                    <img
                      src="${logoUrl}"
                      alt="الطنطاوي"
                      width="150"
                      style="
                        display: block;
                        width: 150px;
                        max-width: 100%;
                        height: auto;
                        margin: 0 auto;
                      "
                    />
                  `
                  : `
                    <div
                      style="
                        color: #8b1e24;
                        font-size: 26px;
                        font-weight: bold;
                      "
                    >
                      الطنطاوي
                    </div>
                  `
              }
            </div>

            <!-- Content -->
            <div
              style="
                padding: 36px 30px;
                text-align: right;
              "
            >
              <h1
                style="
                  margin: 0 0 14px;
                  color: #222222;
                  font-size: 25px;
                  line-height: 1.5;
                  font-weight: 700;
                "
              >
                تأكيد البريد الإلكتروني
              </h1>

              <p
                style="
                  margin: 0 0 18px;
                  color: #444444;
                  font-size: 16px;
                  line-height: 1.9;
                "
              >
                مرحبًا ${escapeHtml(name)}،
              </p>

              <p
                style="
                  margin: 0;
                  color: #666666;
                  font-size: 15px;
                  line-height: 1.9;
                "
              >
                شكرًا لانضمامك إلى الطنطاوي. لإكمال إنشاء حسابك،
                يرجى استخدام رمز التحقق التالي لتأكيد بريدك الإلكتروني:
              </p>

              <!-- Verification Code -->
              <div
                style="
                  margin: 28px 0;
                  padding: 24px 20px;
                  background-color: #fff6f6;
                  border: 1px solid #f1d7d7;
                  border-radius: 14px;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0 0 10px;
                    color: #777777;
                    font-size: 13px;
                  "
                >
                  رمز التحقق
                </p>

                <div
                  dir="ltr"
                  style="
                    color: #8b1e24;
                    font-size: 34px;
                    font-weight: 700;
                    letter-spacing: 8px;
                    line-height: 1.4;
                  "
                >
                  ${escapeHtml(code)}
                </div>
              </div>

              <!-- Expiration -->
              <div
                style="
                  margin: 0 0 20px;
                  padding: 14px 16px;
                  background-color: #fafafa;
                  border-radius: 10px;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #666666;
                    font-size: 13px;
                    line-height: 1.8;
                  "
                >
                  ⏱️ رمز التحقق صالح لمدة
                  <strong style="color: #333333;">
                    10 دقائق
                  </strong>
                  فقط.
                </p>
              </div>

              <p
                style="
                  margin: 0;
                  color: #888888;
                  font-size: 13px;
                  line-height: 1.8;
                "
              >
                إذا لم تقم بإنشاء حساب لدى الطنطاوي، يمكنك تجاهل
                هذه الرسالة بأمان.
              </p>
            </div>

            <!-- Footer -->
            <div
              style="
                padding: 20px 30px;
                background-color: #fafafa;
                border-top: 1px solid #eeeeee;
                text-align: center;
              "
            >
              <p
                style="
                  margin: 0;
                  color: #999999;
                  font-size: 12px;
                  line-height: 1.7;
                "
              >
                هذه رسالة تلقائية، يرجى عدم الرد عليها.
              </p>

              <p
                style="
                  margin: 6px 0 0;
                  color: #8b1e24;
                  font-size: 12px;
                  font-weight: 600;
                "
              >
                الطنطاوي — جودة وطعم أصلي
              </p>
            </div>

          </div>
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
