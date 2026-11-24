import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedActivity() {
  console.log('Seeding milestones, inspections, grievances, audit logs...');

  // Get user IDs for FK references
  const citizen = await prisma.user.findUnique({ where: { email: 'citizen@demo.yojna' } });
  const officer = await prisma.user.findUnique({ where: { email: 'officer@demo.yojna' } });
  const dc = await prisma.user.findUnique({ where: { email: 'dc@demo.yojna' } });
  const admin = await prisma.user.findUnique({ where: { email: 'admin@demo.yojna' } });

  // Get project IDs
  const projectDar0821 = await prisma.projectWork.findUnique({ where: { workCode: 'AS-DAR-0821' } });
  const projectKam1049 = await prisma.projectWork.findUnique({ where: { workCode: 'AS-KAM-1049' } });
  const projectBtc0412 = await prisma.projectWork.findUnique({ where: { workCode: 'AS-BTC-0412' } });
  const projectMaj0301 = await prisma.projectWork.findUnique({ where: { workCode: 'AS-MAJ-0301' } });
  const projectJor0518 = await prisma.projectWork.findUnique({ where: { workCode: 'AS-JOR-0518' } });

  if (!citizen || !officer || !dc || !admin) {
    throw new Error('Users not found');
  }

  // 1. Physical Milestones for flagship project AS-DAR-0821
  if (projectDar0821) {
    const milestones = [
      { projectWorkId: projectDar0821.id, name: 'Intake Well Excavation & Foundation', plannedDate: new Date('2024-03-01'), actualDate: new Date('2024-05-15'), completionPct: 100, verified: true, verifiedBy: 'Pranjal Saikia', verifiedAt: new Date('2024-05-20'), notes: 'Completed but later abandoned due to strata issues' },
      { projectWorkId: projectDar0821.id, name: 'Water Treatment Plant Civil Works', plannedDate: new Date('2024-05-01'), actualDate: new Date('2024-10-30'), completionPct: 100, verified: true, verifiedBy: 'Pranjal Saikia', verifiedAt: new Date('2024-11-05'), notes: 'Civil structure complete' },
      { projectWorkId: projectDar0821.id, name: 'Pipeline Laying - Phase 1 (Main Trunk)', plannedDate: new Date('2024-08-01'), actualDate: null, completionPct: 60, verified: false, verifiedBy: null, verifiedAt: null, notes: 'Stalled at Km 4.2 - contractor demobilized' },
      { projectWorkId: projectDar0821.id, name: 'Pipeline Laying - Phase 2 (Distribution)', plannedDate: new Date('2025-01-01'), actualDate: null, completionPct: 0, verified: false, verifiedBy: null, verifiedAt: null, notes: 'Not started - dependent on Phase 1' },
      { projectWorkId: projectDar0821.id, name: 'Household Connections & Commissioning', plannedDate: new Date('2025-04-01'), actualDate: null, completionPct: 0, verified: false, verifiedBy: null, verifiedAt: null, notes: 'Not started' },
    ];

    for (const m of milestones) {
      await prisma.physicalMilestone.upsert({
        where: { id: `${projectDar0821.id}-${m.name}` },
        update: m,
        create: { ...m, id: `${projectDar0821.id}-${m.name}` },
      });
    }
  }

  // 2. Field Inspections
  if (projectDar0821 && officer) {
    await prisma.fieldInspection.upsert({
      where: { offlineClientId: 'INSP-AS-DAR-0821-20260115-001' },
      update: {},
      create: {
        projectWorkId: projectDar0821.id,
        officerId: officer.id,
        gpsLat: 26.4352,
        gpsLng: 91.8841,
        photoPath: '/images/015_Student_at_the_exhibition_stalls_of_the_Public_Health_Engineering_Depa.jpg',
        exifTimestamp: new Date('2026-01-15T10:30:00Z'),
        qualityFlagsJson: JSON.stringify({ stalledWork: true, abandonedExcavation: true, contractorAbsent: true, materialStockpileLow: true }),
        notes: 'Site visit confirmed pipeline laying stalled at Km 4.2. Intake well excavation abandoned since January. High discrepancy with claimed 80% disbursement. Show-cause initiated under Section 14(2).',
        offlineClientId: 'INSP-AS-DAR-0821-20260115-001',
      },
    });
  }

  if (projectKam1049 && officer) {
    await prisma.fieldInspection.upsert({
      where: { offlineClientId: 'INSP-AS-KAM-1049-20260318-001' },
      update: {},
      create: {
        projectWorkId: projectKam1049.id,
        officerId: officer.id,
        gpsLat: 26.4687,
        gpsLng: 91.6247,
        photoPath: '/images/021_Charm_of_a_colonial_building_with_a_newly_constructed_approch_road_jpg.jpg',
        exifTimestamp: new Date('2026-03-18T14:00:00Z'),
        qualityFlagsJson: JSON.stringify({ onTrack: true, solarPanelsInstalled: true, coldStorageFunctional: true, minorPaintTouchup: true }),
        notes: 'Solar microgrid operational (25kW). Cold-storage unit functional at 4°C. Approach road completed. Minor paint touch-up needed on exterior.',
        offlineClientId: 'INSP-AS-KAM-1049-20260318-001',
      },
    });
  }

  if (projectBtc0412 && officer) {
    await prisma.fieldInspection.upsert({
      where: { offlineClientId: 'INSP-AS-BTC-0412-20260228-001' },
      update: {},
      create: {
        projectWorkId: projectBtc0412.id,
        officerId: officer.id,
        gpsLat: 26.4012,
        gpsLng: 90.2715,
        photoPath: '/images/007_Dhubri-Phulbari_bridge_Phulbari_end_construction_jpg.jpg',
        exifTimestamp: new Date('2026-02-28T11:00:00Z'),
        qualityFlagsJson: JSON.stringify({ onTrack: true, embankmentCompactionOk: true, shelterRoofingComplete: true, accessRoadWip: true }),
        notes: 'Flood shelter roofing 90% complete. Embankment compaction meets specs. Access road work in progress. Good material quality.',
        offlineClientId: 'INSP-AS-BTC-0412-20260228-001',
      },
    });
  }

  if (projectMaj0301 && officer) {
    await prisma.fieldInspection.upsert({
      where: { offlineClientId: 'INSP-AS-MAJ-0301-20260312-001' },
      update: {},
      create: {
        projectWorkId: projectMaj0301.id,
        officerId: officer.id,
        gpsLat: 26.9621,
        gpsLng: 94.2185,
        photoPath: '/images/001_Nitin_Gadkari_laid_the_foundation_stone_of_Construction_of_Brahmaputra.jpg',
        exifTimestamp: new Date('2026-03-12T09:15:00Z'),
        qualityFlagsJson: JSON.stringify({ onTrack: true, embankmentSlopeStable: true, roadSurfaceGood: true, monsoonReadinessHigh: true }),
        notes: 'Embankment slope protection stable. Road surface meets specs. High monsoon readiness. Work progressing per schedule.',
        offlineClientId: 'INSP-AS-MAJ-0301-20260312-001',
      },
    });
  }

  // 3. Grievances
  if (projectDar0821 && citizen) {
    await prisma.grievance.upsert({
      where: { ticketCode: 'GRIEV-2026-DAR-0192' },
      update: {},
      create: {
        ticketCode: 'GRIEV-2026-DAR-0192',
        userId: citizen.id,
        projectWorkId: projectDar0821.id,
        category: 'WATER_SUPPLY_HALT',
        department: 'Public Health Engineering Dept',
        district: 'Darrang',
        description: 'খোৱাপানীৰ পাইপৰ কাম বিগত তিনি মাহে বন্ধ হৈ আছে আৰু গাঁওখনত তীব্ৰ খোৱাপানীৰ নাটনিয়ে দেখা দিছে। (Drinking water pipeline work stopped for 3 months, severe water scarcity).',
        attachmentPath: null,
        status: 'UNDER_REVIEW',
        escalationLevel: 2,
        timelineJson: JSON.stringify([
          { date: '2026-03-01', action: 'Grievance filed by citizen', status: 'SUBMITTED' },
          { date: '2026-03-03', action: 'Assigned to PHED Mangaldai', status: 'UNDER_REVIEW' },
          { date: '2026-03-10', action: 'Site inspection scheduled', status: 'ACTION_REQUIRED' },
          { date: '2026-03-15', action: 'Inspection completed - work stalled confirmed', status: 'UNDER_REVIEW' },
        ]),
        feedbackRating: null,
      },
    });
  }

  if (projectKam1049 && citizen) {
    await prisma.grievance.upsert({
      where: { ticketCode: 'GRIEV-2026-KAM-0087' },
      update: {},
      create: {
        ticketCode: 'GRIEV-2026-KAM-0087',
        userId: citizen.id,
        projectWorkId: projectKam1049.id,
        category: 'QUALITY_DEFECT',
        department: 'PWD Electrical Division',
        district: 'Kamrup Rural',
        description: 'Solar microgrid inverter showing fault codes since last week. Cold storage temperature fluctuating. Need urgent repair.',
        attachmentPath: null,
        status: 'ACTION_REQUIRED',
        escalationLevel: 1,
        timelineJson: JSON.stringify([
          { date: '2026-03-20', action: 'Grievance filed', status: 'SUBMITTED' },
          { date: '2026-03-21', action: 'Assigned to EE PWD Electrical', status: 'UNDER_REVIEW' },
          { date: '2026-03-22', action: 'Technician dispatched for inverter diagnosis', status: 'ACTION_REQUIRED' },
        ]),
        feedbackRating: null,
      },
    });
  }

  if (projectBtc0412 && citizen) {
    await prisma.grievance.upsert({
      where: { ticketCode: 'GRIEV-2026-BTC-0034' },
      update: {},
      create: {
        ticketCode: 'GRIEV-2026-BTC-0034',
        userId: citizen.id,
        projectWorkId: projectBtc0412.id,
        category: 'STALLED_WORK',
        department: 'BTC Engineering Wing',
        district: 'Kokrajhar',
        description: 'Access road to flood shelter not motorable. Construction materials dumped blocking village path. Work appears stalled for 2 weeks.',
        attachmentPath: null,
        status: 'SUBMITTED',
        escalationLevel: 1,
        timelineJson: JSON.stringify([
          { date: '2026-03-18', action: 'Grievance filed by Serfanguri resident', status: 'SUBMITTED' },
        ]),
        feedbackRating: null,
      },
    });
  }

  // Grievance without project (general)
  if (citizen) {
    await prisma.grievance.upsert({
      where: { ticketCode: 'GRIEV-2026-DAR-0210' },
      update: {},
      create: {
        ticketCode: 'GRIEV-2026-DAR-0210',
        userId: citizen.id,
        projectWorkId: null,
        category: 'DOCUMENT_REQUEST',
        department: 'Transformation & Development Dept',
        district: 'Darrang',
        description: 'Request for copy of sanction order and fund release details for AS-DAR-0821 under RTI Act.',
        attachmentPath: null,
        status: 'SUBMITTED',
        escalationLevel: 1,
        timelineJson: JSON.stringify([
          { date: '2026-03-22', action: 'RTI application filed', status: 'SUBMITTED' },
        ]),
        feedbackRating: null,
      },
    });
  }

  // 4. Audit Logs
  const auditLogs = [
    { actorId: admin.id, action: 'CREATE_PROJECT', entityType: 'ProjectWork', entityId: projectDar0821?.id || '', metadataJson: JSON.stringify({ workCode: 'AS-DAR-0821', scheme: 'NESIDS_OTRI' }), ipHash: 'hash1' },
    { actorId: officer.id, action: 'CREATE_INSPECTION', entityType: 'FieldInspection', entityId: '', metadataJson: JSON.stringify({ projectWorkId: projectDar0821?.id, offlineClientId: 'INSP-AS-DAR-0821-20260115-001' }), ipHash: 'hash2' },
    { actorId: dc.id, action: 'CREATE_VARIANCE_FLAG', entityType: 'AuditVarianceFlag', entityId: '', metadataJson: JSON.stringify({ projectWorkId: projectDar0821?.id, varianceGapPct: 45.0, inquiryStatus: 'FUNDS_FROZEN' }), ipHash: 'hash3' },
    { actorId: citizen.id, action: 'SUBMIT_GRIEVANCE', entityType: 'Grievance', entityId: '', metadataJson: JSON.stringify({ ticketCode: 'GRIEV-2026-DAR-0192', category: 'WATER_SUPPLY_HALT' }), ipHash: 'hash4' },
    { actorId: admin.id, action: 'CREATE_NOTICE', entityType: 'GovernmentNotice', entityId: '', metadataJson: JSON.stringify({ title: 'Stop-Work & Financial Discrepancy Mandate: Sipajhar Multi-Village WSS' }), ipHash: 'hash5' },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({ data: log });
  }

  // 5. Audit Variance Flag for flagship project
  if (projectDar0821) {
    await prisma.auditVarianceFlag.upsert({
      where: { id: `VAR-${projectDar0821.id}` },
      update: {},
      create: {
        id: `VAR-${projectDar0821.id}`,
        projectWorkId: projectDar0821.id,
        financialPct: 80.0,
        physicalPct: 35.0,
        varianceGapPct: 45.0,
        flagReason: 'Financial debit of ₹8.80 Cr exceeds verified physical progress by 45%. Intake well work abandoned.',
        inquiryStatus: 'FUNDS_FROZEN',
        triggeredDate: new Date('2026-01-18T09:00:00Z'),
        resolvedDate: null,
      },
    });
  }

  console.log('✅ Activity data seeded');
}