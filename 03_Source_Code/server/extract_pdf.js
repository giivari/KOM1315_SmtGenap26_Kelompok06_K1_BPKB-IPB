const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = 'C:\\Users\\givar\\KULIAH\\KI\\KOM1315_SmtGenap26_Kelompok06_K1_PERANCANGAN-DAN-IMPLEMENTASI-PROTOKOL-KEAMANAN-PADA-SISTEM-BPKB-IPB\\01_Proposal_&_Analisis\\Proposal_Teknis.pdf';

let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('proposal_text.txt', data.text);
    console.log('PDF text extracted to proposal_text.txt');
}).catch(err => {
    console.error('Error reading PDF:', err);
});
