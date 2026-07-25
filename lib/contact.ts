/**
 * Support contact channels.
 *
 * WHATSAPP_LINK is null unless NEXT_PUBLIC_WHATSAPP_NUMBER holds a real number
 * in international format (digits only, no leading '+' — e.g. 61412345678).
 * Every consumer must hide its support UI when the link is null: shipping a
 * placeholder number sends real customers to a dead conversation.
 */
const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');

export const WHATSAPP_NUMBER: string | null = digits.length >= 8 ? digits : null;

export const WHATSAPP_LINK: string | null = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}`
  : null;
