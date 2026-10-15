import { MercadoPagoConfig, Preference } from 'mercadopago';

// In a real environment, these would be in .env
// For now we assume they might be there or we use placeholders
const accessToken = process.env.MP_ACCESS_TOKEN || "TEST-ACCESS-TOKEN-PLACEHOLDER";

export const client = new MercadoPagoConfig({
    accessToken,
    options: { timeout: 5000 }
});

export const preference = new Preference(client);
