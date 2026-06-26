import PyPDF2
import sys

def extract_text(pdf_path, output_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
    with open(output_path, 'w', encoding='utf-8') as out_file:
        out_file.write(text)
    print("Extraction complete.")

pdf_path = r"C:\Users\givar\KULIAH\KI\KOM1315_SmtGenap26_Kelompok06_K1_PERANCANGAN-DAN-IMPLEMENTASI-PROTOKOL-KEAMANAN-PADA-SISTEM-BPKB-IPB\01_Proposal_&_Analisis\Proposal_Teknis.pdf"
extract_text(pdf_path, "proposal_text.txt")
