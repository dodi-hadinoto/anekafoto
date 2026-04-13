import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let client: Client | null = null;

export function getWhatsAppClient() {
  if (client) return client;

  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  client.on('qr', (qr) => {
    // In a real environment, we'd emit this to the dashboard
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
  });

  client.on('authenticated', () => {
    console.log('WhatsApp Client is authenticated!');
  });

  client.initialize().catch(err => {
    console.error('Failed to initialize WhatsApp client:', err);
  });

  return client;
}

export async function sendQuotationLink(phone: string, quotationId: string) {
  const whatsapp = getWhatsAppClient();
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quotationId}`;
  const message = `Halo! Berikut adalah penawaran resmi dari Anekafoto. Silakan buka tautan berikut untuk melihat rincian dan memberikan persetujuan:\n\n${link}\n\nTerima kasih!`;

  try {
    // Note: phone must be in format '628123456789@c.us'
    const formattedPhone = phone.includes('@c.us') ? phone : `${phone.replace(/\D/g, '')}@c.us`;
    await whatsapp.sendMessage(formattedPhone, message);
    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error };
  }
}
