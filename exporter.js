import fs from 'fs';
import path from 'path';
import { stringify } from 'csv-stringify/sync';

const datasetPath = 'storage/datasets/default';
const csvOutputPath = 'Anekafoto_Products_Detailed.csv';
const mdOutputPath = 'Anekafoto_Master_Library.md';

async function exportData() {
    if (!fs.existsSync(datasetPath)) {
        console.error('Dataset directory not found. Please run the crawler first (npm start).');
        return;
    }

    const files = fs.readdirSync(datasetPath).filter(file => file.endsWith('.json'));
    if (files.length === 0) {
        console.error('No JSON files found in dataset. Scraper might not have found any products.');
        return;
    }

    console.log(`📦 Processing ${files.length} products for export...`);

    const products = [];
    let markdownContent = '# Anekafoto Master Library\n\n';
    markdownContent += `Total Products: ${files.length}\n`;
    markdownContent += `Generated At: ${new Date().toLocaleString()}\n\n---\n\n`;

    for (const file of files) {
        const filePath = path.join(datasetPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Persiapkan baris CSV
        products.push({
            Name: data.name,
            Brand: data.brand,
            Price: data.price,
            URL: data.url,
            Specifications: JSON.stringify(data.features),
            Description: data.description ? data.description.substring(0, 2000) : 'N/A', // Naikkan limit deskripsi
            Images: data.images ? data.images.join('; ') : '',
            ScrapedAt: data.scrapedAt
        });

        // Persiapkan Markdown (Secondary)
        markdownContent += `# ${data.name}\n\n`;
        markdownContent += `- **Brand**: ${data.brand}\n`;
        markdownContent += `- **Price**: ${data.price}\n`;
        markdownContent += `- **URL**: ${data.url}\n\n`;
        markdownContent += `## Specifications\n${JSON.stringify(data.features, null, 2)}\n\n`;
        markdownContent += '---\n\n';
    }

    // 1. Ekspor ke CSV
    try {
        const csvContent = stringify(products, {
            header: true,
            columns: ['Name', 'Brand', 'Price', 'Specifications', 'Description', 'URL', 'Images', 'ScrapedAt']
        });
        fs.writeFileSync(csvOutputPath, csvContent);
        console.log(`✅ CSV Detailed Export saved to: ${csvOutputPath}`);
    } catch (err) {
        console.error('❌ Failed to export CSV:', err);
    }

    // 2. Ekspor ke Markdown
    fs.writeFileSync(mdOutputPath, markdownContent);
    console.log(`✅ Markdown Library saved to: ${mdOutputPath}`);
}

exportData();
