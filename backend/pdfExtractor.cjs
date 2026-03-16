const { PdfReader } = require('pdfreader');
const fs = require('fs');

async function extractTextFromPdf(pdfPath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    
    new PdfReader().parseFileItems(pdfPath, (err, item) => {
      if (err) {
        console.error('PDF parse error:', err);
        reject(err);
        return;
      }
      
      if (!item) {
        // End - convert to text preserving structure
        const text = rows
          .map(row => row.join(' | '))
          .join('\n');
        resolve(text);
        return;
      }
      
      // Group items by Y position to form rows
      if (item.text) {
        const y = Math.round(item.y * 100) / 100; // Round to 2 decimal places
        if (!rows[y]) rows[y] = [];
        rows[y].push({ x: item.x, text: item.text });
      }
    });
  });
}

// Sort each row by X position and extract text
function processRows(rows) {
  const processedRows = [];
  
  for (const y of Object.keys(rows).sort((a, b) => parseFloat(b) - parseFloat(a))) {
    const items = rows[y].sort((a, b) => a.x - b.x);
    const text = items.map(item => item.text).join(' ');
    processedRows.push(text);
  }
  
  return processedRows.join('\n');
}

async function extractTextSmart(pdfPath) {
  return new Promise((resolve, reject) => {
    const rowsByY = {};
    
    new PdfReader().parseFileItems(pdfPath, (err, item) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!item) {
        // End - process rows
        const text = processRows(rowsByY);
        resolve(text);
        return;
      }
      
      if (item.text) {
        const y = Math.round(item.y * 100) / 100;
        if (!rowsByY[y]) rowsByY[y] = [];
        rowsByY[y].push({ x: item.x, text: item.text });
      }
    });
  });
}

module.exports = { extractTextFromPdf: extractTextSmart };
