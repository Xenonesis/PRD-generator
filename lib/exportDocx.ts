import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { PRDData, prdToMarkdown } from '@/types/prd';

export const exportToDocx = async (data: PRDData, watermark?: string) => {
  const safeName = (data.projectName || 'PRD_Document').replace(/[^a-zA-Z0-9_-]/g, '_');
  const markdownText = prdToMarkdown(data);
  const lines = markdownText.split('\n');
  const docChildren: any[] = [];
  
  if (watermark) {
    docChildren.push(new Paragraph({ 
      text: `WATERMARK: ${watermark}`, 
      heading: HeadingLevel.TITLE 
    }));
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '---') {
      docChildren.push(new Paragraph({ text: "" }));
    } else if (trimmed.startsWith('# ')) {
      docChildren.push(new Paragraph({ text: trimmed.substring(2), heading: HeadingLevel.HEADING_1 }));
    } else if (trimmed.startsWith('## ')) {
      docChildren.push(new Paragraph({ text: trimmed.substring(3), heading: HeadingLevel.HEADING_2 }));
    } else if (trimmed.startsWith('### ')) {
      docChildren.push(new Paragraph({ text: trimmed.substring(4), heading: HeadingLevel.HEADING_3 }));
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      // Basic bullet processing
      const text = trimmed.substring(2);
      const parts = text.split(/(\*\*.*?\*\*)/g);
      const textRuns = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({ text: part.slice(2, -2), bold: true });
        }
        return new TextRun({ text: part });
      });
      docChildren.push(new Paragraph({ children: textRuns, bullet: { level: 0 } }));
    } else if (trimmed !== '') {
      // Paragraph with basic bold processing
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const textRuns = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({ text: part.slice(2, -2), bold: true });
        }
        return new TextRun({ text: part });
      });
      docChildren.push(new Paragraph({ children: textRuns }));
    } else {
      docChildren.push(new Paragraph({ text: "" }));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeName}_PRD.docx`);
};
