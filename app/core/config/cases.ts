/*
 * core/config/cases.ts
 *
 * جزء من تقسيم portfolio.ts (كان 70KB في موديول واحد). كل حاجة هنا اتنقلت
 * زي ما هي بالحرف — مفيش أي تعديل في الداتا نفسها، التقسيم بس.
 *
 * ليه؟ layout.tsx كان بيعمل import لـ knowledgeEducationItems من الملف
 * الكبير، فبيجرّ معاه في نفس الـ module graph كل الـ 38 case وكل الـ
 * screenshots وكل فيديوهات اليوتيوب — على كل صفحة، حتى اللي مش محتاجاها.
 * الاعتماد على الـ tree-shaking عشان يفصلهم شغّال نظرياً، بس مع موديول واحد
 * فيه كل حاجة هو رهان مش ضمانة. الملفات المنفصلة بتخلي الفصل حقيقي.
 *
 * portfolio.ts لسه موجود كـ barrel بيعيد التصدير، فأي import قديم شغّال زي
 * ما هو ومفيش حاجة اتكسرت.
 */

import type { CaseStudyHighlight, CaseEvidence } from "./shared";

// -----------------------------------------------------------------------------
// Cases (from cases.ts)
// -----------------------------------------------------------------------------

export const EMPTY_SCREENSHOTS: string[] = [];

export const caseStudyHighlights: CaseStudyHighlight[] = [
  {
    title: "SOC Alert Tuning Sprint",
    domain: "SOC Analysis",
    problem: "Alert overload made daily triage noisy and delayed response to high-priority events.",
    action: "Mapped noisy detections, tuned correlation logic, and introduced severity-first triage flow.",
    result: "Reduced false positives by 25% in lab SOC operations and improved investigation focus.",
  },
  {
    title: "Threat Hunting Detection Pack",
    domain: "Threat Hunting",
    problem: "Detection coverage had blind spots for stealthy behaviors not captured by baseline rules.",
    action: "Built hypothesis-driven hunt queries and validated signatures against expected telemetry.",
    result: "Increased practical detection coverage and improved analyst confidence in hunt outcomes.",
  },
  {
    title: "Malware Analysis Workflow",
    domain: "DFIR",
    problem: "Malware investigations took too long due to inconsistent IOC extraction and reporting.",
    action: "Created a controlled analysis flow with IOC packaging and behavior mapping templates.",
    result: "Cut investigation time by 20% and improved containment readiness for follow-up actions.",
  },
  {
    title: "Security Training Program",
    domain: "Awareness",
    problem: "Teams needed practical security skills beyond theoretical knowledge.",
    action: "Delivered 35+ structured sessions with guided labs and measurable skill checkpoints.",
    result: "Reached 120+ learners, average feedback 4.9/5, and improved lab performance by 40%.",
  },
  {
    title: "Email Analysis Room Investigation",
    domain: "Email Security",
    problem: "Suspicious inbound email activity required structured triage to quickly separate malicious messages from false alarms.",
    action: "Performed header and sender analysis, inspected embedded links and attachments, and documented indicators with a repeatable workflow.",
    result: "Improved phishing triage consistency and reduced investigation back-and-forth by using a clear evidence-based playbook.",
  },
  {
    title: "BruteForce Room Investigation",
    domain: "SOC Analysis",
    problem: "Authentication alerts indicated repeated login attempts, but source patterns and impact scope were not yet clear.",
    action: "Correlated failed authentication events, validated brute-force indicators, and documented escalation steps with timeline evidence.",
    result: "Improved brute-force triage speed and reporting quality with a repeatable investigation workflow.",
  },
];

const buildScreenshotRange = (
  folder: string,
  start: number,
  end: number,
  excluded: number[] = []
): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)
    .filter((n) => !excluded.includes(n))
    .map((n) => `Assets/Cases/${folder}/Screenshot (${n}).webp`);

