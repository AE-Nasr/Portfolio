/*
 * Part of splitting up portfolio.ts (which was 70KB in a single module).
 * Everything here moved across verbatim — no change to the data itself,
 * only the split.
 *
 * Why? layout.tsx imported knowledgeEducationItems from the big file, and
 * that dragged all 38 cases, every screenshot and every YouTube video into
 * the same module graph — on every page, including the ones that need none
 * of it. Relying on tree-shaking to separate them works in theory, but with
 * one module holding everything it is a bet rather than a guarantee.
 * Separate files make the separation real.
 *
 * portfolio.ts still exists as a re-exporting barrel, so every existing
 * import keeps working and nothing broke.
 */

// -----------------------------------------------------------------------------
// Projects (from projects.ts)
// -----------------------------------------------------------------------------

export const GITHUB_USERNAME = "AE-Nasr";

export const projectBullets: Record<string, string[]> = {
  "SOC-Environment": [
    "Merged a custom Wazuh detection rule into the open-source SOC Fortress repo via a reviewed PR.",
    "Deployed a Wazuh/Suricata/Zeek/YARA/FIM/auditd/Sysmon lab, expanding detection coverage by 12% across 5+ endpoints.",
    "Simulated 50+ attacks to validate detection rules, achieving a 95%+ true positive rate across TTPs."
  ],
  "insider-threat-detection-deception": [
    "Built a Wazuh honeytoken insider threat lab, detecting 100% of access attempts across 3 scenarios.",
    "Integrated pfSense and Suricata for monitoring, reducing false positive volume by 30% from baseline.",
    "Developed a Python script to hash files, query VirusTotal, and auto-delete files flagged as malicious."
  ],
  "Malware-Analysis-and-Prevention-Strategy": [
    "Deployed an isolated lab, analyzing 20+ malware samples (5+ ransomware) and extracting actionable IOCs.",
    "Used FakeNet-NG and Process Hacker/Explorer for dynamic analysis to uncover C2 traffic behaviors.",
    "Engineered a custom PDF parsing utility to detect and extract embedded JavaScript payloads, downloaded by 18+ users."
  ],
  "Attack-Simulation-Security-Assessment": [
    "Conducted 15+ attack simulations on Metasploitable 2/3 and DVWA using Kali Linux and Nessus.",
    "Applied the Cyber Kill Chain & MITRE ATT&CK to document paths, assess impact, and recommend fixes."
  ],
  "Threat-Intelligence-Tool": [
    "Developed a Python-based threat intelligence utility integrating VirusTotal, Hybrid Analysis, NIST for CVEs, and Exploit DB.",
    "Achieved 10 stars on GitHub, demonstrating community interest and utility in centralizing security data."
  ],
  "Compliance-Framework": [
    "Developed an AI-driven GRC platform centralizing Risk, AppSec, Audit, and Privacy operations.",
    "Accelerated assessments by 15% via automated control mapping across 150+ frameworks (ISO, NIST, PCI DSS, GDPR).",
    "Streamlined continuous compliance by automating evidence validation from security scans and configs."
  ],
  // من الـ CV — كان مشروع كامل غايب عن قايمة المشاريع، وهو الموقع نفسه.
  "Portfolio": [
    "Developed and deployed a technical portfolio & blog, attracting 1,200+ organic visitors.",
    "Published 40+ security cases, CTFs, and complex lab solutions, earning 22+ GitHub stars from the security community."
  ]
};

