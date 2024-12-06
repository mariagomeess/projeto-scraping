// Imports
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

// Configuração de email
const SMTP_SERVER = 'smtp.gmail.com';
const SMTP_PORT = 587;
const EMAIL = 'testelalalala18@gmail.com';
const PASSWORD = 'upgc vhrh qkig hsmt';  

async function scrapeData() {
    const url = 'https://www.amazon.com.br/dp/B0CQD9W98F?th=1';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('h1.ui-pdp-title').text().trim();
        const price = $('span.andes-money-amount__fraction').eq(1).text().trim();
        const color = $('#picker-label-COLOR').text().trim() || 'Cor não encontrada';

        return { title, price, color };
    } catch (error) {
        console.error('Erro no scraping:', error);
        throw error;
    }
}

async function sendEmail(title, price, color) {
    const transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false, 
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    const mailOptions = {
        from: `"Scraper Bot" <${EMAIL}>`,
        to: 'mariavitoria15100@gmail.com',
        subject: 'Detalhes do Produto',
        text: `
        Detalhes do Produto:
        - Título: ${title}
        - Preço: R$ ${price}
        - Cor: ${color}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro no envio de email:', error);
        throw error;
    }
}

async function main() {
    try {
        const { title, price, color } = await scrapeData();
        await sendEmail(title, price, color);
    } catch (error) {
        console.error('Erro na execução principal:', error);
    }
}

main();