export const caseScreenshotsByEvidenceId: Record<string, string[]> = {
  "information-disclosure-module": Array.from({ length: 16 }, (_, i) => `Assets/Cases/Information_Disclosure_Module/${i + 1}.webp`),
  "idor-live-chat": [
    "Assets/Cases/IDOR/Screenshot (283).webp",
    "Assets/Cases/IDOR/Screenshot (284).webp",
    "Assets/Cases/IDOR/Screenshot (285).webp",
    "Assets/Cases/IDOR/Screenshot (286).webp",
    "Assets/Cases/IDOR/Screenshot (287).webp",
    "Assets/Cases/IDOR/Screenshot (288).webp",
    "Assets/Cases/IDOR/Screenshot (289).webp",
    "Assets/Cases/IDOR/Screenshot (290).webp",
    "Assets/Cases/IDOR/Screenshot (291).webp",
    "Assets/Cases/IDOR/Screenshot (292).webp",
    "Assets/Cases/IDOR/Screenshot (293).webp"
  ],
  "monitoring-active-directory": Array.from({ length: 10 }, (_, i) => `Assets/Cases/Monitoring_Active_Directory/${i + 1}.webp`),
  "defensive-security-trends": Array.from({ length: 4 }, (_, i) => `Assets/Cases/Defensive_Security_Trends/Screenshot (${195 + i}).webp`),
  "report-writing-soc-l2": Array.from({ length: 5 }, (_, i) => `Assets/Cases/Report_Writing_SOC_L2/Screenshot (${190 + i}).webp`),
  "soc-l2-alert-triage": Array.from({ length: 5 }, (_, i) => `Assets/Cases/SOC_L2_Alert_Triage/Screenshot (${185 + i}).webp`),
  "offensive-security-intro": Array.from({ length: 9 }, (_, i) => `Assets/Cases/Offensive_Security_Intro/Screenshot (${166 + i}).webp`),
  "iam-access-control-room": Array.from({ length: 12 }, (_, i) => `Assets/Cases/IAM_Access_Control/Screenshot (${141 + i}).webp`),
  "bounty-hacker-ctf-writeup": Array.from({ length: 16 }, (_, i) => `Assets/Cases/Bounty_Hacker/Screenshot (${78 + i}).webp`),
  "easy-peasy-ctf-writeup": Array.from({ length: 13 }, (_, i) => `Assets/Cases/Easy_Peasy/Screenshot (${62 + i}).webp`),
  "simple-ctf-writeup": Array.from({ length: 11 }, (_, i) => `Assets/Cases/Simple_CTF/Screenshot (${49 + i}).webp`),
  "ecir-registry-forensics": Array.from({ length: 14 }, (_, i) => `Assets/Cases/AhmedEmad_RegistryForencics_eCIR/${i + 1}.webp`),
  /* الـ id اتغيّر لـ 3omda-custom-detection-rules، بس **المجلد على القرص
     لسه اسمه بمسافات**. المسار هنا لازم يفضل مطابق للملفات الفعلية في
     public/ وإلا الصور والـ PDF يعملوا 404.

     لو حابب تنضّفه: غيّر اسم المجلد في public/Assets/Cases/ لـ
     3omda-custom-detection-rules وبعدين ظبّط السطور دي. مش مستعجل —
     المسافات في مسار أصل بتشتغل عادي، المشكلة كانت في الـ id بس لأنه
     بيتحوّل لمسار صفحة. */
  "3omda-custom-detection-rules": Array.from({ length: 9 }, (_, i) => `Assets/Cases/3omda custom detection rules/${i + 1}.webp`),
  "penetration-testing-life-cycle": Array.from({ length: 4 }, (_, i) => `Assets/Cases/penetration-testing-life-cycle/${i + 1}.webp`),
  autopsy: Array.from({ length: 13 }, (_, i) => `Assets/Cases/Autopsy/${i + 1}.webp`),
  "data-exfiltration-investigation": Array.from({ length: 37 }, (_, i) => `Assets/Cases/Data Exfiltiration Investigation/${i + 1}.webp`),
  "aws-guardduty-setup": Array.from({ length: 9 }, (_, i) => `Assets/Cases/AWS-GaurdDuty/${i + 1}.webp`),
  "aws-athena-healthcare": Array.from({ length: 16 }, (_, i) => `Assets/Cases/Amazon S3 and Amazon Athena/${i + 1}.webp`),
  "aws-kms-security": Array.from({ length: 25 }, (_, i) => `Assets/Cases/AWS KMS/${i + 1}.webp`),
  "soc-env-depi-r3-project": [
    "Assets/Cases/SOC Enviroment DEPI R3 Project/1.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/2.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/3.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/4.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/5.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/6.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/7.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/8.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/9.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/create txt file to see if fim is working.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/CustomDashboard1.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/CustomDashboard2.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/edit ossec on win.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/enable fim to folder ahmed.webp",
    "Assets/Cases/SOC Enviroment DEPI R3 Project/it works and event appeard .webp",
  ],
  "depi-r4-project": [
    "Assets/Cases/Depi R4 Project/1.jpeg",
    "Assets/Cases/Depi R4 Project/1.webp",
  ],
  "lockbit-ransomware-forensics": Array.from({ length: 18 }, (_, i) => `Assets/Cases/LockBit/Screenshot (${85 + i}).webp`),
  "serpent-stealer": Array.from({ length: 12 }, (_, i) => `Assets/Cases/Serpent Stealer/Screenshot (${135 + i}).webp`),
  imagestegano: [
    "Assets/Cases/ImageStegano/Screenshot (104).webp",
    "Assets/Cases/ImageStegano/Screenshot (105).webp",
    "Assets/Cases/ImageStegano/Screenshot (106).webp",
    "Assets/Cases/ImageStegano/Screenshot (108).webp",
    "Assets/Cases/ImageStegano/Screenshot (109).webp",
    "Assets/Cases/ImageStegano/Screenshot (110).webp",
    "Assets/Cases/ImageStegano/Screenshot (112).webp",
    "Assets/Cases/ImageStegano/Screenshot (113).webp",
    "Assets/Cases/ImageStegano/Screenshot (114).webp",
    "Assets/Cases/ImageStegano/Screenshot (115).webp",
    "Assets/Cases/ImageStegano/Screenshot (116).webp",
    "Assets/Cases/ImageStegano/Screenshot (117).webp",
    "Assets/Cases/ImageStegano/Screenshot (118).webp",
    "Assets/Cases/ImageStegano/Screenshot (119).webp",
    "Assets/Cases/ImageStegano/Screenshot (120).webp",
  ],
  "hidden-backdoor-report": Array.from({ length: 25 }, (_, i) => `Assets/Cases/Hidden Backdoor/Screenshot (${50 + i}).webp`),
  "malware-analysis-wannacry": [
    ...Array.from({ length: 38 }, (_, i) => `Assets/Cases/Malware Analysis and Prevention Strategy/${i + 1}.webp`),
/* التسلسل ده كان Array.from({ length: 24 }, … 343 + i) — بيفترض إن
       الأرقام متتابعة من غير فجوات. بس Screenshot (349) و (353) مش
       موجودين على القرص، فصورتين من كل عرض للـ case ده كانوا مكسورين.

       الأرقام مكتوبة صريحة دلوقتي: أطول، بس بتوصف الموجود فعلاً بدل ما
       تفترض. لو ضفت الصورتين الناقصين، رجّع الـ Array.from. */
    ...[343, 344, 345, 346, 347, 348, 350, 351, 352, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366].map((n) => `Assets/Cases/Malware Analysis and Prevention Strategy/Screenshot (${n}).webp`),
  ],
  "wifi-cracking-walkthrough": ["Assets/Cases/Wifi Cracking/1.webp", "Assets/Cases/Wifi Cracking/2.webp"],
  "ass6-mitre": [
    "Assets/Cases/ass_6/1.webp",
    "Assets/Cases/ass_6/2.webp",
    "Assets/Cases/ass_6/3.webp",
    "Assets/Cases/ass_6/4.webp",
  ],
  "soc127-pdf": buildScreenshotRange("SOC127", 131, 134),
  "soc205-pdf": buildScreenshotRange("SOC205", 154, 162),
  "soc257-pdf": buildScreenshotRange("SOC257", 135, 140),
  "soc274-pdf": buildScreenshotRange("SOC274", 122, 130),
  "soc282-pdf": buildScreenshotRange("SOC282", 144, 149),
  "soc326-report": buildScreenshotRange("SOC326", 100, 121),
  "soc336-report": buildScreenshotRange("SOC336", 165, 178, [169]),
  "soc338-pdf": buildScreenshotRange("SOC338", 83, 90),
  "soc342-pdf": buildScreenshotRange("SOC342", 91, 99),
  "unload-malware-report": buildScreenshotRange("Unload_Malware", 201, 211),
  "malware2-report": buildScreenshotRange("Malware2", 245, 256),
  "bruteforce-room-report": buildScreenshotRange("BruteForce_Room", 228, 244),
  "malicious-web-traffic-room-report": buildScreenshotRange("MaliciousWebTraffic_Room", 268, 282),
  "email-analysis-room-report": Array.from({ length: 10 }, (_, i) => `Assets/Cases/Email_Analysis_Room/${i + 1}.webp`),
  "usb-forensics-report": [
    "Assets/Cases/Usb Forencics/Screenshot (3).webp",
    "Assets/Cases/Usb Forencics/Screenshot (4).webp",
    "Assets/Cases/Usb Forencics/Screenshot (5).webp",
    "Assets/Cases/Usb Forencics/Screenshot (6).webp",
    "Assets/Cases/Usb Forencics/Screenshot (7).webp",
    "Assets/Cases/Usb Forencics/Screenshot (8).webp",
    "Assets/Cases/Usb Forencics/Screenshot (9).webp",
    "Assets/Cases/Usb Forencics/Screenshot (10).webp",
    "Assets/Cases/Usb Forencics/Screenshot (11).webp",
    "Assets/Cases/Usb Forencics/Screenshot (13).webp",
    "Assets/Cases/Usb Forencics/Screenshot (14).webp",
    "Assets/Cases/Usb Forencics/Screenshot (15).webp",
  ],
  "ettercap-case": [
    "Assets/Cases/EtterCap/Screenshot (27).webp",
    "Assets/Cases/EtterCap/Screenshot (28).webp",
    "Assets/Cases/EtterCap/Screenshot (29).webp",
    "Assets/Cases/EtterCap/Screenshot (31).webp",
    "Assets/Cases/EtterCap/Screenshot (32).webp",
    "Assets/Cases/EtterCap/Screenshot (33).webp",
    "Assets/Cases/EtterCap/Screenshot (34).webp",
    "Assets/Cases/EtterCap/Screenshot (35).webp",
    "Assets/Cases/EtterCap/Screenshot (36).webp",
  ],
};

