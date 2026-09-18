export interface Recipient {
  designation: string;     // e.g. मा. पोलीस निरीक्षक साहेब / मा. शिक्षणाधिकारी
  department: string;      // e.g. नानल पेठ पोलीस स्टेशन / शिक्षण विभाग
  office: string;          // e.g. जिल्हाधिकारी कार्यालय / नगर परिषद
  placeWithPincode: string;// e.g. परभणी, 431 401
}

export interface Sender {
  name: string;         // e.g. मोहम्मद मुश्ताख अहमद
  designation: string;  // e.g. संस्थेचे सचिव / लिपिक / नागरिक
  institution: string;  // e.g. कामेल उर्दू हायस्कूल
  address: string;      // e.g. रा. जवळ पाण्याची टाकी, परभणी
  mobile: string;       // e.g. 9421488111
  email?: string;
}

export interface NumberedPoint {
  id: string;
  text: string;
}

export interface Letterhead {
  id: string;
  title: string;        // e.g. AshoorKhana Naale Hyder
  subtitle?: string;     // e.g. Masjid Mahetab Ali Shah, Graveyard
  registrationNo?: string; // e.g. जा.क्र. / नोंदणी क्र.
  address?: string;     // e.g. Lokmanya Tilak Road, Parbhani
  contactInfo?: string; // e.g. +91 9421488111, anhparbhani123@gmail.com
  logoUrl?: string;     // Data URL or image
  headerImageUrl?: string; // Official full letterhead header image (e.g. "/letterheads/Society later.png")
  defaultOutwardPrefix?: string; // e.g. "KES/2024-25/" or "ANH/PBN/"
}

export interface Formatting {
  fontFamily: 'Noto Sans Devanagari' | 'Noto Serif Devanagari' | 'Mukta';
  fontSize: number;          // e.g. 14 (pt/px)
  lineHeight: number;        // e.g. 1.6
  paragraphSpacing: number;  // e.g. 12 (px)
  numberingStyle: 'devanagari' | 'arabic'; // 'devanagari' (१,२,३) or 'arabic' (1,2,3)
  alignment: 'left' | 'center' | 'right' | 'justify';
  isBoldSubject: boolean;
  isUnderlineSubject: boolean;
}

export interface PageSettings {
  paperSize: 'A4';
  orientation: 'portrait' | 'landscape';
  margin: 'normal' | 'narrow' | 'custom';
  topMargin: number;    // in mm (e.g. 15)
  bottomMargin: number; // in mm (e.g. 15)
  leftMargin: number;   // in mm (e.g. 20)
  rightMargin: number;  // in mm (e.g. 15)
}

export interface LetterDocument {
  id: string;
  title: string;          // Document title in Marathi (e.g. "रजा अर्ज - जून २०२५")
  templateId: string;     // Template ID used
  createdAt: number;      // Timestamp
  updatedAt: number;      // Timestamp
  outwardNo?: string;     // जा.क्र. / क्रमांक
  date: string;           // दिनांक (e.g. 11-06-2025)
  topNote?: string;       // e.g. स्मरणपत्र-३ / अत्यंत महत्त्वाचे
  recipient: Recipient;
  subject: string;        // विषय
  references: string[];   // संदर्भ 1, 2...
  greeting: string;       // महोदय, / महोदया,
  body: string;           // मुख्य मजकूर
  numberedPoints: NumberedPoint[]; // १. २. ३. मुद्दे
  copiesTo: string[];     // प्रतिलिपी :- १... २...
  closing: string;        // आपला विश्वासू, / आपली नम्र,
  sender: Sender;
  useLetterhead: boolean;
  letterhead?: Letterhead;
  stampUrl?: string;       // Digital stamp/signature URL
  stampName?: string;      // Name of the chosen stamp
  stampWidth?: number;     // Width in px
  formatting: Formatting;
  pageSettings: PageSettings;
}

export interface LetterTemplate {
  id: string;
  title: string;          // e.g. सामान्य अधिकृत पत्र
  subtitle: string;       // e.g. शासकीय व निमशासकीय कामकाजासाठी
  description: string;
  iconName: string;
  category: 'official' | 'application' | 'complaint' | 'education' | 'request';
  defaultValues: Partial<LetterDocument>;
}

export type DocumentCategory = 'all' | 'scans' | 'pdf' | 'word' | 'letters' | 'other';
export type DocumentFileType = 'letter' | 'pdf' | 'docx' | 'image' | 'scan';

export interface SavedFileDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  fileType: DocumentFileType;
  date: string;
  updatedAt: number;
  size?: string;
  pageCount?: number;
  thumbnailUrl?: string;
  dataUrl?: string;
  storageUrl?: string;
  userId?: string;
  letterDocId?: string;
  notes?: string;
}

export type AppView = 'home' | 'letters' | 'documents' | 'scanner' | 'profile' | 'settings' | 'templates' | 'editor';
