import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function OPTIONS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];
  const responseHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  return new NextResponse(null, { status: 204, headers: responseHeaders });
}

export async function POST(request) {
  const data = request.body;
  console.log(data);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "drazic.milan@gmail.com",
      pass: "dxko xmrp fqfz tdkd"
    },
  });

  const htmlBody = `
    <html>
      <body>
        <p>Ime: ${data.fullName}</p>
        <p>E-mail: ${data.email}</p>
        <p>Telefon: ${data.phone}</p>
        <p>Poruka: ${data.message}</p>
      </body>
    </html>
  `;

  const userMailOptions = {
    from: "drazic.milan@gmail.com",
    to: data.email,
    subject: 'Hvala vam sto ste nas kontaktirali',
    text: 'Hvala vam. Vaša poruka je primljena i odgovorićemo vam uskoro.',
    html: htmlBody,
  };

  const mailOptions = {
    from: data.email,
    to: 'contact@drazic-webdev.dev',
    subject: `Nova Poruka od ${data.email}`,
    replyTo: data.email,
    html: htmlBody,
  };

  try {
    await transporter.sendMail(userMailOptions);
    console.log('E-mail korisniku poslat');
    return new NextResponse(
      JSON.stringify({ message: 'Message received and emails sent successfully.' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );    
  } catch (error) {
    console.error('Greška prilikom slanja e-maila korisniku:', error);
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail poslat');
    return new NextResponse(
      JSON.stringify({ message: 'Message received and emails sent successfully.' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );    
  } catch (error) {
    console.error(error);
  }
};