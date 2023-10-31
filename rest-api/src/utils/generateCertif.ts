// import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { Driver } from '@/interfaces/drivers.interface';
import { Transporter } from '@/interfaces/transporters.interface';
// import PDFDocument from 'pdfkit';

// const genratePdf = (driver: Driver) => {
//   const doc = new PDFDocument({
//     layout: 'landscape',
//     size: 'A4',
//   });

//   // The name
//   const name = driver.name + ' ' + driver.lastName;

//   // Pipe the PDF into an name.pdf file
//   doc.pipe(fs.createWriteStream(`./public/certifs/${driver.name}${driver.lastName}${driver._id}.pdf`));

//   // Draw the certificate image
//   doc.image('./public/images/certificate.png', 0, 0, { width: 842 });

//   // Remember to download the font
//   // Set the font to Dancing Script
//   doc.font('./public/fonts/DancingScript-VariableFont_wght.ttf');

//   // Draw the name
//   doc.fontSize(60).text(name, 20, 265, {
//     align: 'center',
//   });

//   // Draw the date
//   doc.fontSize(17).text(moment().format('MMMM Do YYYY'), -275, 430, {
//     align: 'center',
//   });

//   // Finalize the PDF and end the stream
//   doc.end();
// };

// export { genratePdf };
const PDFDocument = require('pdfkit');
const genratePdf = (driver: Driver, transporter: Transporter) => {
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
  });

  // Helper to move to next line
  function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
      doc.moveDown();
    }
  }
  console.log('-------------->', driver);
  const driverFullName = driver.name + ' ' + driver.lastName;
  const transporterFullName = transporter.name + ' ' + transporter.lastName;
  doc.pipe(fs.createWriteStream(`./public/certifs/${driver.name}${driver.lastName}${driver._id}.pdf`));

  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

  doc.fontSize(10);

  // Margin
  const distanceMargin = 18;

  doc
    .fillAndStroke('#0e8cc3')
    .lineWidth(20)
    .lineJoin('round')
    .rect(distanceMargin, distanceMargin, doc.page.width - distanceMargin * 2, doc.page.height - distanceMargin * 2)
    .stroke();

  // Header
  const maxWidth = 140;
  const maxHeight = 70;

  doc.image('./public/assets/winners.png', doc.page.width / 2 - maxWidth / 2, 60, {
    fit: [maxWidth, maxHeight],
    align: 'center',
  });

  jumpLine(doc, 5);

  doc.font('./public/fonts/NotoSansJP-Light.otf').fontSize(10).fill('#021c27').text('Pro Drive Exam', {
    align: 'center',
  });

  jumpLine(doc, 2);

  // Content
  doc.font('./public/fonts/NotoSansJP-Regular.otf').fontSize(16).fill('#021c27').text('CERTIFICATE OF COMPLETION', {
    align: 'center',
  });

  jumpLine(doc, 1);

  doc.font('./public/fonts/NotoSansJP-Light.otf').fontSize(10).fill('#021c27').text('Present to', {
    align: 'center',
  });

  jumpLine(doc, 2);

  doc.font('./public/fonts/NotoSansJP-Bold.otf').fontSize(24).fill('#021c27').text(driverFullName, {
    align: 'center',
  });

  jumpLine(doc, 1);

  doc.font('./public/fonts/NotoSansJP-Light.otf').fontSize(10).fill('#021c27').text('Successfully completed the Exam.', {
    align: 'center',
  });

  jumpLine(doc, 7);

  doc.lineWidth(1);

  // Signatures
  const lineSize = 174;
  const signatureHeight = 390;

  doc.fillAndStroke('#021c27');
  doc.strokeOpacity(0.2);

  const startLine1 = 128;
  const endLine1 = 128 + lineSize;
  doc.moveTo(startLine1, signatureHeight).lineTo(endLine1, signatureHeight).stroke();

  const startLine2 = endLine1 + 32;
  const endLine2 = startLine2 + lineSize;
  doc.moveTo(startLine2, signatureHeight).lineTo(endLine2, signatureHeight).stroke();

  const startLine3 = endLine2 + 32;
  const endLine3 = startLine3 + lineSize;
  doc.moveTo(startLine3, signatureHeight).lineTo(endLine3, signatureHeight).stroke();

  doc
    .font('./public/fonts/NotoSansJP-Bold.otf')
    .fontSize(10)
    .fill('#021c27')
    .text(transporterFullName, startLine1, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('./public/fonts/NotoSansJP-Light.otf')
    .fontSize(10)
    .fill('#021c27')
    .text('Transporter', startLine1, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('./public/fonts/NotoSansJP-Bold.otf')
    .fontSize(10)
    .fill('#021c27')
    .text(driverFullName, startLine2, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('./public/fonts/NotoSansJP-Light.otf')
    .fontSize(10)
    .fill('#021c27')
    .text('Driver', startLine2, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('./public/fonts/NotoSansJP-Bold.otf')
    .fontSize(10)
    .fill('#021c27')
    .text('Pro Drive', startLine3, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('./public/fonts/NotoSansJP-Light.otf')
    .fontSize(10)
    .fill('#021c27')
    .text('Director', startLine3, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  jumpLine(doc, 4);

  // Validation link
  const certifDate = new Date().toLocaleDateString('fr');

  const certifDateWidth = doc.widthOfString(certifDate);
  const certifDateHeight = doc.currentLineHeight();

  doc
    .font('./public/fonts/NotoSansJP-Light.otf')
    .fontSize(10)
    .fill('#021c27')
    .text(certifDate, doc.page.width / 2 - certifDateWidth / 2, 448, certifDateWidth, certifDateHeight);

  // Footer
  const bottomHeight = doc.page.height - 100;

  doc.image('./public/assets/tempo.png', doc.page.width / 2 - 30, bottomHeight, {
    fit: [60, 60],
  });

  doc.end();
};

export { genratePdf };
