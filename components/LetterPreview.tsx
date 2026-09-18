'use client';

import React from 'react';
import { LetterDocument, Letterhead, NumberedPoint } from '@/types/document';
import { toDevanagariNumber } from '@/utils/marathiNumbering';
import OfficialLetterhead from './OfficialLetterhead';
import { officialLetterheads } from '@/utils/officialAssets';
import EditableText from './EditableText';

interface LetterPreviewProps {
  document: LetterDocument;
  id?: string;
  className?: string;
  isDirectEditEnabled?: boolean;
  onUpdateDocument?: (doc: LetterDocument) => void;
}

interface PageData {
  pageNumber: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  bodyParagraphs: { text: string; originalIndex: number }[];
  points: { point: NumberedPoint; originalIndex: number }[];
  copiesTo: { text: string; originalIndex: number }[];
  showSignature: boolean;
}

export default function LetterPreview({
  document: doc,
  id = 'letter-a4-document',
  className = '',
  isDirectEditEnabled = false,
  onUpdateDocument,
}: LetterPreviewProps) {
  const fontClass =
    doc.formatting.fontFamily === 'Noto Serif Devanagari'
      ? 'font-devanagari-serif'
      : doc.formatting.fontFamily === 'Mukta'
      ? 'font-mukta'
      : 'font-devanagari-sans';

  const fontStyle = {
    fontSize: `${doc.formatting.fontSize || 14}px`,
    lineHeight: doc.formatting.lineHeight || 1.6,
  };

  // Official Marathi document standard margins:
  // Top: 1.3cm (13mm), Bottom: 1.5cm (15mm), Left: 2.54cm (25.4mm), Right: 1.5cm (15mm)
  const currentMargin = {
    top: '13mm',
    bottom: '15mm',
    left: '25.4mm',
    right: '15mm',
  };

  // Resolve actual official letterhead image asset
  const getLetterheadImage = (lh?: Letterhead): string | undefined => {
    if (!lh) return undefined;
    if (lh.headerImageUrl) return lh.headerImageUrl;
    if (lh.id === 'lh_kamel_education_society' || lh.title?.toLowerCase().includes('society')) {
      return officialLetterheads.society.image;
    }
    if (
      lh.id === 'lh_kamel_highschool' ||
      lh.title?.toLowerCase().includes('high school') ||
      lh.title?.includes('हायस्कूल')
    ) {
      return officialLetterheads.school.image;
    }
    if (
      lh.id === 'lh_ashoorkhana_naale_hyder' ||
      lh.title?.toLowerCase().includes('ashoor') ||
      lh.title?.includes('आशूरखाना')
    ) {
      return officialLetterheads.ashoorkhana.image;
    }
    if (
      lh.logoUrl &&
      (lh.logoUrl.endsWith('.png') ||
        lh.logoUrl.endsWith('.jpg') ||
        lh.logoUrl.endsWith('.jpeg') ||
        lh.logoUrl.startsWith('data:image'))
    ) {
      return lh.logoUrl;
    }
    return undefined;
  };

  const letterheadImage = doc.useLetterhead ? getLetterheadImage(doc.letterhead) : undefined;

  // Helper to update root document fields
  const handleFieldChange = (field: keyof LetterDocument, val: unknown) => {
    if (onUpdateDocument) {
      onUpdateDocument({
        ...doc,
        [field]: val,
      });
    }
  };

  // Helper to update recipient fields
  const handleRecipientChange = (field: keyof typeof doc.recipient, val: string) => {
    if (onUpdateDocument) {
      onUpdateDocument({
        ...doc,
        recipient: {
          ...doc.recipient,
          [field]: val,
        },
      });
    }
  };

  // Helper to update sender fields
  const handleSenderChange = (field: keyof typeof doc.sender, val: string) => {
    if (onUpdateDocument) {
      onUpdateDocument({
        ...doc,
        sender: {
          ...doc.sender,
          [field]: val,
        },
      });
    }
  };

  // Helper to update a reference
  const handleReferenceChange = (index: number, val: string) => {
    if (onUpdateDocument) {
      const updated = [...(doc.references || [])];
      updated[index] = val;
      onUpdateDocument({
        ...doc,
        references: updated,
      });
    }
  };

  // Helper to update paragraph text
  const handleParagraphChange = (index: number, val: string) => {
    if (onUpdateDocument) {
      const paras = doc.body ? doc.body.split(/\n\s*\n/) : [];
      paras[index] = val;
      onUpdateDocument({
        ...doc,
        body: paras.join('\n\n'),
      });
    }
  };

  // Helper to update a numbered point
  const handlePointChange = (index: number, val: string) => {
    if (onUpdateDocument) {
      const updated = [...(doc.numberedPoints || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], text: val };
        onUpdateDocument({
          ...doc,
          numberedPoints: updated,
        });
      }
    }
  };

  // Split paragraphs
  const rawParas = doc.body ? doc.body.split(/\n\s*\n/).filter((p) => p.trim()) : [];
  const paraList = rawParas.length > 0 ? rawParas : [''];

  const allPoints = (doc.numberedPoints || []).map((pt, idx) => ({ point: pt, originalIndex: idx }));
  const allCopies = (doc.copiesTo || []).map((c, idx) => ({ text: c, originalIndex: idx }));

  // ==========================================
  // REAL OVERFLOW-BASED PAGINATION
  // ==========================================
  // Standard A4 printable height (297mm total - 13mm top margin - 15mm bottom margin = 269mm)
  // At standard 96 DPI CSS conversion: 269mm * 3.7795px/mm = 1016.7px
  const effectiveTopMm = doc.pageSettings?.topMargin || (doc.pageSettings?.margin === 'narrow' ? 10 : 13);
  const effectiveBottomMm = doc.pageSettings?.bottomMargin || (doc.pageSettings?.margin === 'narrow' ? 10 : 15);
  const printableHeightMm = 297 - effectiveTopMm - effectiveBottomMm;
  const A4_PRINTABLE_HEIGHT_PX = Math.round(printableHeightMm * 3.7795); // ~1016px - 1046px

  const fontSizeScale = ((doc.formatting?.fontSize || 14) / 14);
  const lineH = Math.round(20 * fontSizeScale * ((doc.formatting?.lineHeight || 1.6) / 1.6));

  // 1. Calculate Header height on Page 1
  let headerHeight = 0;
  if (doc.useLetterhead && letterheadImage) {
    headerHeight += 140; // Official letterhead image banner + outward/date row
  } else if (doc.useLetterhead && doc.letterhead) {
    headerHeight += 125;
  } else {
    headerHeight += 38; // Plain outward number and date row
  }
  if (doc.topNote) headerHeight += 26; // e.g. स्मरणपत्र-३
  
  // Recipient block
  let recipientLineCount = 1; // प्रति,
  if (doc.recipient?.designation) recipientLineCount++;
  if (doc.recipient?.department) recipientLineCount++;
  if (doc.recipient?.office) recipientLineCount++;
  if (doc.recipient?.placeWithPincode) recipientLineCount++;
  headerHeight += recipientLineCount * 20 + 12;

  // Subject block
  if (doc.subject) {
    const subjLines = Math.max(1, Math.ceil((doc.subject.length + 8) / 80));
    headerHeight += subjLines * 21 + 10;
  }

  // References block
  if (doc.references && doc.references.length > 0) {
    headerHeight += doc.references.length * 22 + 8;
  }

  // Greeting ("महोदय,")
  headerHeight += 24;

  // 2. Calculate Paragraphs height
  const paraHeights = paraList.map((text) => {
    const chars = text.length || 1;
    const lines = Math.max(1, Math.ceil(chars / 85));
    return lines * lineH + 10;
  });
  const totalParasHeight = paraHeights.reduce((sum, h) => sum + h, 0);

  // 3. Calculate Numbered Points height
  const pointHeights = allPoints.map(({ point }) => {
    const chars = point.text.length || 1;
    const lines = Math.max(1, Math.ceil(chars / 80));
    return lines * lineH + 6;
  });
  const totalPointsHeight = pointHeights.reduce((sum, h) => sum + h, 0);

  // 4. Calculate Copies (प्रतिलिपि) height
  const copiesHeight = allCopies.length > 0 ? 24 + allCopies.length * 19 + 12 : 0;

  // 5. Calculate Complete Signature Block height (indivisible block)
  let signatureBlockHeight = 22; // closing ("आपला विश्वासू,")
  if (doc.stampUrl) {
    signatureBlockHeight += 68; // digital stamp & sign image
  } else {
    signatureBlockHeight += 20; // whitespace for physical signature
  }
  let senderLineCount = 1; // sender name
  if (doc.sender?.designation) senderLineCount++;
  if (doc.sender?.institution) senderLineCount++;
  if (doc.sender?.address) senderLineCount++;
  if (doc.sender?.mobile) senderLineCount++;
  signatureBlockHeight += senderLineCount * 19 + 16;

  // Total content height required by document
  const totalContentHeight =
    headerHeight +
    totalParasHeight +
    totalPointsHeight +
    copiesHeight +
    signatureBlockHeight;

  // ==========================================
  // PAGE PARTITIONING LOGIC
  // ==========================================
  const pages: PageData[] = [];

  // RULE 1: If all content fits in the A4 printable area, it is STRICTLY 1 PAGE!
  if (totalContentHeight <= A4_PRINTABLE_HEIGHT_PX) {
    pages.push({
      pageNumber: 1,
      isFirstPage: true,
      isLastPage: true,
      bodyParagraphs: paraList.map((text, idx) => ({ text, originalIndex: idx })),
      points: allPoints,
      copiesTo: allCopies,
      showSignature: true,
    });
  } else {
    // RULE 2: Content genuinely exceeds Page 1 printable area -> create Page 2
    // Distribute as much useful content on Page 1 as safely fits
    let currentHeight = headerHeight;
    const page1Paras: { text: string; originalIndex: number }[] = [];
    const page2Paras: { text: string; originalIndex: number }[] = [];

    // Fit paragraphs on Page 1
    for (let i = 0; i < paraList.length; i++) {
      if (currentHeight + paraHeights[i] <= A4_PRINTABLE_HEIGHT_PX - 120) {
        page1Paras.push({ text: paraList[i], originalIndex: i });
        currentHeight += paraHeights[i];
      } else {
        page2Paras.push({ text: paraList[i], originalIndex: i });
      }
    }

    // Fit numbered points on Page 1
    const page1Points: { point: NumberedPoint; originalIndex: number }[] = [];
    const page2Points: { point: NumberedPoint; originalIndex: number }[] = [];

    for (let i = 0; i < allPoints.length; i++) {
      if (page2Paras.length === 0 && currentHeight + pointHeights[i] <= A4_PRINTABLE_HEIGHT_PX - 100) {
        page1Points.push(allPoints[i]);
        currentHeight += pointHeights[i];
      } else {
        page2Points.push(allPoints[i]);
      }
    }

    // Determine copies placement
    let copiesOnPage1 = false;
    if (
      page2Paras.length === 0 &&
      page2Points.length === 0 &&
      allCopies.length > 0 &&
      currentHeight + copiesHeight <= A4_PRINTABLE_HEIGHT_PX - 80
    ) {
      copiesOnPage1 = true;
      currentHeight += copiesHeight;
    }

    // Page 1
    pages.push({
      pageNumber: 1,
      isFirstPage: true,
      isLastPage: false,
      bodyParagraphs: page1Paras.length > 0 ? page1Paras : [{ text: paraList[0] || '', originalIndex: 0 }],
      points: page1Points,
      copiesTo: copiesOnPage1 ? allCopies : [],
      showSignature: false,
    });

    // Page 2
    pages.push({
      pageNumber: 2,
      isFirstPage: false,
      isLastPage: true,
      bodyParagraphs: page2Paras,
      points: page2Points,
      copiesTo: copiesOnPage1 ? [] : allCopies,
      showSignature: true, // Complete signature block intact
    });
  }

  return (
    <div className={`w-full flex flex-col items-center gap-6 overflow-x-auto p-2 sm:p-4 ${className}`}>
      {/* Root ID container that wraps the document pages */}
      <div id={id} className="flex flex-col items-center gap-6">
        {pages.map((page, pIdx) => (
          <React.Fragment key={page.pageNumber}>
            {/* Distinct A4 Page Sheet */}
            <div
              id={`${id}-page-${page.pageNumber}`}
              className="a4-page-sheet a4-page-print bg-white text-slate-900 shadow-md relative select-text shrink-0"
              style={{
                width: '210mm',
                minWidth: '210mm',
                maxWidth: '210mm',
                minHeight: '297mm',
                height: '297mm',
                maxHeight: '297mm',
                boxSizing: 'border-box',
                paddingTop: currentMargin.top,
                paddingBottom: currentMargin.bottom,
                paddingLeft: currentMargin.left,
                paddingRight: currentMargin.right,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                overflow: 'hidden',
                ...fontStyle,
              }}
            >
              {/* PAGE 1 HEADER SECTION */}
              {page.isFirstPage ? (
                <>
                  {/* OFFICIAL LETTERHEAD (Fixed A4 Header using actual supplied image without box/frame/padding) */}
                  {doc.useLetterhead && letterheadImage ? (
                    <OfficialLetterhead
                      image={letterheadImage}
                      outwardNumber={doc.outwardNo}
                      date={doc.date}
                      showEditableFields={true}
                      isDirectEditEnabled={isDirectEditEnabled}
                      onUpdateOutwardNumber={(val) => handleFieldChange('outwardNo', val)}
                      onUpdateDate={(val) => handleFieldChange('date', val)}
                    />
                  ) : doc.useLetterhead && doc.letterhead ? (
                    /* Fallback only if custom text-only letterhead without image */
                    <div className="border-b-2 border-slate-900 pb-2.5 mb-4 text-center">
                      {doc.letterhead.registrationNo && (
                        <p className="text-xs text-slate-600 font-semibold mb-0.5">
                          {doc.letterhead.registrationNo}
                        </p>
                      )}
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                        {doc.letterhead.title}
                      </h1>
                      {doc.letterhead.subtitle && (
                        <p className="text-sm font-medium text-slate-700 italic mt-0.5">
                          {doc.letterhead.subtitle}
                        </p>
                      )}
                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap justify-center gap-x-4 gap-y-0.5">
                        {doc.letterhead.address && <span>{doc.letterhead.address}</span>}
                        {doc.letterhead.contactInfo && <span>{doc.letterhead.contactInfo}</span>}
                      </div>
                      <div className="flex justify-between items-baseline mt-2 pt-1 border-t border-slate-200 text-[14px] sm:text-[15px] font-normal text-slate-800">
                        <div className="flex items-baseline gap-1">
                          <span className="font-semibold text-slate-900">जावक क्र. :</span>
                          <EditableText
                            value={doc.outwardNo || ''}
                            onChange={(val) => handleFieldChange('outwardNo', val)}
                            isDirectEditEnabled={isDirectEditEnabled}
                            placeholder="जा.क्र./२०२५/"
                          />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-semibold text-slate-900">दिनांक :</span>
                          <EditableText
                            value={doc.date || ''}
                            onChange={(val) => handleFieldChange('date', val)}
                            isDirectEditEnabled={isDirectEditEnabled}
                            placeholder="१८.०९.२०२६"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Plain Paper Header: Standard Outward No & Date Row with normal typography */
                    <div className="flex justify-between items-baseline gap-4 mb-3.5 text-[14px] sm:text-[15px] font-normal text-slate-800 border-b border-slate-200/60 pb-1.5">
                      <div className="flex items-baseline gap-1">
                        <span className="font-semibold text-slate-900">जावक क्र. :</span>
                        <EditableText
                          value={doc.outwardNo || ''}
                          onChange={(val) => handleFieldChange('outwardNo', val)}
                          isDirectEditEnabled={isDirectEditEnabled}
                          placeholder="जा.क्र./२०२५/"
                        />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-semibold text-slate-900">दिनांक :</span>
                        <EditableText
                          value={doc.date || ''}
                          onChange={(val) => handleFieldChange('date', val)}
                          isDirectEditEnabled={isDirectEditEnabled}
                          placeholder="१८.०९.२०२६"
                        />
                      </div>
                    </div>
                  )}

                  {/* Top Note / Reminder Header (e.g. स्मरणपत्र-३) */}
                  {doc.topNote && (
                    <div className="text-center font-bold text-base mb-2.5 underline underline-offset-4 decoration-slate-800">
                      <EditableText
                        value={doc.topNote}
                        onChange={(val) => handleFieldChange('topNote', val)}
                        isDirectEditEnabled={isDirectEditEnabled}
                        placeholder="उदा. स्मरणपत्र-३"
                      />
                    </div>
                  )}

                  {/* Recipient Section (प्रति,) */}
                  <div className="mb-3 space-y-0.5 leading-snug">
                    <p className="font-bold text-base text-slate-900">प्रति,</p>
                    <div>
                      <EditableText
                        value={doc.recipient.designation || ''}
                        onChange={(val) => handleRecipientChange('designation', val)}
                        isDirectEditEnabled={isDirectEditEnabled}
                        placeholder="मा. शिक्षणाधिकारी (माध्यमिक)"
                        className="font-semibold text-slate-900"
                        tag="p"
                      />
                    </div>
                    <div>
                      <EditableText
                        value={doc.recipient.department || ''}
                        onChange={(val) => handleRecipientChange('department', val)}
                        isDirectEditEnabled={isDirectEditEnabled}
                        placeholder="शिक्षण विभाग (माध्यमिक)"
                        className="text-slate-800"
                        tag="p"
                      />
                    </div>
                    <div>
                      <EditableText
                        value={doc.recipient.office || ''}
                        onChange={(val) => handleRecipientChange('office', val)}
                        isDirectEditEnabled={isDirectEditEnabled}
                        placeholder="जिल्हा परिषद कार्यालय"
                        className="text-slate-800"
                        tag="p"
                      />
                    </div>
                    <div>
                      <EditableText
                        value={doc.recipient.placeWithPincode || ''}
                        onChange={(val) => handleRecipientChange('placeWithPincode', val)}
                        isDirectEditEnabled={isDirectEditEnabled}
                        placeholder="परभणी, ४३१४०१"
                        className="text-slate-800"
                        tag="p"
                      />
                    </div>
                  </div>

                  {/* Subject (विषय :-) */}
                  {doc.subject && (
                    <div className="mb-2 font-medium flex items-start gap-1">
                      <span className="font-bold shrink-0 text-slate-900">विषय :-</span>
                      <span
                        className={`leading-relaxed flex-1 ${
                          doc.formatting.isBoldSubject ? 'font-bold text-slate-900' : 'text-slate-900'
                        } ${
                          doc.formatting.isUnderlineSubject
                            ? 'underline decoration-slate-700 underline-offset-4'
                            : ''
                        }`}
                      >
                        <EditableText
                          value={doc.subject}
                          onChange={(val) => handleFieldChange('subject', val)}
                          isDirectEditEnabled={isDirectEditEnabled}
                          placeholder="पत्राचा विषय लिहा..."
                          className="w-full inline-block"
                        />
                      </span>
                    </div>
                  )}

                  {/* References (संदर्भ :-) */}
                  {/* Strictly complies with user requirement G: */}
                  {/* First reference begins on SAME LINE as संदर्भ:-, compact 2-4px gap, hanging indent */}
                  {doc.references && doc.references.length > 0 && (
                    <div className="mb-2.5 text-sm font-devanagari-sans">
                      <div className="flex flex-col gap-1">
                        {doc.references.map((ref, idx) => {
                          const cleanedText = ref.replace(/^[०-९\d]+[\.\)]\s*/, '').trim();
                          const numLabel =
                            doc.formatting.numberingStyle === 'arabic'
                              ? `${idx + 1}.`
                              : `${toDevanagariNumber(idx + 1)}.`;

                          return (
                            <div
                              key={idx}
                              className="w-full grid grid-cols-[56px_24px_minmax(0,1fr)] items-start text-slate-800 leading-snug"
                            >
                              {idx === 0 ? (
                                <span className="font-bold text-slate-900 select-none">संदर्भ:-</span>
                              ) : (
                                <span className="select-none" aria-hidden="true" />
                              )}
                              <span className="font-bold text-slate-900 select-none text-left">
                                {numLabel}
                              </span>
                              <div className="break-words">
                                <EditableText
                                  value={cleanedText || ref}
                                  onChange={(val) => handleReferenceChange(idx, val)}
                                  isDirectEditEnabled={isDirectEditEnabled}
                                  placeholder="संदर्भ मजकूर..."
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Formal Greeting (महोदय, / महोदया,) */}
                  <div className="mb-2">
                    <EditableText
                      value={doc.greeting || 'महोदय,'}
                      onChange={(val) => handleFieldChange('greeting', val)}
                      isDirectEditEnabled={isDirectEditEnabled}
                      placeholder="महोदय,"
                      className="font-bold text-base text-slate-900"
                      tag="p"
                    />
                  </div>
                </>
              ) : (
                /* CONTINUATION PAGE HEADER (Discreet reference & Page number) */
                <div className="w-full flex justify-between items-center text-xs text-slate-500 border-b border-slate-200 pb-1.5 mb-3.5 select-none">
                  <span className="font-medium text-slate-600">
                    {doc.outwardNo ? `जावक क्र. ${doc.outwardNo}` : doc.title}
                  </span>
                  <span className="font-semibold text-slate-700">
                    पृष्ठ {toDevanagariNumber(page.pageNumber)}
                  </span>
                </div>
              )}

              {/* BODY PARAGRAPHS ON THIS PAGE */}
              {page.bodyParagraphs.length > 0 && (
                <div className="space-y-2 mb-3 text-slate-900 leading-relaxed text-justify">
                  {page.bodyParagraphs.map((para) => (
                    <p key={para.originalIndex} className="indent-8">
                      <EditableText
                        value={para.text}
                        onChange={(val) => handleParagraphChange(para.originalIndex, val)}
                        isDirectEditEnabled={isDirectEditEnabled}
                        placeholder="येथे मजकूर लिहा..."
                        multiline={true}
                        className="text-slate-900 leading-relaxed text-justify inline-block w-full"
                      />
                    </p>
                  ))}
                </div>
              )}

              {/* NUMBERED POINTS ON THIS PAGE */}
              {page.points.length > 0 && (
                <div className="mb-3 space-y-1.5 pl-2 sm:pl-4">
                  {page.points.map(({ point, originalIndex }) => {
                    const numStr =
                      doc.formatting.numberingStyle === 'devanagari'
                        ? `${toDevanagariNumber(originalIndex + 1)})`
                        : `${originalIndex + 1})`;
                    return (
                      <div key={point.id || originalIndex} className="flex items-start gap-2.5 leading-snug">
                        <span className="font-bold shrink-0 text-slate-900 select-none">{numStr}</span>
                        <span className="leading-relaxed text-justify flex-1">
                          <EditableText
                            value={point.text}
                            onChange={(val) => handlePointChange(originalIndex, val)}
                            isDirectEditEnabled={isDirectEditEnabled}
                            placeholder="मुद्द्याचा मजकूर लिहा..."
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* COPIES TO (प्रतिलिपि :-) */}
              {page.copiesTo.length > 0 && (
                <div className="mt-4 pt-2 pb-2 text-xs sm:text-sm text-slate-800 border-t border-slate-200">
                  <p className="font-bold mb-0.5 text-slate-900">प्रतिलिपि :- यांना माहितीस्तव सविनय सादर.</p>
                  <ol className="list-none space-y-0.5 pl-2">
                    {page.copiesTo.map(({ text, originalIndex }) => (
                      <li key={originalIndex} className="flex items-start gap-1">
                        <span>{toDevanagariNumber(originalIndex + 1)}.</span>
                        <EditableText
                          value={text}
                          onChange={(val) => {
                            if (onUpdateDocument) {
                              const updated = [...doc.copiesTo];
                              updated[originalIndex] = val;
                              onUpdateDocument({ ...doc, copiesTo: updated });
                            }
                          }}
                          isDirectEditEnabled={isDirectEditEnabled}
                          placeholder="प्रत माहिती..."
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* COMPLETE SIGNATURE BLOCK (Kept strictly intact together in normal document flow) */}
              {page.showSignature && (
                <div className="mt-6 pt-2 flex flex-col items-end text-right space-y-0.5 text-sm sm:text-base break-inside-avoid print:break-inside-avoid">
                  <p className="font-bold mb-1 text-slate-900">
                    <EditableText
                      value={doc.closing || 'आपला विश्वासू,'}
                      onChange={(val) => handleFieldChange('closing', val)}
                      isDirectEditEnabled={isDirectEditEnabled}
                      placeholder="आपला विश्वासू,"
                    />
                  </p>

                  {/* Digital Stamp / Signature placed directly below closing */}
                  {doc.stampUrl ? (
                    <div className="my-1 flex justify-end">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.stampUrl}
                        alt={doc.stampName || 'अधिकृत शिक्का / स्वाक्षरी'}
                        style={{ width: `${doc.stampWidth || 120}px` }}
                        className="max-h-20 object-contain drop-shadow-xs block bg-transparent"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ) : (
                    <div className="h-5" aria-hidden="true" />
                  )}

                  <div>
                    <EditableText
                      value={doc.sender.name || ''}
                      onChange={(val) => handleSenderChange('name', val)}
                      isDirectEditEnabled={isDirectEditEnabled}
                      placeholder="पत्र पाठवणाऱ्याचे नाव"
                      className="font-bold text-slate-900"
                      tag="p"
                    />
                  </div>
                  <div>
                    <EditableText
                      value={doc.sender.designation || ''}
                      onChange={(val) => handleSenderChange('designation', val)}
                      isDirectEditEnabled={isDirectEditEnabled}
                      placeholder="पद (उदा. अध्यक्ष / सचिव)"
                      className="font-medium text-slate-800"
                      tag="p"
                    />
                  </div>
                  <div>
                    <EditableText
                      value={doc.sender.institution || ''}
                      onChange={(val) => handleSenderChange('institution', val)}
                      isDirectEditEnabled={isDirectEditEnabled}
                      placeholder="संस्था / कार्यालय"
                      className="text-slate-800"
                      tag="p"
                    />
                  </div>
                  <div>
                    <EditableText
                      value={doc.sender.address || ''}
                      onChange={(val) => handleSenderChange('address', val)}
                      isDirectEditEnabled={isDirectEditEnabled}
                      placeholder="पत्ता"
                      className="text-slate-700 text-xs sm:text-sm"
                      tag="p"
                    />
                  </div>
                  <div>
                    <div className="text-slate-700 text-xs sm:text-sm font-sans flex items-center justify-end gap-1">
                      <span>मो.क्र.</span>
                      <EditableText
                        value={doc.sender.mobile || ''}
                        onChange={(val) => handleSenderChange('mobile', val)}
                        isDirectEditEnabled={isDirectEditEnabled}
                        placeholder="९४२१४८८१११"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Separator between pages in live preview */}
            {pIdx < pages.length - 1 && (
              <div className="w-full flex items-center justify-center gap-3 py-2 select-none no-print">
                <div className="h-px w-20 bg-slate-300" />
                <span className="text-xs text-slate-500 font-medium">
                  पृष्ठ १ समाप्त • पृष्ठ २ सुरू
                </span>
                <div className="h-px w-20 bg-slate-300" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
