/**
 * يحوّل رقم هاتف مصري - بأي صيغة شائعة (01xxxxxxxxx، +201xxxxxxxxx،
 * 00201xxxxxxxxx، أو حتى بمسافات وشرطات) - إلى رابط واتساب صالح
 * بصيغة دولية موحّدة (201xxxxxxxxx).
 */
export const getWhatsAppLink = (phone: string, message?: string) => {
  let digitsOnly = phone.replace(/\D/g, "");

  /*
   * إزالة بادئة الاتصال الدولي "00" لو موجودة
   * مثال: 00201012345678 -> 201012345678
   */
  if (digitsOnly.startsWith("00")) {
    digitsOnly = digitsOnly.slice(2);
  }

  /*
   * الرقم بالفعل بصيغة دولية مصرية (يبدأ بـ 20 ويتبعه 10 أرقام تبدأ
   * بـ 1، زي: 201012345678 -> إجمالي 12 رقم)
   */
  const alreadyInternational =
    digitsOnly.startsWith("20") && digitsOnly.length === 12;

  const internationalNumber = alreadyInternational
    ? digitsOnly
    : `20${digitsOnly.startsWith("0") ? digitsOnly.slice(1) : digitsOnly}`;

  const query = message ? `?text=${encodeURIComponent(message)}` : "";

  return `https://wa.me/${internationalNumber}${query}`;
};
