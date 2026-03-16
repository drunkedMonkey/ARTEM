const pdfParse = require('pdf-parse');
const fs = require('fs');

async function extractText(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text || '';
}

module.exports = { extractText };
