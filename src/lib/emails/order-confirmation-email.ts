interface OrderConfirmationItem {
  title: string;
  qty: number;
  unit: "KG" | "PIECE";
  weightOptionName: string | null;
  isApprox: boolean;
  total: number;
  minTotal: number | null;
  maxTotal: number | null;
}

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: number;
  items: OrderConfirmationItem[];
  subtotal: number;
  productsDiscount: number;
  discountAmount: number;
  couponCode: string | null;
  deliveryFee: number;
  total: number;
  addressLine: string;
  deliveryZoneTitle: string;
  hasAccount: boolean;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("ar-EG")} ج.م`;
}

export function orderConfirmationEmail({
  customerName,
  orderNumber,
  items,
  subtotal,
  productsDiscount,
  discountAmount,
  couponCode,
  deliveryFee,
  total,
  addressLine,
  deliveryZoneTitle,
  hasAccount,
}: OrderConfirmationEmailProps) {
  const logoUrl = process.env.EMAIL_LOGO_URL;

  const itemsHtml = items
    .map((item) => {
      const qtyLabel = item.weightOptionName
        ? item.weightOptionName
        : item.unit === "KG"
          ? "كيلو"
          : "قطعة";

      const totalLabel = item.isApprox
        ? `${formatCurrency(item.minTotal ?? 0)} - ${formatCurrency(item.maxTotal ?? 0)}`
        : formatCurrency(item.total);

      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333333;">
            ${escapeHtml(item.title)}
            <div style="margin-top: 2px; font-size: 12px; color: #999999;">
              ${escapeHtml(String(item.qty))} × ${escapeHtml(qtyLabel)}
            </div>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333333; text-align: left; white-space: nowrap;">
            ${totalLabel}
          </td>
        </tr>
      `;
    })
    .join("");

  const summaryRows = [
    { label: "المجموع الفرعي", value: formatCurrency(subtotal) },
    ...(productsDiscount > 0
      ? [
          {
            label: "خصومات المنتجات",
            value: `-${formatCurrency(productsDiscount)}`,
          },
        ]
      : []),
    ...(discountAmount > 0
      ? [
          {
            label: couponCode ? `كوبون الخصم (${couponCode})` : "الخصم",
            value: `-${formatCurrency(discountAmount)}`,
          },
        ]
      : []),
    { label: "رسوم التوصيل", value: formatCurrency(deliveryFee) },
  ];

  const summaryHtml = summaryRows
    .map(
      (row) => `
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #666666;">${escapeHtml(row.label)}</td>
          <td style="padding: 6px 0; font-size: 13px; color: #333333; text-align: left;">${row.value}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>تأكيد الطلب</title>
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
              max-width: 560px;
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
                تم استلام طلبك بنجاح
              </h1>

              <p style="margin: 0 0 18px; color: #444444; font-size: 15px; line-height: 1.9;">
                مرحبًا ${escapeHtml(customerName)}،
              </p>

              <p style="margin: 0 0 24px; color: #666666; font-size: 14px; line-height: 1.9;">
                شكرًا لطلبك من الطنطاوي. هذه تفاصيل طلبك، وسيتم التواصل معك قريبًا لتأكيده.
              </p>

              <!-- Order Number -->
              <div
                style="
                  margin: 0 0 24px;
                  padding: 16px 20px;
                  background-color: #fff6f6;
                  border: 1px solid #f1d7d7;
                  border-radius: 12px;
                  text-align: center;
                "
              >
                <p style="margin: 0 0 6px; color: #777777; font-size: 12px;">رقم الطلب</p>
                <div dir="ltr" style="color: #8b1e24; font-size: 26px; font-weight: 700;">
                  #${orderNumber}
                </div>
              </div>

              <!-- Items -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                ${itemsHtml}
              </table>

              <!-- Summary -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border-top: 2px solid #f0f0f0; padding-top: 10px;">
                ${summaryHtml}
                <tr>
                  <td style="padding: 12px 0 0; font-size: 16px; font-weight: 700; color: #222222; border-top: 1px solid #f0f0f0;">الإجمالي</td>
                  <td style="padding: 12px 0 0; font-size: 18px; font-weight: 700; color: #8b1e24; text-align: left; border-top: 1px solid #f0f0f0;">${formatCurrency(total)}</td>
                </tr>
              </table>

              <!-- Delivery Info -->
              <div style="margin: 0 0 20px; padding: 14px 16px; background-color: #fafafa; border-radius: 10px;">
                <p style="margin: 0 0 4px; color: #999999; font-size: 12px;">عنوان التوصيل</p>
                <p style="margin: 0 0 10px; color: #333333; font-size: 14px; line-height: 1.7;">
                  ${escapeHtml(addressLine)} — ${escapeHtml(deliveryZoneTitle)}
                </p>
              </div>

              ${
                !hasAccount
                  ? `
                    <div style="margin: 0 0 20px; padding: 14px 16px; background-color: #f3f8ff; border-radius: 10px;">
                      <p style="margin: 0; color: #444444; font-size: 13px; line-height: 1.8;">
                        💡 لو كان لديك حساب مسجل بنفس بريدك الإلكتروني، يمكنك متابعة حالة طلبك أولًا بأول من صفحة
                        <strong style="color: #8b1e24;">حسابي</strong>.
                      </p>
                    </div>
                  `
                  : `
                    <p style="margin: 0 0 20px; color: #666666; font-size: 13px; line-height: 1.8;">
                      يمكنك متابعة حالة طلبك أولًا بأول من صفحة حسابك.
                    </p>
                  `
              }
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