export const caseEvidenceLibrary: CaseEvidence[] = [
  {
    id: "ecir-registry-forensics",
    title: "Windows Registry Forensics - eCIR",
    description: "Comprehensive forensic analysis of Windows Registry hives (SYSTEM, SOFTWARE, SAM, NTUSER.DAT) to investigate employee misconduct and anti-forensics tool usage.",
    platform: "INE Labs / eCIR",
    type: "DOCX & PDF Report",
    category: "Digital Forensics",
    difficulty: "Hard",
    href: "Assets/Cases/AhmedEmad_RegistryForencics_eCIR/AhmedEmad_RegistryForencics_eCIR.pdf",
    tags: ["Registry Forensics", "Incident Response", "eCIR", "Anti-Forensics"],
    tools: ["Registry Explorer", "DCode", "Reporting"],
    skillsGained: ["Registry Hive Analysis", "User Activity Profiling", "Forensic Reporting", "Evidence Extraction"],
    readTime: 15,
    date: "2026-05-13",
    image: "Assets/Cases/AhmedEmad_RegistryForencics_eCIR/1.webp",
  },
  {
    id: "depi-r4-project",
    title: "Depi R4 Project",
    description: "Malware analysis and prevention strategy project for DEPI R4, including detection, analysis, and reporting.",
    platform: "DEPI R4",
    type: "DOCX & PDF Report",
    category: "Malware Analysis",
    difficulty: "Hard",
    href: "Assets/Cases/Depi R4 Project/AhmedEmad_MalwareAnalysis_And_Prevention_Strategy.pdf",
    tags: ["Malware", "Prevention", "Analysis", "DEPI"],
    tools: ["Malware Analysis", "Prevention", "Reporting"],
    skillsGained: ["Malware Analysis", "Prevention Strategy", "Reporting"],
    readTime: 18,
    date: "2026-04-20",
    screenshots: ["Assets/Cases/Depi R4 Project/1.jpeg", "Assets/Cases/Depi R4 Project/1.webp"],
    image: "Assets/Cases/Depi R4 Project/1.jpeg",
  },
  {
    id: "soc-env-depi-r3-project",
    title: "SOC Enviroment DEPI R3 Project",
    description: "SOC environment build and configuration for DEPI R3, including SIEM, FIM, and custom dashboards.",
    platform: "DEPI R3",
    type: "PDF Report",
    category: "SOC",
    difficulty: "Hard",
    href: "Assets/Cases/SOC Enviroment DEPI R3 Project/SOC Enviroment.pdf",
    tags: ["SOC", "SIEM", "FIM", "Dashboard", "DEPI"],
    tools: ["Wazuh", "SIEM", "FIM", "Dashboard"],
    skillsGained: ["SOC Build", "SIEM Configuration", "FIM", "Dashboarding"],
    readTime: 16,
    date: "2026-04-20",
    screenshots: [
      "Assets/Cases/SOC Enviroment DEPI R3 Project/1.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/2.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/3.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/4.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/5.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/6.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/7.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/8.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/9.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/create txt file to see if fim is working.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/CustomDashboard1.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/CustomDashboard2.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/edit ossec on win.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/enable fim to folder ahmed.webp",
      "Assets/Cases/SOC Enviroment DEPI R3 Project/it works and event appeard .webp",
    ],
    image: "Assets/Cases/SOC Enviroment DEPI R3 Project/1.webp",
  },
  {
    id: "hidden-backdoor-report",
    title: "Hidden Backdoor Case Study",
    description: "Detection and analysis of a hidden backdoor in a simulated environment, including investigation steps and mitigation.",
    platform: "Blue Team Simulation",
    type: "DOCX & PDF Report",
    category: "Malware Analysis",
    difficulty: "Hard",
    href: "Assets/Cases/Hidden Backdoor/AhmedEmad_HiddenBackdoor.pdf",
    tags: ["Backdoor", "Persistence", "Malware", "Detection"],
    tools: ["Forensics", "SIEM", "Malware Analysis"],
    skillsGained: ["Backdoor Detection", "Persistence Analysis", "Incident Response"],
    readTime: 20,
    date: "2026-04-18",
    screenshots: [...Array.from({ length: 25 }, (_, i) => `Assets/Cases/Hidden Backdoor/Screenshot (${50 + i}).webp`)],
    image: "Assets/Cases/Hidden Backdoor/Screenshot (50).webp",
  },
  {
    id: "malware-analysis-wannacry",
    title: "WannaCry Ransomware Analysis & Response",
    description: "In-depth analysis and incident response for WannaCry ransomware infection, including detection, containment, and recovery steps.",
    platform: "Lab Simulation",
    type: "DOCX & PDF Report",
    category: "Malware Analysis",
    difficulty: "Hard",
    href: "Assets/Cases/Malware Analysis and Prevention Strategy/AhmedEmad_WannaCry.pdf",
    tags: ["WannaCry", "Ransomware", "Malware", "Incident Response"],
    tools: ["YARA", "SIEM", "Static Analysis", "Dynamic Analysis"],
    skillsGained: ["Malware Analysis", "Ransomware Response", "IOC Extraction"],
    readTime: 24,
    date: "2026-03-01",
    screenshots: [
      ...Array.from({ length: 38 }, (_, i) => `Assets/Cases/Malware Analysis and Prevention Strategy/${i + 1}.webp`),
  /* التسلسل ده كان Array.from({ length: 24 }, … 343 + i) — بيفترض إن
       الأرقام متتابعة من غير فجوات. بس Screenshot (349) و (353) مش
       موجودين على القرص، فصورتين من كل عرض للـ case ده كانوا مكسورين.

       الأرقام مكتوبة صريحة دلوقتي: أطول، بس بتوصف الموجود فعلاً بدل ما
       تفترض. لو ضفت الصورتين الناقصين، رجّع الـ Array.from. */
    ...[343, 344, 345, 346, 347, 348, 350, 351, 352, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366].map((n) => `Assets/Cases/Malware Analysis and Prevention Strategy/Screenshot (${n}).webp`),
    ],
    /* كان "/ 21.webp" — مسافة زايدة قبل الرقم. الملف على القرص اسمه
       "21.webp"، فصورة الغلاف بتاعة الـ case ده كانت 404. سكربت فحص
       الأصول هو اللي مسكها. */
    image: "Assets/Cases/Malware Analysis and Prevention Strategy/21.webp",
  },
  {
    id: "3omda-custom-detection-rules",
    title: "My Custom Detection Rules in Wazuh SIEM Solution with 92% Detection Rate",
    description: "Custom detection rules for identifying suspicious activities in the network.",
    platform: "SIEM Lab",
    type: "PDF Report",
    category: "Threat Detection",
    difficulty: "Hard",
    href: "Assets/Cases/3omda custom detection rules/3omda custom detection rules.pdf",
    tags: ["Wazuh", "SIEM", "Threat Detection", "Custom Rules", "Blue Team", "SOC", "Network Security"],
    tools: ["Wazuh", "EDR", "SIEM"],
    skillsGained: ["Wazuh Rule Creation", "Threat Hunting", "Log Analysis", "Detecting Defense Evasion", "Privilege Escalation Detection"],
    readTime: 26,
    date: "2026-05-05",
    screenshots: Array.from({ length: 9 }, (_, i) => `Assets/Cases/3omda custom detection rules/${i + 1}.webp`),
    image: "Assets/Cases/3omda custom detection rules/1.webp",
  },
  {
    id: "penetration-testing-life-cycle",
    title: "penetration testing Life Cycle",
    description: "Presentation of a complete penetration testing lifecycle, including planning, execution, and reporting phases.",
    platform: "Kali Linux Lab",
    type: "PDF Report",
    category: "Penetration Testing",
    difficulty: "Easy",
    href: "Assets/Cases/penetration-testing-life-cycle/AhmedEmad.pdf",
    tags: ["Privilege Escalation", "Attack Chain", "Defense"],
    tools: ["EDR", "SIEM"],
    skillsGained: ["Privilege Escalation Detection", "Defense Bypass"],
    readTime: 26,
    date: "2026-05-05",
  },
  {
    id: "autopsy",
    title: "Autopsy ",
    description: "Complete digital forensic data recovery operation using Autopsy 4.23.0 to extract deleted files, analyze unallocated space, and generate formal evidence reports.",
    platform: "Digital Forensics Lab",
    type: "Report",
    category: "Forensics",
    difficulty: "Medium",
    href: "Assets/Cases/Autopsy/AhmedEmad_Autopsy.pdf",
    tags: ["Autopsy", "Data Recovery", "Digital Forensics", "Unallocated Space"],
    tools: ["Autopsy 4.23.0", "Data Recovery Tools"],
    skillsGained: ["Evidence Recovery", "Artifact Analysis", "Troubleshooting", "Forensic Reporting"],
    readTime: 12,
    date: "2026-05-01",
    screenshots: ["Assets/Cases/Autopsy/1.webp"],
    image: "Assets/Cases/Autopsy/1.webp",
  },
  {
    id: "data-exfiltration-investigation",
    title: "Unauthorized Data Exfiltration & Credential Compromise",
    description: "Memory forensics investigation using Volatility Framework to confirm data exfiltration via USB, NTLM credential dumping, and SSH backdoor persistence.",
    platform: "Memory Forensics Lab",
    type: "Report",
    category: "DFIR",
    difficulty: "Hard",
    href: "Assets/Cases/Data Exfiltiration Investigation/AhmedEmad_DataExfiltration.pdf",
    tags: ["Memory Forensics", "Volatility", "Data Exfiltration", "Credential Dumping", "DFIR"],
    tools: ["Volatility Framework", "FTK Imager", "John the Ripper"],
    skillsGained: ["Memory Analysis", "Timeline Reconstruction", "Threat Hunting", "Forensic Reporting"],
    readTime: 15,
    date: "2026-04-28",
    screenshots: ["Assets/Cases/Data Exfiltiration Investigation/1.webp"],
    image: "Assets/Cases/Data Exfiltiration Investigation/1.webp",
  },
  {
    id: "aws-guardduty-setup",
    title: "Amazon GuardDuty Threat Detection",
    description: "Enabled Amazon GuardDuty, generated sample findings, and analyzed high-severity threat detections including unauthorized S3 access.",
    platform: "AWS Lab",
    type: "Write-up",
    category: "Cloud Security",
    difficulty: "Hard",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش.
    tags: ["AWS", "GuardDuty", "Threat Detection", "Security Monitoring"],
    tools: ["Amazon GuardDuty", "AWS Console"],
    skillsGained: ["Continuous Monitoring", "Alert Triage", "Cloud Threat Detection"],
    readTime: 8,
    date: "2026-04-24",
    screenshots: ["Assets/Cases/AWS-GaurdDuty/1.webp"],
    image: "Assets/Cases/AWS-GaurdDuty/1.webp",
  },
  {
    id: "aws-kms-security",
    title: "AWS Cryptographic Key Management (KMS)",
    description: "Configured Customer Managed Keys (CMK) and analyzed External Key Store (XKS) integration constraints via SCP troubleshooting.",
    platform: "AWS Lab",
    type: "Write-up",
    category: "Cloud Security",
    difficulty: "Medium",
    href: "Assets/Cases/AWS KMS/AWS KMS.pdf",
    tags: ["AWS KMS", "Encryption", "IAM Policies", "Troubleshooting"],
    tools: ["AWS KMS", "AWS IAM", "AWS Organizations (SCP)"],
    skillsGained: ["Cryptographic Key Lifecycle", "IAM Policy Configuration", "SCP Explicit Deny Analysis"],
    readTime: 12,
    date: "2026-04-24",
    screenshots: ["Assets/Cases/AWS KMS/1.webp"],
    image: "Assets/Cases/AWS KMS/1.webp",
  },
  {
    id: "aws-athena-healthcare",
    title: "AWS Healthcare Data Pipeline",
    description: "Serverless data ingestion and querying setup for healthcare data using Amazon S3 and Amazon Athena.",
    platform: "AWS Lab",
    type: "Write-up",
    category: "Cloud Infrastructure",
    difficulty: "Easy",
    href: "Assets/Cases/Amazon S3 and Amazon Athena/Amazon S3 and Amazon Athena.pdf",
    tags: ["AWS", "Data Pipeline", "Cloud Security"],
    tools: ["Amazon S3", "Amazon Athena", "SQL"],
    skillsGained: ["Cloud Storage Management", "Data Cataloging", "Serverless Querying"],
    readTime: 10,
    date: "2026-04-23",
    screenshots: ["Assets/Cases/Amazon S3 and Amazon Athena/16.webp"],
    image: "Assets/Cases/Amazon S3 and Amazon Athena/16.webp",
  },
  {
    id: "soc127-pdf",
    title: "SOC127 Incident Report",
    description: "Incident response case study covering alert triage, threat analysis, and containment.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Incident Response",
    difficulty: "Medium",
    href: "Assets/Cases/SOC127/AhmedEmad_SOC127.pdf",
    tags: ["Alert Triage", "Investigation", "Containment"],
    tools: ["SIEM", "Web Server"],
    skillsGained: ["Alert Analysis", "Incident Handling"],
    readTime: 18,
    date: "2025-11-15",
  },
  {
    id: "soc205-pdf",
    title: "SOC205 Incident Report",
    description: "Advanced threat detection and investigation of suspicious network activity patterns.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Incident Response",
    difficulty: "Medium",
    href: "Assets/Cases/SOC205/AhmedEmad_SOC205.pdf",
    tags: ["Threat Detection", "Network Analysis", "Investigation"],
    tools: ["SIEM", "Network Monitoring"],
    skillsGained: ["Threat Hunting", "Network Forensics"],
    readTime: 20,
    date: "2025-11-10",
  },
  {
    id: "soc257-pdf",
    title: "SOC257 Incident Report",
    description: "Malware distribution incident investigation with IoC extraction and analysis.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Malware Analysis",
    difficulty: "Hard",
    href: "Assets/Cases/SOC257/AhmedEmad_SOC257.pdf",
    tags: ["Malware", "IoC", "Distribution"],
    tools: ["Malware Analysis", "SIEM"],
    skillsGained: ["Malware Investigation", "IoC Analysis"],
    readTime: 25,
    date: "2025-11-05",
  },
  {
    id: "soc274-pdf",
    title: "SOC274 Incident Report",
    description: "Lateral movement detection and containment strategies in compromised environments.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Incident Response",
    difficulty: "Hard",
    href: "Assets/Cases/SOC274/AhmedEmad_SOC274.pdf",
    tags: ["Lateral Movement", "Containment", "Defense"],
    tools: ["EDR", "SIEM"],
    skillsGained: ["Attack Pattern Detection", "Containment"],
    readTime: 22,
    date: "2025-10-28",
  },
  {
    id: "soc282-pdf",
    title: "SOC282 Incident Report",
    description: "Data exfiltration detection and prevention with DLP strategy implementation.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Data Security",
    difficulty: "Hard",
    href: "Assets/Cases/SOC282/AhmedEmad_SOC282.pdf",
    tags: ["Exfiltration", "Data Protection", "DLP"],
    tools: ["DLP", "SIEM", "Network Monitoring"],
    skillsGained: ["Data Loss Prevention", "Exfiltration Detection"],
    readTime: 24,
    date: "2025-10-22",
  },
  {
    id: "soc326-report",
    title: "SOC326 Incident Response Report",
    description: "Complete incident response lifecycle from detection to containment and recovery.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Incident Response",
    difficulty: "Hard",
    href: "Assets/Cases/SOC326/AhmedEmad_SOC326.pdf",
    tags: ["IR Lifecycle", "Recovery", "Post-Incident"],
    tools: ["SIEM", "Forensics", "EDR"],
    skillsGained: ["Full IR Process", "Recovery Planning"],
    readTime: 28,
    date: "2025-10-15",
  },
  {
    id: "soc336-report",
    title: "SOC336 Incident Response Report",
    description: "Advanced persistence threat investigation and eradication strategies.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Incident Response",
    difficulty: "Hard",
    href: "Assets/Cases/SOC336/AhmedEmad_SOC336.pdf",
    tags: ["APT", "Persistence", "Eradication"],
    tools: ["SIEM", "Forensics", "Threat Intel"],
    skillsGained: ["APT Investigation", "Persistence Techniques"],
    readTime: 30,
    date: "2025-10-08",
  },
  {
    id: "soc338-pdf",
    title: "SOC338 Incident Report",
    description: "Web application attack investigation and exploitation analysis.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Web Security",
    difficulty: "Medium",
    href: "Assets/Cases/SOC338/AhmedEmad_SOC338.pdf",
    tags: ["Web Attack", "Application", "Exploitation"],
    tools: ["Web Analysis", "Payload Analysis"],
    skillsGained: ["Web Security", "Attack Analysis"],
    readTime: 19,
    date: "2025-10-01",
  },
  {
    id: "soc342-pdf",
    title: "SOC342 Incident Report",
    description: "Privilege escalation attack chain investigation and prevention.",
    platform: "LetsDefend Simulation",
    type: "PDF Report",
    category: "Incident Response",
    difficulty: "Hard",
    href: "Assets/Cases/SOC342/AhmedEmad_SOC342.pdf",
    tags: ["Privilege Escalation", "Attack Chain", "Defense"],
    tools: ["EDR", "SIEM"],
    skillsGained: ["Privilege Escalation Detection", "Defense Bypass"],
    readTime: 26,
    date: "2025-09-25",
  },
  {
    id: "serpent-stealer",
    title: "Serpent Stealer Case Study",
    description: "Analysis and investigation of the Serpent Stealer malware, including infection chain, behavior, and mitigation steps.",
    platform: "Blue Team Simulation",
    type: "DOCX & PDF Report",
    category: "Malware Analysis",
    difficulty: "Hard",
    href: "Assets/Cases/Serpent Stealer/AhmedEmad_Serpent stealer.pdf",
    tags: ["Serpent Stealer", "Malware", "Stealer", "Forensics"],
    tools: ["Forensics Toolkit", "Malware Analysis"],
    skillsGained: ["Stealer Analysis", "Malware Investigation", "Incident Response"],
    readTime: 19,
    date: "2026-04-21",
    screenshots: [
      /*
       * كانت ليستة يدوية من Screenshot (1) لـ (15) — والملفات دي مش موجودة.
       *
       * السبب إن نفس الـ case معرّف في مكانين بترقيمين مختلفين:
       *   caseScreenshotsByEvidenceId  →  Screenshot (135) … (146)
       *   الليستة دي                    →  Screenshot (1)   … (15)
       *
       * والملفات الحقيقية هي 135–146. يعني شبكة الصور في صفحة الـ case
       * كانت بتعرض 15 صورة مكسورة.
       *
       * دلوقتي بتستخدم نفس التعبير بالظبط، فمستحيل الاتنين يفترقوا تاني.
       */
      ...Array.from({ length: 12 }, (_, i) => `Assets/Cases/Serpent Stealer/Screenshot (${135 + i}).webp`),
    ],
    image: "Assets/Cases/Serpent Stealer/Screenshot (135).webp",
  },
  {
    id: "unload-malware-report",
    title: "Unload Malware Analysis Report",
    description: "Comprehensive malware analysis including behavioral analysis and IoC extraction.",
    platform: "Blue Team Simulation",
    type: "PDF Report",
    category: "Malware Analysis",
    difficulty: "Hard",
    href: "Assets/Cases/Unload_Malware/AhmedEmad_Unload_Malware_Report.pdf",
    tags: ["Malware", "Analysis", "Behavioral"],
    tools: ["Malware Lab", "Static Analysis", "Dynamic Analysis"],
    skillsGained: ["Malware Analysis", "Behavioral Understanding"],
    readTime: 27,
    date: "2025-08-28",
  },
  {
    id: "malware2-report",
    title: "Malware 2 Analysis Report",
    description: "Hands-on malware investigation covering static and dynamic analysis with IOC extraction and behavior mapping.",
    platform: "Blue Team Simulation",
    type: "PDF Report",
    category: "Malware Analysis",
    difficulty: "Hard",
    href: "Assets/Cases/Malware2/AhmedEmad_Malware2.pdf",
    tags: ["Malware", "Static Analysis", "Dynamic Analysis"],
    tools: ["Malware Lab", "Threat Intel", "Forensics"],
    skillsGained: ["IOC Extraction", "Malware Behavior Analysis"],
    readTime: 22,
    date: "2025-08-24",
  },
  {
    id: "email-analysis-room-report",
    title: "Email Analysis Room Report",
    description: "Email threat analysis including phishing detection, link analysis, and attachment inspection.",
    platform: "Blue Team Simulation",
    type: "PDF Report",
    category: "Email Security",
    difficulty: "Medium",
    href: "Assets/Cases/Email_Analysis_Room/AhmedEmad_EmailAnalysis_Room.pdf",
    tags: ["Email", "Phishing", "Threat Detection"],
    tools: ["Email Analysis", "Link Analysis"],
    skillsGained: ["Email Threat Detection", "Phishing Analysis"],
    readTime: 14,
    date: "2025-08-20",
  },
  {
    id: "bruteforce-room-report",
    title: "BruteForce Room Report",
    description: "Analysis of brute force attack patterns, detection, and mitigation strategies.",
    platform: "Blue Team Simulation",
    type: "PDF Report",
    category: "Access Security",
    difficulty: "Easy",
    href: "Assets/Cases/BruteForce_Room/AhmedEmad_BruteForce_Room.pdf",
    tags: ["Brute Force", "Authentication", "Defense"],
    tools: ["Log Analysis", "SIEM"],
    skillsGained: ["Brute Force Detection", "Access Protection"],
    readTime: 12,
    date: "2025-08-15",
  },
  {
    id: "malicious-web-traffic-room-report",
    title: "Malicious Web Traffic Room Report",
    description: "Investigation of malicious web traffic patterns with log correlation, IOC identification, and response recommendations.",
    platform: "Blue Team Simulation",
    type: "PDF Report",
    category: "Web Security",
    difficulty: "Medium",
    href: "Assets/Cases/MaliciousWebTraffic_Room/AhmedEmad_MaliciousWebTraffic.pdf",
    tags: ["Web Traffic", "Threat Detection", "IOC"],
    tools: ["Web Log Analysis", "SIEM"],
    skillsGained: ["Web Threat Analysis", "Traffic Investigation"],
    readTime: 16,
    date: "2025-08-12",
  },
  {
    id: "wifi-cracking-walkthrough",
    title: "Wifi Cracking Walkthrough",
    description: "Step-by-step WiFi security assessment and cracking using real-world tools and techniques.",
    platform: "Security Simulation",
    type: "PDF Report",
    category: "Wireless Security",
    difficulty: "Medium",
    href: "Assets/Cases/Wifi Cracking/AhmedEmad_WifiCracker.pdf",
    tags: ["WiFi", "Cracking", "Security", "Assessment"],
    tools: ["Aircrack-ng", "Handshake Capture", "Wordlist Attack"],
    skillsGained: ["WiFi Security Assessment", "Password Cracking"],
    readTime: 18,
    date: "2026-03-21",
    screenshots: ["Assets/Cases/Wifi Cracking/1.webp", "Assets/Cases/Wifi Cracking/2.webp"],
    image: "Assets/Cases/Wifi Cracking/1.webp",
  },
  {
    id: "iti-network-project-report",
    title: "ITI Network Project Report",
    description: "Network security project report covering infrastructure design, hardening decisions, and monitoring recommendations.",
    platform: "ITI Project",
    type: "PDF Report",
    category: "Network Security",
    difficulty: "Medium",
    href: "Assets/Cases/ITI NEtwork Project/RootedAF_Report.pdf",
    tags: ["Network Security", "Infrastructure", "Monitoring"],
    tools: ["Network Analysis", "Hardening"],
    skillsGained: ["Network Defense", "Infrastructure Security"],
    readTime: 15,
    date: "2025-08-11",
  },
  {
    id: "usb-forensics-report",
    title: "USB Forensics Case Study",
    description: "Comprehensive forensic analysis of a USB device, including evidence extraction, timeline reconstruction, and reporting.",
    platform: "Blue Team Simulation",
    type: "PDF & DOCX Report",
    category: "Forensics",
    difficulty: "Hard",
    href: "Assets/Cases/Usb Forencics/AhmedEmad_UsbForencics.pdf",
    tags: ["USB", "Forensics", "Evidence", "Timeline"],
    tools: ["Forensics Toolkit", "Timeline Analysis"],
    skillsGained: ["USB Forensics", "Evidence Extraction", "Timeline Reconstruction"],
    readTime: 20,
    date: "2026-04-17",
    screenshots: [
      "Assets/Cases/Usb Forencics/Screenshot (3).webp",
      "Assets/Cases/Usb Forencics/Screenshot (4).webp",
      "Assets/Cases/Usb Forencics/Screenshot (5).webp",
      "Assets/Cases/Usb Forencics/Screenshot (6).webp",
      "Assets/Cases/Usb Forencics/Screenshot (7).webp",
      "Assets/Cases/Usb Forencics/Screenshot (8).webp",
      "Assets/Cases/Usb Forencics/Screenshot (9).webp",
      "Assets/Cases/Usb Forencics/Screenshot (10).webp",
      "Assets/Cases/Usb Forencics/Screenshot (11).webp",
      "Assets/Cases/Usb Forencics/Screenshot (13).webp",
      "Assets/Cases/Usb Forencics/Screenshot (14).webp",
      "Assets/Cases/Usb Forencics/Screenshot (15).webp",
    ],
    image: "Assets/Cases/Usb Forencics/Screenshot (3).webp",
  },
  {
    id: "ettercap-case",
    title: "EtterCap Case Study",
    description: "Network sniffing and MITM attack simulation using EtterCap, with analysis and defense recommendations.",
    platform: "Lab Simulation",
    type: "DOCX & PDF Report",
    category: "Network Security",
    difficulty: "Easy",
    href: "Assets/Cases/EtterCap/AhmedEmad_EtterCap.pdf",
    tags: ["EtterCap", "MITM", "Sniffing", "Network"],
    tools: ["EtterCap", "Network Analysis"],
    skillsGained: ["MITM Simulation", "Network Sniffing", "Defense Techniques"],
    readTime: 10,
    date: "2026-04-18",
    screenshots: [
      "Assets/Cases/EtterCap/Screenshot (27).webp",
      "Assets/Cases/EtterCap/Screenshot (28).webp",
      "Assets/Cases/EtterCap/Screenshot (29).webp",
      "Assets/Cases/EtterCap/Screenshot (31).webp",
      "Assets/Cases/EtterCap/Screenshot (32).webp",
      "Assets/Cases/EtterCap/Screenshot (33).webp",
      "Assets/Cases/EtterCap/Screenshot (34).webp",
      "Assets/Cases/EtterCap/Screenshot (35).webp",
      "Assets/Cases/EtterCap/Screenshot (36).webp",
    ],
    image: "Assets/Cases/EtterCap/Screenshot (27).webp",
  },
  {
    id: "lockbit-ransomware-forensics",
    title: "LockBit Ransomware Forensics",
    description: "Forensic investigation and incident response for a LockBit ransomware attack, including evidence collection, analysis, and recovery steps.",
    platform: "Blue Team Simulation",
    type: "DOCX & PDF Report",
    category: "Malware Analysis",
    difficulty: "Hard",
    href: "Assets/Cases/LockBit/AhmedEmad_LockBit.pdf",
    tags: ["LockBit", "Ransomware", "Forensics", "Incident Response"],
    tools: ["Forensics Toolkit", "SIEM", "Malware Analysis"],
    skillsGained: ["Ransomware Forensics", "Incident Response", "Evidence Collection"],
    readTime: 23,
    date: "2026-04-18",
    screenshots: [...Array.from({ length: 18 }, (_, i) => `Assets/Cases/LockBit/Screenshot (${85 + i}).webp`)],
    image: "Assets/Cases/LockBit/Screenshot (85).webp",
  },
  {
    id: "imagestegano",
    title: "Image Steganography Case Study",
    description: "Analysis and detection of steganography in images, including extraction techniques and forensic investigation.",
    platform: "Blue Team Simulation",
    type: "DOCX & PDF Report",
    category: "Forensics",
    difficulty: "Hard",
    href: "Assets/Cases/ImageStegano/AhmedEmad_ImageStegano.pdf",
    tags: ["Steganography", "Forensics", "Image Analysis"],
    tools: ["StegCracker", "Forensics Toolkit"],
    skillsGained: ["Steganography Detection", "Image Forensics"],
    readTime: 18,
    date: "2026-04-19",
    screenshots: [...Array.from({ length: 13 }, (_, i) => `Assets/Cases/ImageStegano/Screenshot (${104 + i + (i >= 3 ? 1 : 0)}).webp`)],
    image: "Assets/Cases/ImageStegano/Screenshot (104).webp",
  },
  {
    id: "simple-ctf-writeup",
    title: "Simple CTF Walkthrough",
    description: "End-to-end exploitation of TryHackMe's Simple CTF, including CVE-2019-9053 (CMS Made Simple SQLi), password cracking, and GTFOBins privilege escalation.",
    platform: "TryHackMe",
    type: "Write-up",
    category: "Penetration Testing",
    difficulty: "Easy",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش. 
    tags: ["TryHackMe", "CTF", "SQL Injection", "Privilege Escalation", "CVE-2019-9053"],
    tools: ["Exploit-DB", "Python", "SSH", "Vim"],
    skillsGained: ["Vulnerability Exploitation", "Password Cracking", "Linux Privilege Escalation"],
    readTime: 15,
    date: "2026-08-19",
    /* كان .png — والملفات على القرص .webp، ونفس الـ case في
       caseScreenshotsByEvidenceId (سطر 85) مكتوب .webp صح. نفس غلطة
       Serpent Stealer: الـ case معرّف مرتين واتنينهم اختلفوا. النتيجة إن
       شبكة الأدلة في صفحة الـ case كانت بتعرض 11 صورة مكسورة. */
    screenshots: Array.from({ length: 11 }, (_, i) => `Assets/Cases/Simple_CTF/Screenshot (${49 + i}).webp`),
    image: "Assets/Cases/Simple_CTF/Screenshot (49).webp",
  },
  {
    id: "easy-peasy-ctf-writeup",
    title: "Easy Peasy CTF Walkthrough",
    description: "Step-by-step walkthrough of TryHackMe's Easy Peasy room. Showcasing nmap port enumeration, web directory brute-forcing with Gobuster, hidden paths discovery, and base64/base62 decoding using CyberChef.",
    platform: "TryHackMe",
    type: "Write-up",
    category: "Penetration Testing",
    difficulty: "Easy",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش. 
    tags: ["TryHackMe", "CTF", "Enumeration", "Gobuster", "Cryptography", "CyberChef"],
    tools: ["Nmap", "Gobuster", "CyberChef"],
    skillsGained: ["Port Scanning", "Web Enumeration", "Encoding/Decoding Analysis", "Source Code Inspection"],
    readTime: 12,
    date: "2026-08-19",
    screenshots: Array.from({ length: 13 }, (_, i) => `Assets/Cases/Easy_Peasy/Screenshot (${62 + i}).webp`),
    image: "Assets/Cases/Easy_Peasy/Screenshot (63).webp",
  },
  {
    id: "bounty-hacker-ctf-writeup",
    title: "Bounty Hacker CTF Walkthrough",
    description: "A complete walkthrough of the Bounty Hacker CTF on TryHackMe. The process includes anonymous FTP access to retrieve a custom wordlist, SSH brute-forcing using Hydra, and Linux privilege escalation by exploiting sudo rights on the tar command via GTFOBins.",
    platform: "TryHackMe",
    type: "Write-up",
    category: "Penetration Testing",
    difficulty: "Easy",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش. 
    tags: ["TryHackMe", "CTF", "FTP", "Brute Force", "Hydra", "Privilege Escalation", "GTFOBins"],
    tools: ["Nmap", "Hydra", "SSH", "Tar"],
    skillsGained: ["Service Enumeration", "Password Brute-forcing", "Linux Privilege Escalation"],
    readTime: 12,
    date: "2026-08-21",
    screenshots: Array.from({ length: 16 }, (_, i) => `Assets/Cases/Bounty_Hacker/Screenshot (${78 + i}).webp`),
    image: "Assets/Cases/Bounty_Hacker/Screenshot (78).webp",
  },
  {
    id: "iam-access-control-room",
    title: "IAM & Access Control Concepts",
    description: "Completed the Identity and Access Management room on TryHackMe. Explored core security concepts including Identification, Authentication, Authorization, and Accountability. Deep dive into Access Control Models (DAC, RBAC, MAC), Single Sign-On (SSO), and authentication vulnerabilities like Replay Attacks.",
    platform: "TryHackMe",
    type: "Walkthrough",
    category: "Access Security",
    difficulty: "Easy",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش. 
    tags: ["TryHackMe", "IAM", "Access Control", "RBAC", "MAC", "Authentication", "SSO"],
    tools: ["Security Principles", "Identity Management"],
    skillsGained: ["Identity & Access Management", "Access Control Modeling", "Authentication Mechanisms", "Threat Mitigation"],
    readTime: 10,
    date: "2026-08-27",
    screenshots: Array.from({ length: 12 }, (_, i) => `Assets/Cases/IAM_Access_Control/Screenshot (${141 + i}).webp`),
    image: "Assets/Cases/IAM_Access_Control/Screenshot (152).webp",
  },
  {
    id: "offensive-security-intro",
    title: "Offensive Security Intro Walkthrough",
    description: "Completed the Offensive Security Intro room on TryHackMe. Demonstrated basic web application exploitation by utilizing Dirb to discover hidden directories and accessing an exposed admin portal to manipulate bank transfers.",
    platform: "TryHackMe",
    type: "Walkthrough",
    category: "Web Security",
    difficulty: "Easy",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش. 
    tags: ["TryHackMe", "Web Security", "Dirb", "Directory Brute-forcing"],
    tools: ["Dirb", "Terminal"],
    skillsGained: ["Web Enumeration", "Vulnerability Discovery", "Hidden Page Exploitation"],
    readTime: 5,
    date: "2026-08-28",
    screenshots: Array.from({ length: 9 }, (_, i) => `Assets/Cases/Offensive_Security_Intro/Screenshot (${166 + i}).webp`),
    image: "Assets/Cases/Offensive_Security_Intro/Screenshot (174).webp",
  },
  {
    id: "soc-l2-alert-triage",
    title: "SOC L2 Alert Triage Walkthrough",
    description: "Completed the SOC L2 Alert Triage room on TryHackMe. Transitioned from Tier 1 quick triage to Tier 2 deep log analysis, focusing on the Threat Hunting Loop, building event timelines, false positive tuning, and implementing effective containment strategies.",
    platform: "TryHackMe",
    type: "Walkthrough",
    category: "SOC Analysis",
    difficulty: "Medium",
    //href: "Assets/Cases/SOC_L2_Alert_Triage/AhmedEmad_SOC_L2_Alert_Triage.pdf", 
    tags: ["TryHackMe", "SOC", "Tier 2", "Alert Triage", "Threat Hunting", "Incident Response"],
    tools: ["SIEM", "Log Analysis"],
    skillsGained: ["Advanced Alert Triage", "Threat Hunting", "Incident Containment", "False Positive Analysis"],
    readTime: 12,
    date: "2026-08-30",
    screenshots: Array.from({ length: 5 }, (_, i) => `Assets/Cases/SOC_L2_Alert_Triage/Screenshot (${185 + i}).webp`),
    image: "Assets/Cases/SOC_L2_Alert_Triage/Screenshot (185).webp",
  },
  {
    id: "report-writing-soc-l2",
    title: "Report Writing for SOC L2 Walkthrough",
    description: "Completed the Report Writing for SOC L2 room on TryHackMe. Focused on creating effective incident reports tailored for different audiences, including C-Level executive summaries and detailed DFIR handover notes, emphasizing clear communication and actionable intelligence.",
    platform: "TryHackMe",
    type: "Walkthrough",
    category: "SOC Analysis",
    difficulty: "Medium",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش.
    tags: ["TryHackMe", "SOC", "Tier 2", "Report Writing", "Incident Response", "DFIR"],
    tools: ["Documentation", "Executive Summaries"],
    skillsGained: ["Technical Writing", "Incident Reporting", "C-Level Communication", "DFIR Handovers"],
    readTime: 10,
    date: "2026-08-30",
    screenshots: Array.from({ length: 5 }, (_, i) => `Assets/Cases/Report_Writing_SOC_L2/Screenshot (${190 + i}).webp`),
    image: "Assets/Cases/Report_Writing_SOC_L2/Screenshot (194).webp",
  },
  {
    id: "defensive-security-trends",
    title: "Defensive Security Trends & SOC Level-Up",
    description: "Completed the Defensive Security Trends room on TryHackMe, officially earning the 'SOC Level-Up' badge. Explored modern defensive strategies, emerging cybersecurity trends, and the mindset required for transitioning into a SOC L2 analyst role.",
    platform: "TryHackMe",
    type: "Achievement",
    category: "Defensive Security",
    difficulty: "Easy",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش.
    tags: ["TryHackMe", "Defensive Security", "SOC L2", "Security Trends", "Achievement"],
    tools: ["Security Concepts"],
    skillsGained: ["Threat Landscape Awareness", "Modern Defensive Strategies", "SOC L2 Fundamentals"],
    readTime: 5,
    date: "2026-08-30",
    screenshots: Array.from({ length: 4 }, (_, i) => `Assets/Cases/Defensive_Security_Trends/Screenshot (${195 + i}).webp`),
    image: "Assets/Cases/Defensive_Security_Trends/Screenshot (198).webp",
  },
  {
    id: "monitoring-active-directory",
    title: "Monitoring Active Directory Walkthrough",
    description: "Completed the Monitoring Active Directory room on TryHackMe. Investigated high-volume AD logs using Splunk to detect anomalies. Configured Windows Audit Policies using auditpol, analyzed authentication events (TGT requests, Logon types), and tracked account/group modifications during a simulated employee onboarding scenario.",
    platform: "TryHackMe",
    type: "Walkthrough",
    category: "SOC Analysis",
    difficulty: "Medium",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش.
    tags: ["TryHackMe", "SOC", "Active Directory", "Splunk", "Audit Policy", "Event Logs"],
    tools: ["Splunk", "auditpol"],
    skillsGained: ["Active Directory Monitoring", "Splunk Search Processing Language (SPL)", "Log Analysis", "Baseline Activity Analysis"],
    readTime: 12,
    date: "2026-09-01",
    screenshots: Array.from({ length: 10 }, (_, i) => `Assets/Cases/Monitoring_Active_Directory/${i + 1}.webp`),
    image: "Assets/Cases/Monitoring_Active_Directory/6.webp",
  },
  {
    id: "information-disclosure-module",
    title: "Information Disclosure Module",
    description: "Completed the Information Disclosure module on PortSwigger Web Security Academy. This comprehensive walkthrough covers solving multiple vulnerabilities: utilizing 'wget' and 'Git Cola' to dump and analyze exposed '.git' directories to recover hardcoded admin credentials from version control history, exploiting HTTP headers (X-Custom-IP-Authorization) via Burp Suite to bypass authentication, extracting sensitive environment variables (SECRET_KEY) from exposed phpinfo debug pages, and discovering sensitive backend logic via hidden source code backup files.",
    platform: "PortSwigger",
    type: "Module Walkthrough",
    category: "Web Security",
    difficulty: "Medium",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش.
    tags: ["PortSwigger", "Web Security", "Information Disclosure", "Git", "Burp Suite", "Authentication Bypass", "Source Code Disclosure"],
    tools: ["Burp Suite", "Git Cola", "wget", "Browser DevTools"],
    skillsGained: ["Git Repository Analysis", "Sensitive Data Exposure Identification", "Access Control Bypass", "Directory Enumeration", "HTTP Header Manipulation"],
    readTime: 25,
    date: "2026-10-01",
    screenshots: Array.from({ length: 16 }, (_, i) => `Assets/Cases/Information_Disclosure_Module/${i + 1}.webp`),
    image: "Assets/Cases/Information_Disclosure_Module/16.webp",
  },
  {
    id: "idor-live-chat",
    title: "Insecure Direct Object References",
    description: "Completed the 'Insecure direct object references' lab on PortSwigger. Exploited an IDOR vulnerability in the live chat feature by intercepting the transcript download request with Burp Suite. Manipulated the filename parameter to access previous chat logs (1.txt), disclosing sensitive information including the password for the user 'carlos', which was then used to successfully compromise the account and solve the lab.",
    platform: "PortSwigger",
    type: "Walkthrough",
    category: "Web Security",
    difficulty: "Easy",
    // مفيش PDF للـ case ده — أدلته صور بس، فالزراير مبتتعرضش.
    tags: ["PortSwigger", "Web Security", "IDOR", "Access Control", "Burp Suite", "Information Disclosure"],
    tools: ["Burp Suite"],
    skillsGained: ["IDOR Exploitation", "Parameter Manipulation", "Access Control Vulnerabilities"],
    readTime: 10,
    date: "2026-10-01",
    screenshots: [
      "Assets/Cases/IDOR/Screenshot (283).webp",
      "Assets/Cases/IDOR/Screenshot (284).webp",
      "Assets/Cases/IDOR/Screenshot (285).webp",
      "Assets/Cases/IDOR/Screenshot (286).webp",
      "Assets/Cases/IDOR/Screenshot (287).webp",
      "Assets/Cases/IDOR/Screenshot (288).webp",
      "Assets/Cases/IDOR/Screenshot (289).webp",
      "Assets/Cases/IDOR/Screenshot (290).webp",
      "Assets/Cases/IDOR/Screenshot (291).webp",
      "Assets/Cases/IDOR/Screenshot (292).webp",
      "Assets/Cases/IDOR/Screenshot (293).webp"
    ],
    image: "Assets/Cases/IDOR/Screenshot (293).webp",
  },
] as const;

