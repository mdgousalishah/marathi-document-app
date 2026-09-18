import { LetterDocument } from '@/types/document';
import { defaultFormatting, defaultPageSettings } from './letterTemplates';

export const sampleDocuments: LetterDocument[] = [
  {
    id: 'sample_reminder_police',
    title: 'पोलीस तपासाबाबत स्मरणपत्र-३',
    templateId: 'reminder_letter',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,     // 2 hours ago
    outwardNo: 'जा.क्र./तक्रार/२०२५/',
    date: '०९.०६.२०२५',
    topNote: 'स्मरणपत्र-३',
    recipient: {
      designation: 'मा. श्री शहाजी उमाप साहेब (आय.पी.एस.),',
      department: 'विशेष पोलीस महानिरीक्षक,',
      office: 'नांदेड परिक्षेत्र कार्यालय,',
      placeWithPincode: 'नांदेड - ४३१६०३.',
    },
    subject: 'पोलीस स्टेशन कोतवाली जिल्हा परभणी येथील तात्कालीन पोलीस निरीक्षक व सध्याचे पोलीस निरीक्षक यांनी गुन्ह्याचे तपासात केलेल्या हलगर्जीमुळे त्यांचे वर कारवाई करणे बाबत...',
    references: [
      '१. माझे पत्र दि. २१.११.२०२२',
      '२. माझे पत्र दि. २७.०३.२०२५'
    ],
    greeting: 'महोदय,',
    body: 'मी फिर्यादी मो. मुश्ताक अहमेद, कामेल उर्दू हायस्कूल परभणी या शाळेतील लिपिक व संस्थेचा सचिव म्हणून काम करतो. माझे फिर्यादीवरून पोलीस स्टेशन कोतवाली येथे गुन्हा र.क्र.१८६/२०२२ कलम ४०८, ४०९, ४१९, ४२०, ४६८, ४७१, ४९९, ५०१ व ३४ भा.दं.वि. प्रमाणे आरोपींविरुद्ध दाखल झालेला आहे.\n\nसदर गुन्ह्याचे तपासाकरिता प्राथमिक चौकशी सुरु असताना तपास अधिकाऱ्यांनी कोणताही योग्य तपास केला नाही किंवा माहिती देण्यास टाळाटाळ केली. वरिष्ठ पोलीस अधिकाऱ्यांनी या प्रकरणी सविस्तर तपास करून मला न्याय द्यावा ही अपेक्षा आहे.',
    numberedPoints: [
      { id: '1', text: 'आरोपी यांनी शाळेतील नियमित मुख्याध्यापिकेचे वेतनावर स्वाक्षरी करण्याचे अधिकार काढून इतरांना दिले ते योग्य आहे का?' },
      { id: '2', text: 'शाळेतील कर्मचारी खरोखरच शाळेतून अधिकृतपणे गैरहजर आहेत का?' }
    ],
    copiesTo: [
      'मा. पोलीस अधीक्षक परभणी यांना माहितीस्तव सविनय सादर'
    ],
    closing: 'आपला विश्वासू,',
    sender: {
      name: 'मोहम्मद मुश्ताख अहमद',
      designation: 'संस्थेचे सचिव / लिपिक',
      institution: 'कामेल उर्दू हायस्कूल',
      address: 'रा. जवळ पाण्याची टाकी, युसुफ कॉलनी, परभणी.',
      mobile: '९४२१४८८१११',
    },
    useLetterhead: false,
    formatting: defaultFormatting,
    pageSettings: defaultPageSettings,
  },
  {
    id: 'sample_waqf_permission',
    title: 'स्वाती/मिरवणूक परवानगी अर्ज',
    templateId: 'permission_request',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
    outwardNo: 'जा.क्र./स्वारी.बस.अनु/२०२५-२६/',
    date: '११-०६-२०२५',
    topNote: '',
    recipient: {
      designation: 'मा. पोलीस निरीक्षक साहेब,',
      department: 'नानल पेठ पोलीस स्टेशन,',
      office: 'शनिवार बाजार,',
      placeWithPincode: 'परभणी - ४३१४०१.',
    },
    subject: 'आशूरखाना नाले हैदर मस्जिद महेताब अली शाह परभणी येथे मागील सन १८९१ पासून स्वारी बसविण्यात येत आहे या वर्षी (१ मोहर्रम) दि.२७.०६.२०२५ ते दि.०६.०७.२०२५ पर्यंत स्वारी बसविण्याची अनुमती मिळणे बाबत...',
    references: [],
    greeting: 'महोदय,',
    body: 'वरील विषयानुसार आपणास विनंती करण्यात येते की, आशूरखाना नाले हैदर मस्जिद महेताब अली शाह या नोंदणीकृत वक्फ संस्थेचा मी मुश्ताक आली शाह वंशपरंपरागत नुसार सज्जादा नशीन व मुतावल्ली असून सदर वक्फ संस्थे अंतर्गत मागील सन १८९१ पासून स्वारी बसविण्यात येत आहे.\n\nयावर्षी दि.२७.०६.२०२५ ते ०६.०७.२०२५ रोजी सकाळी १० वाजेपर्यंत भक्तांना स्वारीचे दर्शन मिळवण्यासाठी स्वारी बसविण्याची अनुमती देण्यात यावी.\n\nतरी आपणास विनंती करण्यात येते की, दरवर्षी प्रमाणे यावर्षी उक्त नमूद तारखेला अनुमती देऊन सहकार्य करावे ही नम्र विनंती.',
    numberedPoints: [],
    copiesTo: [
      '१. मा. मुख्य कार्यकारी अधिकारी, महाराष्ट्र राज्य वक्फ मंडळ, छ.संभाजीनगर.',
      '२. मा. जिल्हाधिकारी परभणी.',
      '३. मा. पोलीस अधीक्षक, परभणी.',
      '४. मा. उपजिल्हाधिकारी परभणी.'
    ],
    closing: 'आपला विश्वासू,',
    sender: {
      name: 'मुश्ताक आली शाह',
      designation: 'सज्जादा नशीन व मुतावल्ली',
      institution: 'आशूरखाना नाले हैदर वक्फ संस्था',
      address: 'लोकमान्य टिळक रोड, परभणी.',
      mobile: '९४२१४८८१११',
    },
    useLetterhead: true,
    letterhead: {
      id: 'lh_ashoorkhana',
      title: 'AshoorKhana Naale Hyder, Masjid Mahetab Ali Shah',
      subtitle: 'Graveyard & Naqqar Khana Baradari',
      registrationNo: 'Sajjada Nashine & Mutawalli - Mushtaque Ali Shah',
      address: 'Office: Lokmanya Tilak Road, Parbhani.',
      contactInfo: 'Contact: +91 9421488111, anhparbhani123@gmail.com',
    },
    formatting: defaultFormatting,
    pageSettings: defaultPageSettings,
  },
  {
    id: 'sample_leave_application',
    title: 'शालेय नैमित्तिक रजा अर्ज',
    templateId: 'leave_application',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    outwardNo: '',
    date: '१५.०६.२०२५',
    topNote: '',
    recipient: {
      designation: 'मा. मुख्याध्यापक साहेब,',
      department: 'कामेल उर्दू हायस्कूल,',
      office: 'प्रशासकीय विभाग,',
      placeWithPincode: 'परभणी - ४३१४०१.',
    },
    subject: 'वैयक्तिक कारणास्तव २ दिवसांची नैमित्तिक रजा मिळणे बाबत...',
    references: [],
    greeting: 'महोदय,',
    body: 'मी खालील स्वाक्षरी करणारा अर्जदार आपणास विनंती करतो की, मला घरगुती तातडीच्या कामासाठी पुढील दोन दिवस शाळेत उपस्थित राहणे शक्य नाही.\n\nतरी मला दिनांक १६ जून व १७ जून रोजी दोन दिवसांची नैमित्तिक रजा मंजूर करण्यात यावी. माझ्या अनुपस्थितीत वर्गाचे तासिकेचे नियोजन सहकाऱ्यांकडे सोपवले आहे.',
    numberedPoints: [],
    copiesTo: [],
    closing: 'आपला नम्र सेवक,',
    sender: {
      name: 'शेख अब्दुल रहमान',
      designation: 'सहाय्यक शिक्षक',
      institution: 'कामेल उर्दू हायस्कूल',
      address: 'परभणी.',
      mobile: '९८७६५४३२१०',
    },
    useLetterhead: false,
    formatting: defaultFormatting,
    pageSettings: defaultPageSettings,
  }
];
