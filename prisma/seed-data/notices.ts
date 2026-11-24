import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedNotices() {
  console.log('Seeding 6 Government Notices...');

  const notices = [
    {
      title: 'Stop-Work & Financial Discrepancy Mandate: Sipajhar Multi-Village WSS',
      issuingAuthority: 'Planning & Transformation Dept, Dispur',
      publishedAt: new Date('2026-03-24T06:00:00Z'),
      effectiveAt: new Date('2026-03-24T06:00:00Z'),
      status: 'ENFORCED',
      originalText: `ORDER UNDER SECTION 14(2) OF THE ASSAM DECENTRALIZED PLANNING & STATUTORY ACCOUNTABILITY DIRECTIVE, 2024.
WHEREAS, an on-site physical audit was conducted on 18th March 2026 at Sipajhar Multi-Village Piped Drinking Water Supply Scheme (Project ID: AS-DAR-0821); and
WHEREAS, the public expenditure ledger verifies that an aggregate sum of ₹8,80,00,000/- (80.00% of sanctioned outlay) has been debited to the contractor, M/s Brahmaputra Infra-Engg Ltd; and
WHEREAS, the on-ground audit report and high-resolution geotagged drone imagery establish verified physical execution at merely 35.20%, revealing an unexplained fiscal-physical variance of 44.80%;
NOW THEREFORE, all further fiscal disbursements are hereby FROZEN. The contractor and executing division are ordered to cease bill claims immediately pending CAG Special Inquest Form 19-B submission.`,
      plainSummary: 'Government paid ₹8.80 Cr (80%) to contractor but only 35% of water pipeline was built. Main intake well excavation abandoned since January 2026. All further payments frozen. Citizens can demand emergency water bowsers within 48 hours under RTPS Act 2012.',
      actionChecklistJson: JSON.stringify([
        'File RTPS Form-4 inquiry at Sipajhar Co-District office',
        'Demand emergency drinking water bowsers (48-hour SLA)',
        'Track fund freeze status on Poorvottar Drishti portal',
        'Submit grievance if water supply not restored',
      ]),
      sourceUrl: 'https://gazette.assam.gov.in/Gazette/2026/089',
      lastReviewedAt: new Date('2026-03-24'),
      translationsJson: JSON.stringify({
        en: 'Government paid ₹8.80 Cr (80%) to contractor but only 35% of water pipeline was built. Main intake well excavation abandoned since January 2026. All further payments frozen. Citizens can demand emergency water bowsers within 48 hours under RTPS Act 2012.',
        as: 'চিপাঝাৰ খোৱাপানী যোগান আঁচনিৰ বাবে চৰকাৰে ৮.৮০ কোটি টকা (৮০%) আদায় দিছে যদিও মাত্ৰ ৩৫% কামহে সম্পূৰ্ণ হৈছে। মুখ্য পানী তোলা কুঁৱাৰ খনন কাৰ্য এৰি থৈ যোৱা দেখা গৈছে। অসম লোকসেৱা প্ৰদান আইন ২০১২ (RTPS) ৰ অধীনত চিপাঝাৰ পঞ্চায়তবাসীয়ে ৪৮ ঘণ্টাৰ ভিতৰত জৰুৰীকালীন পানী টেংকাৰ যোগান দাবী কৰিব পাৰে।',
        hi: 'सिपाझार पेयजल योजना के लिए ठेकेदार को ₹8.80 करोड़ (80%) का भुगतान किया गया, लेकिन केवल 35% कार्य ही पूरा हुआ। मुख्य इंटेक वेल का उत्खनन जनवरी 2026 से बंद है। सभी भुगतान रोक दिए गए हैं। असम लोक सेवा अधिकार अधिनियम 2012 के तहत ग्रामीण 48 घंटे के भीतर आपातकालीन पानी के टैंकर की मांग कर सकते हैं।',
        bn: 'সিপাহীঝাড় পানীয় জল প্রকল্পের জন্য ঠিকাদারকে ৮.৮০ কোটি টাকা (৮০%) দেওয়া হলেও মাত্র ৩৫% কাজ শেষ হয়েছে। মুখ্য ইনটেক কুয়া খনন জানুয়ারি ২০২৬ থেকে বন্ধ। সমস্ত پرداخت বন্ধ। আসাম লোকসেবা অধিকার আইন ২০১২-এর অধীনে নাগরিকরা ৪৮ ঘণ্টার মধ্যে জরুরি পানীয় জলের ট্যাঙ্কার দাবি করতে পারেন।',
      }),
      imagePath: '/images/011_Manmohan_Singh_addressing_at_the_presentation_of_the_Fakhruddin_Ali_Ah.jpg',
    },
    {
      title: 'Release of Q4 Tranche for Kokrajhar Rural Road Connectivity Network under SOPD-G',
      issuingAuthority: 'Finance (Special Schemes) Dept, Dispur',
      publishedAt: new Date('2026-03-22T08:30:00Z'),
      effectiveAt: new Date('2026-03-22T08:30:00Z'),
      status: 'DISPATCHED',
      originalText: 'Administrative approval and financial sanction for release of ₹14.50 Crore direct to Bodoland Territorial Council (BTC) treasury for 22 village road stretches under SOPD-G Sixth Schedule package. Funds to be utilized for construction of all-weather rural roads connecting 45 habitations in Dotma and Gossaigaon blocks.',
      plainSummary: '₹14.50 Crore released directly to BTC treasury for 22 rural roads in Kokrajhar under SOPD-G Sixth Schedule package. Will connect 45 habitations in Dotma and Gossaigaon blocks.',
      actionChecklistJson: JSON.stringify([
        'Monitor road construction progress via Poorvottar Drishti portal',
        'Verify fund utilization against physical milestones',
        'Report quality issues through grievance portal',
      ]),
      sourceUrl: 'https://finance.assam.gov.in/orders/2026/104',
      lastReviewedAt: new Date('2026-03-22'),
      translationsJson: JSON.stringify({
        en: '₹14.50 Crore released directly to BTC treasury for 22 rural roads in Kokrajhar under SOPD-G Sixth Schedule package. Will connect 45 habitations in Dotma and Gossaigaon blocks.',
        as: 'বিটিচিৰ কোকৰাঝাৰ গ্ৰাম্য পথ সংযোগৰ চতুৰ্থ কিস্তিৰ বাবে ১৪.৫০ কোটি টকা মুকলি কৰা হৈছে। ডটমা আৰু গোসাইগাঁও ব্লকত ৪৫টি বসতি সংযোগ কৰিব।',
        hi: 'एसओपीडी-जी के तहत कोकराझार ग्रामीण सड़क नेटवर्क के लिए ₹14.50 करोड़ की चौथी किस्त सीधे बीटीसी खजाने को जारी की गई। डोत्मा और गोसाईगांव ब्लॉक में 45 बस्तियाँ जुड़ेंगी।',
        bn: 'এসওপিডি-জি এর অধীনে কোকরাঝাড় গ্রামীণ সড়ক নেটওয়ার্কের জন্য ১৪.৫০ কোটি টাকার চতুর্থ কিস্তি সরাসরি বিটিসি খাজানায় বরাদ্দ। ডোতমা এবং গোসাইগাঁও ব্লকে ৪৫টি বসতি সংযুক্ত হবে।',
      }),
      imagePath: '/images/012_Manmohan_Singh_addressing_at_the_presentation_of_the_Fakhruddin_Ali_Ah.jpg',
    },
    {
      title: 'Show-Cause Notice to M/s Eastern Embankments for 32-day unapproved delay in river embankment',
      issuingAuthority: 'Public Works Roads (PWD), Majuli Circle',
      publishedAt: new Date('2026-03-20T11:00:00Z'),
      effectiveAt: new Date('2026-03-20T11:00:00Z'),
      status: 'HEARING_PENDING',
      originalText: 'Notice issued under Clause 48-A to M/s Eastern Embankments for failure to deploy requisite heavy earthmoving machinery on Majuli island river protection bund before pre-monsoon rise. Contractor directed to show cause within 15 days why penalty under Clause 47 should not be imposed and contract not terminated for default.',
      plainSummary: 'Contractor M/s Eastern Embankments failed to deploy heavy machinery for Majuli river embankment work, causing 32-day delay before monsoon. Show-cause notice issued - contractor has 15 days to respond or face penalties and contract termination.',
      actionChecklistJson: JSON.stringify([
        'Contractor to submit response within 15 days',
        'PWD to evaluate response and decide on penalties',
        'Monitor embankment work resumption before monsoon',
      ]),
      sourceUrl: 'https://pwd.assam.gov.in/notices/2026/041',
      lastReviewedAt: new Date('2026-03-20'),
      translationsJson: JSON.stringify({
        en: 'Contractor M/s Eastern Embankments failed to deploy heavy machinery for Majuli river embankment work, causing 32-day delay before monsoon. Show-cause notice issued - contractor has 15 days to respond or face penalties and contract termination.',
        as: 'মাজুলীৰ মথাউৰি সুৰক্ষাৰ কামত ৩২ দিন বিলম্ব কৰাৰ বাবে সংশ্লিষ্ট ঠিকাদাৰক কাৰণ দৰ্শোৱাৰ জাননী। ১৫ দিনত জবাব দিব লাগিব, নহলে ক asosiy আৰু চুক্তি বাতিল হব।',
        hi: 'ठेकेदार मेसर्स ईस्टर्न एम्बैंकमेंट्स ने माजुली नदी तटबंध कार्य के लिए भारी मशीनरी तैनात नहीं की, जिससे मानसून से पहले 32 दिन की देरी हुई। कारण बताओ नोटिस जारी - 15 दिन में जवाब दें अन्यथा जुर्माना और अनुबंध समाप्ति।',
        bn: 'ঠিকাদার মেসার্স ইস্টার্ন এমব্যাংকমেন্টস মাজুলী নদীর বাঁধের কাজের জন্য ভারী মশিন স্থাপন করেননি, ফলে মৌসুম আগে ৩২ দিন বিলম্ব। কারণ দেখানোর নোটিশ জারি - ১৫ দিনের মধ্যে জবাব দিন অন্যথায় জরিমানা এবং চুক্তি বাতিল।',
      }),
      imagePath: '/images/001_Nitin_Gadkari_laid_the_foundation_stone_of_Construction_of_Brahmaputra.jpg',
    },
    {
      title: 'PM-DevINE Sanction: Telemedicine Hubs for 15 Aspirational Blocks in Assam',
      issuingAuthority: 'Ministry of Development of North Eastern Region (MDoNER)',
      publishedAt: new Date('2026-03-18T09:00:00Z'),
      effectiveAt: new Date('2026-04-01T00:00:00Z'),
      status: 'ACTIVE',
      originalText: 'Administrative approval and expenditure sanction under PM-DevINE for establishment of 15 Telemedicine Hubs in Aspirational Blocks of Assam at a total outlay of ₹42.00 Crore. Each hub to include high-definition video consultation, digital pathology, AI-assisted diagnostics, and satellite connectivity. Implementation through NHM Assam with technical support from C-DAC.',
      plainSummary: 'MDoNER sanctions ₹42 Crore under PM-DevINE for 15 Telemedicine Hubs in Assam\'s Aspirational Blocks. Each hub will have HD video consultation, digital pathology, AI diagnostics, and satellite connectivity. Implemented by NHM Assam with C-DAC support.',
      actionChecklistJson: JSON.stringify([
        'Track hub construction and equipment installation',
        'Verify AI diagnostic accuracy reports',
        'Monitor patient consultation volumes quarterly',
      ]),
      sourceUrl: 'https://mdoner.gov.in/sanctions/2026/pmdevine-telemedicine',
      lastReviewedAt: new Date('2026-03-18'),
      translationsJson: JSON.stringify({
        en: 'MDoNER sanctions ₹42 Crore under PM-DevINE for 15 Telemedicine Hubs in Assam\'s Aspirational Blocks. Each hub will have HD video consultation, digital pathology, AI diagnostics, and satellite connectivity. Implemented by NHM Assam with C-DAC support.',
        as: 'এমডোনাৰ পিএম-ডেভইনৰ তলত ১৫টা টেলিমেডিসিন হাব বাঁধিবলৈ ৪২ কোটি টকা সঙ্কালিত কৰিছে। প্ৰতিটি হাবত HD ভিডিও পরামৰ্শ, ডিজিটেল প্যাথলজি, AI ডায়াগনোষ্টিকস আৰু সেটেলাইত সংযোগ থাকিব। NHM অসম আৰু C-DAC-ৰ সহায়ততাৰে কাৰ্যন্বয়ন হব।',
        hi: 'एमडोनर ने पीएम-डेवाइन के तहत असम के आकांक्षी ब्लॉकों में 15 टेलीमेडिसिन हब के लिए ₹42 करोड़ मंजूर किए। प्रत्येक हब में HD वीडियो परामर्श, डिजिटल पैथोलॉजी, AI निदान और उपग्रह कनेक्टिविटी होगी। NHM असम और C-DAC के सहयोग से कार्यान्वयन।',
        bn: 'এমডোনার পিএম-ডেভইনের অধীনে আসামের আকাঙ্ক্ষী ব্লকে ১৫টি টেলিমেডিসিন হাবের জন্য ৪২ কোটি টাকা অনুমোদন। প্রতিটি হাবে HD ভিডিও পরামর্শ, ডিজিটাল প্যাথোলজি, AI ডায়াগনóstিক্স এবং স্যাটেলাইট সংযোগ থাকবে। NHM আসাম এবং C-DAC-র সহায়তায় বাস্তবায়ন।',
      }),
      imagePath: '/images/014_Ravi_Shankar_Prasad_the_Chief_Minister_of_Assam_Shri_Sarbananda_Sonowa.jpg',
    },
    {
      title: 'Assam Adarsh Gram Yojana: Model Village Selection 2026-27 Notification',
      issuingAuthority: 'Panchayat & Rural Development Dept, Assam',
      publishedAt: new Date('2026-03-15T10:00:00Z'),
      effectiveAt: new Date('2026-04-01T00:00:00Z'),
      status: 'ACTIVE',
      originalText: 'Notification for selection of 200 Model Villages under Assam Adarsh Gram Yojana for FY 2026-27. Each selected village to receive ₹50 Lakhs for convergent development across health, education, sanitation, livelihood, and digital infrastructure. Selection through Gram Sabha resolution and District Level Committee verification. Applications open till 30th April 2026.',
      plainSummary: 'P&RD Assam invites applications for 200 Model Villages under AAGY 2026-27. Each village gets ₹50 Lakhs for health, education, sanitation, livelihood, and digital infrastructure. Apply via Gram Sabha resolution by 30 April 2026.',
      actionChecklistJson: JSON.stringify([
        'Convene Gram Sabha to pass model village resolution',
        'Prepare convergent development plan with all departments',
        'Submit application to District Level Committee by 30 April 2026',
        'Track selection status on Poorvottar Drishti portal',
      ]),
      sourceUrl: 'https://prd.assam.gov.in/aagy/2026-27/notification',
      lastReviewedAt: new Date('2026-03-15'),
      translationsJson: JSON.stringify({
        en: 'P&RD Assam invites applications for 200 Model Villages under AAGY 2026-27. Each village gets ₹50 Lakhs for health, education, sanitation, livelihood, and digital infrastructure. Apply via Gram Sabha resolution by 30 April 2026.',
        as: 'পি আৰু অর ডি অসম AAGY 2026-27 বাবে ২০০টা আদৰ্শ গাঁও বাছনিৰ আৰ্থ জাননী দিছে। প্ৰতিটি গাঁওত স্বাস্থ্য, শিক্ষা, স্বચ্ছতা, জীবিকা আৰু ডিজিটেল পুৰণনিৰ বাবে ৫০ লক্ষ টকা পাব। গ্ৰাম সভাৰ প্ৰস্তাৱ দি ৩০ এপ্ৰিল ২০২৬লৈ আবেদন কৰা যাব।',
        hi: 'पंचायत एवं ग्रामीण विकास विभाग असम ने AAGY 2026-27 के तहत 200 आदर्श गांवों के लिए आवेदन आमंत्रित किए। प्रत्येक गांव को स्वास्थ्य, शिक्षा, स्वच्छता, आजीविका और डिजिटल बुनियादी ढांचे के लिए ₹50 लाख मिलेंगे। ग्राम सभा प्रस्ताव के माध्यम से 30 अप्रैल 2026 तक आवेदन करें।',
        bn: 'পি আর ডি আসাম AAGY 2026-27-এর জন্য ২০০টি আদর্শ গ্রামের জন্য আবেদন আহ্বান করেছে। প্রতিটি গ্রাম স্বাস্থ্য, শিক্ষা, স্বচ্ছতা, জীবিকা এবং ডিজিটাল অবকাঠামোর জন্য ৫০ লক্ষ টাকা পাবে। গ্রাম সভার প্রস্তাব দিয়ে ৩০ এপ্রিল ২০২৬-এর মধ্যে আবেদন করুন।',
      }),
      imagePath: '/images/016_The_Chief_Minister_of_Assam_Shri_Sarbananda_Sonowal_calling_on_the_Uni.jpg',
    },
    {
      title: 'Jal Jeevan Mission Assam: FHTC Saturation Target Revision for 2026-27',
      issuingAuthority: 'Public Health Engineering Dept (PHED), Assam',
      publishedAt: new Date('2026-03-10T14:00:00Z'),
      effectiveAt: new Date('2026-04-01T00:00:00Z'),
      status: 'AMENDED',
      originalText: 'Revised Functional Household Tap Connection (FHTC) saturation targets for Jal Jeevan Mission Assam FY 2026-27. State target revised from 25 lakh to 30 lakh connections. District-wise allocation revised based on population projections and pending coverage. Priority to aspirational districts, SC/ST habitations, and water-quality affected areas. Monthly progress reporting mandatory on JJM IMIS.',
      plainSummary: 'PHED Assam revises JJM FHTC target from 25 lakh to 30 lakh connections for 2026-27. Priority to aspirational districts, SC/ST habitations, and water-quality affected areas. Monthly reporting mandatory on JJM IMIS portal.',
      actionChecklistJson: JSON.stringify([
        'Review district-wise revised targets on PHED portal',
        'Monitor monthly FHTC progress against revised targets',
        'Flag districts lagging behind for intervention',
        'Verify water quality testing compliance',
      ]),
      sourceUrl: 'https://phed.assam.gov.in/jjm/targets/2026-27-revised',
      lastReviewedAt: new Date('2026-03-10'),
      translationsJson: JSON.stringify({
        en: 'PHED Assam revises JJM FHTC target from 25 lakh to 30 lakh connections for 2026-27. Priority to aspirational districts, SC/ST habitations, and water-quality affected areas. Monthly reporting mandatory on JJM IMIS portal.',
        as: 'পিএইচইডি অসম JJM FHTC লক্ষ্য ২৫ লাখৰ পৰা ৩০ লাখ সংযোগত সংশোধন কৰিছে ২০২৬-২৭ বাবে। আকাঙ্ক্ষী জিলা, ব delighted/ST বসতি আৰু পানী গুণগত প্রভাবিত অঞ্চলক প্ৰাধান্য। JJM IMIS পোৰ্তালত মাসিক প্ৰগতি ৰিপোর্ট বাধ্যতামূলক।',
        hi: 'पीएचईडी असम ने JJM FHTC लक्ष्य 2026-27 के लिए 25 लाख से बढ़ाकर 30 लाख कनेक्शन किया। आकांक्षी जिलों, SC/ST बस्तियों और पानी की गुणवत्ता प्रभावित क्षेत्रों को प्राथमिकता। JJM IMIS पोर्टल पर मासिक रिपोर्टिंग अनिवार्य।',
        bn: 'পিএইচইডি আসাম JJM FHTC লক্ষ্য ২০২৬-২৭ সালের জন্য ২৫ লাখ থেকে ৩০ লাখ সংযোগে সংশোধন করেছে। আকাঙ্ক্ষী জেলা, এসসি/এসটি বসতি এবং জলগুণগত প্রভাবিত এলাকাকে অগ্রাধিকার। JJM IMIS পোর্টালে মাসিক রিপোর্টিং বাধ্যতামূলক।',
      }),
      imagePath: '/images/019_The_Secretary_Ministry_of_Drinking_Water_and_Sanitation_Shri_Parameswa.jpg',
    },
  ];

  for (const n of notices) {
    await prisma.governmentNotice.upsert({
      where: { title: n.title },
      update: n,
      create: n,
    });
  }

  console.log('✅ Notices seeded');
}