interface OrderStatusEmailProps {
  customerName: string;
  orderNumber: number;
  statusLabel: string;
  total: number;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function orderStatusEmail({
  customerName,
  orderNumber,
  statusLabel,
  total,
}: OrderStatusEmailProps) {
  const logoUrl = process.env.EMAIL_LOGO_URL;

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>تحديث حالة الطلب</title>
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
        <div style="width: 100%; padding: 40px 16px; box-sizing: border-box;">
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
                  ? `<img src="${logoUrl}" alt="الطنطاوي" width="150" style="display: block; width: 150px; max-width: 100%; height: auto; margin: 0 auto;" />`
                  : `<div style="color: #8b1e24; font-size: 26px; font-weight: bold;">الطنطاوي</div>`
              }
            </div>

            <!-- Content -->
            <div style="padding: 36px 30px; text-align: right;">
              <h1 style="margin: 0 0 14px; color: #222222; font-size: 24px; line-height: 1.5; font-weight: 700;">
                تم توصيل طلبك بنجاح
              </h1>

              <p style="margin: 0 0 18px; color: #444444; font-size: 15px; line-height: 1.9;">
                مرحبًا ${escapeHtml(customerName)}،
              </p>

              <p style="margin: 0 0 24px; color: #666666; font-size: 14px; line-height: 1.9;">
                يسعدنا إبلاغك بأن طلبك <strong style="color: #8b1e24;">#${orderNumber}</strong> قد تم توصيله بنجاح.
                نتمنى أن ينال إعجابك، ونتشرف بخدمتك دائمًا.
              </p>

              <!-- Status -->
              <div
                style="
                  margin: 0 0 24px;
                  padding: 20px;
                  background-color: #f2f9f4;
                  border: 1px solid #d7f1de;
                  border-radius: 12px;
                  text-align: center;
                "
              >
                <p style="margin: 0 0 6px; color: #16a34a; font-size: 18px; font-weight: 700;">
                  ${escapeHtml(statusLabel)}
                </p>
                <p style="margin: 0; color: #666666; font-size: 13px;">
                  إجمالي الطلب: ${total.toLocaleString("ar-EG")} ج.م
                </p>
              </div>

              <p style="margin: 0; color: #888888; font-size: 13px; line-height: 1.8;">
                لو عندك أي استفسار بخصوص طلبك، يمكنك التواصل معنا في أي وقت.
              </p>
            </div>

            <!-- Footer -->
            <div style="padding: 20px 30px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.7;">
                هذه رسالة تلقائية، يرجى عدم الرد عليها.
              </p>

              <p style="margin: 6px 0 0; color: #8b1e24; font-size: 12px; font-weight: 600;">
                الطنطاوي — جودة وطعم أصلي
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