export const staticProjectFallback = [
  {
    id: 1,
    name: "SOC-Environment",
    description: "Enterprise SOC environment integrating Wazuh, Suricata, Zeek, YARA, FIM, auditd, and Sysmon, with a merged PR into the open-source SOC Fortress repo.",
    language: "Shell",
    html_url: "https://github.com/AE-Nasr/SOC-Environment",
    homepage: "",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: "2026-04-15T10:00:00Z",
    created_at: "2025-10-10T10:00:00Z",
    owner: { login: "AE-Nasr", avatar_url: "https://github.com/AE-Nasr.png" },
    topics: ["soc", "siem", "elk", "wazuh", "monitor", "alert"],
    default_branch: "main",
    watchers_count: 0,
    license: { name: "MIT License" }
  },
  {
    id: 2,
    name: "insider-threat-detection-deception",
    description: "Lab environment for detecting insider threats using deception techniques and honeypots.",
    language: "Python",
    html_url: "https://github.com/AE-Nasr/insider-threat-detection-deception",
    homepage: "",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: "2026-03-10T10:00:00Z",
    created_at: "2025-08-20T10:00:00Z",
    owner: { login: "AE-Nasr", avatar_url: "https://github.com/AE-Nasr.png" },
    topics: ["soc", "threat-hunting", "monitor", "incident"],
    default_branch: "main",
    watchers_count: 0,
    license: null
  },
  {
    id: 3,
    name: "Malware-Analysis-and-Prevention-Strategy",
    description: "In-depth analysis of malware samples extracting IOCs and deploying YARA rules.",
    language: "Python",
    html_url: "https://github.com/AE-Nasr/Malware-Analysis-and-Prevention-Strategy",
    homepage: "",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: "2026-05-20T10:00:00Z",
    created_at: "2025-11-15T10:00:00Z",
    owner: { login: "AE-Nasr", avatar_url: "https://github.com/AE-Nasr.png" },
    topics: ["malware", "dfir", "forensic", "yara", "incident", "response"],
    default_branch: "main",
    watchers_count: 0,
    license: { name: "MIT License" }
  },
  {
    id: 4,
    name: "Attack-Simulation-Security-Assessment",
    description: "End-to-end attack simulation and assessment lab across Metasploitable and DVWA.",
    language: "Shell",
    html_url: "https://github.com/AE-Nasr/Attack-Simulation-Security-Assessment",
    homepage: "",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: "2026-06-10T10:00:00Z",
    created_at: "2026-01-10T10:00:00Z",
    owner: { login: "AE-Nasr", avatar_url: "https://github.com/AE-Nasr.png" },
    topics: ["vapt", "metasploit", "nessus", "simulation"],
    default_branch: "main",
    watchers_count: 0,
    license: null
  },
  {
    id: 5,
    name: "Threat-Intelligence-Tool",
    description: "Python-based threat intelligence platform integrating VirusTotal, Hybrid Analysis, NIST CVEs, and Exploit DB.",
    language: "Python",
    html_url: "https://github.com/AE-Nasr/Threat-Intelligence-Tool",
    homepage: "https://youtu.be/u_hezaAwnmM",
    stargazers_count: 10,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: "2026-02-25T10:00:00Z",
    created_at: "2025-12-05T10:00:00Z",
    owner: { login: "AE-Nasr", avatar_url: "https://github.com/AE-Nasr.png" },
    topics: ["threat-intelligence", "python", "virustotal", "hybrid-analysis", "nist", "exploit-db"],
    default_branch: "main",
    watchers_count: 0,
    license: { name: "MIT License" }
  },
  {
    id: 6,
    name: "Compliance-Framework",
    description: "AI-driven GRC platform (VerifAI 360) centralizing Risk, AppSec, Audit, and Privacy operations with automated control mapping across 150+ frameworks.",
    language: "Python",
    html_url: "https://github.com/AE-Nasr/Compliance-Framework",
    homepage: "https://youtu.be/G-Ys6VuV91g",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: "2026-06-01T10:00:00Z",
    created_at: "2026-01-01T10:00:00Z",
    owner: { login: "AE-Nasr", avatar_url: "https://github.com/AE-Nasr.png" },
    topics: ["grc", "ai", "compliance", "risk", "security-automation"],
    default_branch: "main",
    watchers_count: 0,
    license: { name: "MIT License" }
  },
  {
    id: 7,
    name: "PDFparser-tool",
    description: "PDF parser tool optimized for static malware analysis and document forensics.",
    language: "Python", 
    html_url: "https://github.com/AE-Nasr/3omda-PDFparser-tool",
    homepage: "",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: "2026-07-20T10:00:00Z", 
    created_at: "2026-07-20T10:00:00Z", 
    owner: { login: "AE-Nasr", avatar_url: "https://github.com/AE-Nasr.png" },
    topics: ["malware-analysis", "pdf-parser", "security", "forensics"],
    default_branch: "main",
    watchers_count: 0,
    license: null
  },
  {
    // من الـ CV — repo الموقع نفسه، مبني على SITE_BASE_URL في site.ts.
    id: 8,
    name: "Portfolio",
    description: "Cybersecurity portfolio & technical blog built with Next.js, publishing SOC/DFIR case studies and CTF writeups.",
    language: "TypeScript",
    html_url: "https://github.com/AE-Nasr/Portfolio",
    homepage: "https://ae-nasr.github.io/Portfolio/",
    stargazers_count: 22,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: "2026-09-01T10:00:00Z",
    created_at: "2025-09-01T10:00:00Z",
    owner: { login: "AE-Nasr", avatar_url: "https://github.com/AE-Nasr.png" },
    topics: ["nextjs", "portfolio", "blog", "cybersecurity", "soc", "dfir"],
    default_branch: "main",
    watchers_count: 0,
    license: null
  }
] as const;
