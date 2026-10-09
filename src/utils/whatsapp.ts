/**
 * Converts an Egyptian phone number in a common format (01xxxxxxxxx,
 * +201xxxxxxxxx, 00201xxxxxxxxx, or a value with spaces and hyphens) into
 * a WhatsApp URL with a normalized international number (201xxxxxxxxx).
 */
export const getWhatsAppLink = (phone: string, message?: string) => {
  let digitsOnly = phone.replace(/\D/g, "");

  /*
   * Remove the international dialing prefix "00" when it is present.
   * Example: 00201012345678 -> 201012345678
   */
  if (digitsOnly.startsWith("00")) {
    digitsOnly = digitsOnly.slice(2);
  }

  /*
   * The number is already in Egyptian international format: it starts with
   * 20 and is followed by 10 digits beginning with 1 (for example,
   * 201012345678, which has 12 digits).
   */
  const alreadyInternational =
    digitsOnly.startsWith("20") && digitsOnly.length === 12;

  const internationalNumber = alreadyInternational
    ? digitsOnly
    : `20${digitsOnly.startsWith("0") ? digitsOnly.slice(1) : digitsOnly}`;

  const query = message ? `?text=${encodeURIComponent(message)}` : "";

  return `https://wa.me/${internationalNumber}${query}`;
};