/*
 * ═══════════════════════════════════════════════════════════════════════
 * حارس وقت الـ build: كل id لازم يكون صالح كـ URL
 * ═══════════════════════════════════════════════════════════════════════
 *
 * الـ id بيتحوّل مباشرة لمسار الصفحة (`/blog/{id}`) وبيترجّع من
 * generateStaticParams. الـ id اللي كان اسمه "3omda custom detection rules"
 * — بمسافات — كان بيكسّر الصفحة بالخطأ ده:
 *
 *     Page "/blog/[slug]/page" is missing param "/blog/[slug]"
 *     in "generateStaticParams()", which is required with "output: export"
 *
 * السبب إن اللينك في الصفحة بيتعمله encode (`%20`) والـ param الراجع من
 * generateStaticParams فيه مسافات فعلية، فالراوتر مش بيلاقي تطابق.
 *
 * الفحص ده بيفشّل الـ build فوراً برسالة واضحة بدل ما تكتشف المشكلة من
 * صفحة 404 في المتصفح. بيتنفذ وقت الـ build بس (الملف ده بيتقري في
 * Server Components)، فتكلفته صفر على الزائر.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

for (const item of caseEvidenceLibrary) {
  if (!SLUG_PATTERN.test(item.id)) {
    throw new Error(
      `[cases.ts] Case id "${item.id}" is not URL-safe. ` +
      `Ids become page paths, so they must be lowercase letters, digits and ` +
      `single hyphens (e.g. "wannacry-analysis"). Spaces, uppercase letters ` +
      `and punctuation break generateStaticParams with output: "export".`,
    );
  }
}

const seen = new Set<string>();
for (const item of caseEvidenceLibrary) {
  if (seen.has(item.id)) {
    // ids مكررة معناها إن صفحة بتتكتب فوق التانية وقت الـ export
    throw new Error(`[cases.ts] Duplicate case id "${item.id}".`);
  }
  seen.add(item.id);
}

/*
 * ── أعداد محسوبة ──────────────────────────────────────────────────────
 *
 * الأعداد دي كانت مكتوبة بإيد في مكانين وبقيمتين مختلفتين:
 *
 *   StartHere.tsx  →  caseEvidenceLibrary.length = 42 "investigation reports"
 *   cv.ts          →  "Published 38 investigation reports"
 *
 * الاتنين مش دقيقين:
 *
 *   · الـ 42 بيعدّ **كل** حاجة في المكتبة على إنها "تقرير تحقيق" — بما
 *     فيها ٦ write-ups و٥ مشيات (walkthroughs) وعنصر نوعه "Achievement".
 *   · الـ 38 مش مطابق لأي عدّة في الداتا أصلاً.
 *
 * العدّ الحقيقي:
 *
 *     42  إجمالي العناصر في المكتبة
 *     32  اللي ليهم ملف PDF
 *     30  اللي نوعها تقرير فعلاً   ← ده "investigation reports"
 *
 * دلوقتي الرقمين بيتحسبوا من الداتا، فمستحيل يقدموا أو يتناقضوا.
 */
const REPORT_TYPES = new Set([
  "PDF Report",
  "DOCX & PDF Report",
  "PDF & DOCX Report",
  "Report",
]);

/** إجمالي العناصر المنشورة في المكتبة (تقارير + write-ups + مشيات) */
export const publishedCaseCount = caseEvidenceLibrary.length;

/** اللي نوعها تقرير تحقيق فعلاً — أضيق وأدق من العدد الكلي */
export const investigationReportCount = caseEvidenceLibrary.filter((c) =>
  REPORT_TYPES.has(c.type),
).length;
