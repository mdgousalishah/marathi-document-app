import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import { LetterDocument } from '@/types/document';
import { toDevanagariNumber } from '@/utils/marathiNumbering';
import { officialLetterheads } from '@/utils/officialAssets';

async function fetchImageBuffer(url: string): Promise<ArrayBuffer | null> {
  try {
    const encoded = url.startsWith('/') || url.startsWith('http')
      ? encodeURI(decodeURI(url))
      : url;
    const res = await fetch(encoded);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch (err) {
    console.warn('Could not load image for docx export:', url, err);
    return null;
  }
}

export async function exportToDOCX(doc: LetterDocument): Promise<boolean> {
  try {
    const children: Paragraph[] = [];

    // Header / Letterhead if enabled using the authentic image
    if (doc.useLetterhead && doc.letterhead) {
      const lh = doc.letterhead;
      let lhImageUrl = lh.headerImageUrl;
      let height = 85;

      if (!lhImageUrl) {
        if (lh.id === 'lh_kamel_education_society' || lh.title?.toLowerCase().includes('society')) {
          lhImageUrl = officialLetterheads.society.image;
          height = 84;
        } else if (lh.id === 'lh_kamel_highschool' || lh.title?.toLowerCase().includes('high school') || lh.title?.includes('हायस्कूल')) {
          lhImageUrl = officialLetterheads.school.image;
          height = 71;
        } else if (lh.id === 'lh_ashoorkhana_naale_hyder' || lh.title?.toLowerCase().includes('ashoor') || lh.title?.includes('आशूरखाना')) {
          lhImageUrl = officialLetterheads.ashoorkhana.image;
          height = 105;
        } else {
          lhImageUrl = lh.logoUrl;
          height = 80;
        }
      }

      let imgBuffer: ArrayBuffer | null = null;
      if (lhImageUrl) {
        imgBuffer = await fetchImageBuffer(lhImageUrl);
      }

      if (imgBuffer) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                type: 'png',
                data: imgBuffer,
                transformation: {
                  width: 580,
                  height: height,
                },
              }),
            ],
          })
        );
      } else {
        // Fallback text only if image could not be loaded
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: lh.title, bold: true, size: 28, font: 'Noto Sans Devanagari' }),
            ],
          })
        );
        if (lh.subtitle) {
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: lh.subtitle, size: 20, font: 'Noto Sans Devanagari', italics: true }),
              ],
            })
          );
        }
      }
      children.push(new Paragraph({ text: '' }));
    }

    // Top Note / Reminder Title if present
    if (doc.topNote) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: doc.topNote, bold: true, size: 24, font: 'Noto Sans Devanagari', underline: {} }),
          ],
        })
      );
      children.push(new Paragraph({ text: '' }));
    }

    // Outward No & Date Row
    const dateText = `दिनांक :- ${doc.date || '___/___/२०२६'}`;
    const outwardText = doc.outwardNo ? `जा.क्र. :- ${doc.outwardNo}` : '';
    
    children.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: outwardText ? `${outwardText}                                ` : '', font: 'Noto Sans Devanagari' }),
          new TextRun({ text: dateText, bold: true, font: 'Noto Sans Devanagari' }),
        ],
      })
    );

    children.push(new Paragraph({ text: '' }));

    // Recipient Section (प्रति,)
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'प्रति,', bold: true, size: 24, font: 'Noto Sans Devanagari' })],
      })
    );

    if (doc.recipient.designation) {
      children.push(new Paragraph({ children: [new TextRun({ text: doc.recipient.designation, bold: true, font: 'Noto Sans Devanagari' })] }));
    }
    if (doc.recipient.department) {
      children.push(new Paragraph({ children: [new TextRun({ text: doc.recipient.department, font: 'Noto Sans Devanagari' })] }));
    }
    if (doc.recipient.office) {
      children.push(new Paragraph({ children: [new TextRun({ text: doc.recipient.office, font: 'Noto Sans Devanagari' })] }));
    }
    if (doc.recipient.placeWithPincode) {
      children.push(new Paragraph({ children: [new TextRun({ text: doc.recipient.placeWithPincode, font: 'Noto Sans Devanagari' })] }));
    }

    children.push(new Paragraph({ text: '' }));

    // Subject (विषय :-)
    if (doc.subject) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'विषय :- ', bold: true, size: 24, font: 'Noto Sans Devanagari' }),
            new TextRun({ 
              text: doc.subject, 
              bold: doc.formatting.isBoldSubject, 
              underline: doc.formatting.isUnderlineSubject ? {} : undefined, 
              size: 24, 
              font: 'Noto Sans Devanagari' 
            }),
          ],
        })
      );
    }

    // References (संदर्भ :-) - Strictly Vertical
    if (doc.references && doc.references.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'संदर्भ :-', bold: true, size: 22, font: 'Noto Sans Devanagari' }),
          ],
        })
      );
      doc.references.forEach((ref, idx) => {
        const cleanedText = ref.replace(/^[०-९\d]+[\.\)]\s*/, '').trim();
        const numLabel = doc.formatting.numberingStyle === 'arabic'
          ? `${idx + 1}. `
          : `${toDevanagariNumber(idx + 1)}. `;
        children.push(
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 40, line: 240 },
            children: [
              new TextRun({ text: numLabel, bold: true, size: 22, font: 'Noto Sans Devanagari' }),
              new TextRun({ text: cleanedText || ref, size: 22, font: 'Noto Sans Devanagari' }),
            ],
          })
        );
      });
    }

    children.push(new Paragraph({ text: '' }));

    // Greeting (महोदय,)
    children.push(
      new Paragraph({
        children: [new TextRun({ text: doc.greeting || 'महोदय,', bold: true, size: 24, font: 'Noto Sans Devanagari' })],
      })
    );

    // Body Paragraphs
    if (doc.body) {
      const paragraphs = doc.body.split('\n\n');
      for (const p of paragraphs) {
        if (p.trim()) {
          children.push(
            new Paragraph({
              indent: { firstLine: 720 },
              spacing: { after: 200, line: 360 },
              alignment: AlignmentType.JUSTIFIED,
              children: [new TextRun({ text: p.trim(), size: 24, font: 'Noto Sans Devanagari' })],
            })
          );
        }
      }
    }

    // Numbered Points
    if (doc.numberedPoints && doc.numberedPoints.length > 0) {
      doc.numberedPoints.forEach((pt, idx) => {
        const numStr = doc.formatting.numberingStyle === 'devanagari'
          ? `${toDevanagariNumber(idx + 1)}) `
          : `${idx + 1}) `;
        children.push(
          new Paragraph({
            indent: { left: 540, hanging: 360 },
            spacing: { after: 120 },
            children: [
              new TextRun({ text: numStr, bold: true, size: 24, font: 'Noto Sans Devanagari' }),
              new TextRun({ text: pt.text, size: 24, font: 'Noto Sans Devanagari' }),
            ],
          })
        );
      });
    }

    // Copies To (प्रतिलिपि :-)
    if (doc.copiesTo && doc.copiesTo.length > 0) {
      children.push(new Paragraph({ text: '', spacing: { before: 200 } }));
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'प्रतिलिपि :- यांना माहितीस्तव सविनय सादर.', bold: true, size: 20, font: 'Noto Sans Devanagari' })],
        })
      );
      doc.copiesTo.forEach((c, idx) => {
        children.push(
          new Paragraph({
            indent: { left: 400 },
            children: [new TextRun({ text: `${toDevanagariNumber(idx + 1)}. ${c}`, size: 20, font: 'Noto Sans Devanagari' })],
          })
        );
      });
    }

    // Closing & Sender Info (Right Aligned)
    children.push(new Paragraph({ text: '', spacing: { before: 300 } }));
    children.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: doc.closing || 'आपला विश्वासू,', bold: true, size: 24, font: 'Noto Sans Devanagari' })],
      })
    );

    // Digital Stamp / Signature placed directly below closing
    if (doc.stampUrl) {
      const stampBuffer = await fetchImageBuffer(doc.stampUrl);
      if (stampBuffer) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new ImageRun({
                type: 'png',
                data: stampBuffer,
                transformation: {
                  width: Math.min(doc.stampWidth || 130, 160),
                  height: 65,
                },
              }),
            ],
          })
        );
      } else {
        children.push(new Paragraph({ text: '', spacing: { after: 300 } }));
      }
    } else {
      children.push(new Paragraph({ text: '', spacing: { after: 300 } }));
    }

    if (doc.sender.name) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: doc.sender.name, bold: true, size: 24, font: 'Noto Sans Devanagari' })],
        })
      );
    }
    if (doc.sender.designation) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: doc.sender.designation, size: 22, font: 'Noto Sans Devanagari' })],
        })
      );
    }
    if (doc.sender.institution) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: doc.sender.institution, size: 22, font: 'Noto Sans Devanagari' })],
        })
      );
    }
    if (doc.sender.address) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: doc.sender.address, size: 20, font: 'Noto Sans Devanagari' })],
        })
      );
    }
    if (doc.sender.mobile) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `मो.क्र. ${doc.sender.mobile}`, size: 20, font: 'Noto Sans Devanagari' })],
        })
      );
    }

    // Create Word document object
    const wordDoc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,    // 1 inch = 1440 twips
                bottom: 1440,
                left: 1440,
                right: 1440,
              },
            },
          },
          children: children,
        },
      ],
    });

    const blob = await Packer.toBlob(wordDoc);
    const fileName = `${doc.title.replace(/\s+/g, '_') || 'marathi_letter'}.docx`;
    saveAs(blob, fileName);
    return true;
  } catch (err) {
    console.error('DOCX generation error:', err);
    return false;
  }
}
