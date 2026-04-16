import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🤖 Menginisialisasi Layanan WhatsApp ...');

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    }
});

client.on('qr', (qr) => {
    console.log('==================================================');
    console.log('📱 SCAN QR CODE DI BAWAH UNTUK LOGIN KE WHATSAPP:');
    console.log('==================================================\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n✅ Klien WhatsApp Bridge Siap!');
    startListeningToSupabase();
});

client.on('authenticated', () => {
    console.log('🔑 Terautentikasi ke WhatsApp.');
});

client.on('auth_failure', msg => {
    console.error('❌ Gagal Autentikasi:', msg);
});

client.initialize();

function startListeningToSupabase() {
    console.log('📡 Mendengarkan tabel "anekafoto_quotations"...');

    // Menerapkan Polling Method untuk keandalan maksimal terlepas konfigurasi Dashboard Supabase REPLICA IDENTITY
    // Kita akan mencari Quotation baru yang berstatus 'draft', lalu mendistribusikannya dan menandainya 'sent'.
    
    // Interval polling tiap 5 detik
    setInterval(async () => {
        try {
            const { data, error } = await supabase
                .from('anekafoto_quotations')
                .select('*, customer:anekafoto_customers(*)')
                .eq('status', 'draft') 
                .order('created_at', { ascending: true })
                .limit(5);
                
            if (error) {
                console.error('⚠️ Supabase error saat polling:', error.message);
                return;
            }

            if (data && data.length > 0) {
                for (const q of data) {
                    if (!q.customer) {
                        console.log(`⚠️ Quotation ${q.id} tidak memiliki Customer Valid. Skipping...`);
                        continue;
                    }

                    // Pre-emptive marking status 'sent' untuk mencegah balap kondisi (race condition) pengiriman ganda
                    const { error: updErr } = await supabase
                        .from('anekafoto_quotations')
                        .update({ status: 'sent' })
                        .eq('id', q.id)
                        .eq('status', 'draft'); // safety check

                    if (updErr) {
                         console.error('Gagal update status:', updErr);
                         continue;
                    }

                    console.log(`\n🔔 (Polling) Menemukan Quotation Baru: ${q.id}`);
                    await sendWhatsAppMessage(q.id, q.customer);
                }
            }
        } catch (e) {
             console.error('Polling Loop Exception:', e);
        }
    }, 5000);
}

async function sendWhatsAppMessage(quoteId, customer) {
    // Standardisasi Format WA Number dari 08... ke 628...
    let waNumber = (customer.whatsapp || '').replace(/\D/g, ''); 
    if (waNumber.startsWith('0')) waNumber = '62' + waNumber.substring(1);
    
    // whatsapp-web.js requires @c.us suffix
    if (!waNumber.includes('@c.us')) waNumber = `${waNumber}@c.us`;

    const domain = process.env.NEXT_PUBLIC_URL_OVERRIDE || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const quoteUrl = `${domain}/quote/${quoteId}`;
    
    const message = `Halo *${customer.full_name}*,\n\nBerikut adalah *Interactive Smart Quotation* (Penawaran Harga) resmi Anda dari Anekafoto:\n\n🔗 ${quoteUrl}\n\nSilakan klik tautan di atas untuk melihat rincian produk, harga, dan untuk langsung memberikan *Persetujuan (Approve Deal)* atau mengajukan *Negosiasi*.\n\n_Pesan otomatis dari Anekafoto CRM._`;

    try {
        await client.sendMessage(waNumber, message);
        console.log(`✅ OTO-SEND BERHASIL ke ${waNumber}`);
    } catch (e) {
        console.error(`❌ Gagal mengirim ke ${waNumber}:`, e.message);
    }
}
