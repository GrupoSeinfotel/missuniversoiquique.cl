import crypto from 'crypto';

const FLOW_API_KEY = process.env.FLOW_API_KEY!;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY!;
// DEFAULT TO PRODUCTION
const FLOW_API_URL = process.env.FLOW_API_URL || 'https://www.flow.cl/api';

if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
    console.warn("Flow API Credientials not found in environment variables");
}

class FlowAPI {
    private apiKey: string;
    private secretKey: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = FLOW_API_KEY;
        this.secretKey = FLOW_SECRET_KEY;
        this.apiUrl = FLOW_API_URL;

        console.log(`[FlowAPI] Initialized with URL: ${this.apiUrl}`);
        console.log(`[FlowAPI] API Key Present: ${!!this.apiKey}`);
    }

    private sign(params: Record<string, any>): string {
        const keys = Object.keys(params).sort();
        let toSign = "";
        keys.forEach(key => {
            if (key !== 's') { // 's' is the signature param itself, skip it if present
                toSign += key + params[key];
            }
        });

        const signature = crypto.createHmac('sha256', this.secretKey)
            .update(toSign)
            .digest('hex');

        return signature;
    }

    private async request(endpoint: string, method: 'GET' | 'POST', params: Record<string, any> = {}) {
        const url = `${this.apiUrl}${endpoint}`;

        // Add apiKey to params
        const requestParams = {
            apiKey: this.apiKey,
            ...params
        };

        // Sign parameters
        const signature = this.sign(requestParams);
        const signedParams = {
            ...requestParams,
            s: signature
        };

        try {
            let response;
            if (method === 'GET') {
                const query = new URLSearchParams(signedParams).toString();
                response = await fetch(`${url}?${query}`, { method: 'GET' });
            } else {
                const formData = new URLSearchParams();
                Object.entries(signedParams).forEach(([key, value]) => {
                    formData.append(key, value === undefined ? "" : String(value));
                });

                response = await fetch(url, {
                    method: 'POST',
                    body: formData, // Flow expects application/x-www-form-urlencoded
                });
            }

            const data = await response.json();

            if (!response.ok) {
                console.error("Flow API Error Response:", data);
                throw new Error(data.message || `Flow API Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error("Flow Request Failed:", error);
            throw error;
        }
    }

    async createOrder(data: {
        commerceOrder: string;
        subject: string;
        amount: number;
        email: string;
        urlConfirmation: string;
        urlReturn: string;
        currency?: string;
    }) {
        const params = {
            commerceOrder: data.commerceOrder,
            subject: data.subject,
            currency: data.currency || 'CLP',
            amount: data.amount,
            email: data.email,
            urlConfirmation: data.urlConfirmation,
            urlReturn: data.urlReturn,
        };

        return this.request('/payment/create', 'POST', params);
    }

    async getStatus(token: string) {
        return this.request('/payment/getStatus', 'GET', { token });
    }
}

export const flow = new FlowAPI();
