/*
 * core/config/skills.ts
 * Author: Ahmed Emad Nasr
 *
 * The skill taxonomy from the CV. The site used to show skills only as tags
 * scattered inside individual roles and cases — there was no single place
 * saying "this is what I work with".
 *
 * The advantage of it being data rather than JSX: each group carries
 * `evidence` — the ids of the cases that demonstrate that skill. That turns
 * a skills list (a claim) into an evidence graph (a demonstration). Start by
 * linking the ones you are confident about; the rest render normally without
 * links.
 *
 * The ids must match `caseEvidenceLibrary[].id` in config/cases.ts.
 */

export type SkillGroup = {
  id: string;
  /** Group name exactly as it appears in the CV */
  label: string;
  items: readonly string[];
  /*
   * The cases that demonstrate this group.
   *
   * The label is written out here rather than looked up from
   * caseEvidenceLibrary on purpose: the component that renders skills is a
   * client component, so importing the case library would have bundled
   * 42KB of blog data into the home page just to read 13 titles. This
   * small amount of duplication is far cheaper.
   *
   * The id must match caseEvidenceLibrary[].id — if you change an id in
   * cases.ts, change it here too, or the link becomes a 404.
   */
  evidence?: readonly { id: string; label: string }[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "siem",
    label: "SIEM & Security Monitoring",
    items: ["Wazuh", "ELK Stack", "Splunk", "Security Onion", "Sysmon", "auditd", "Threat Intelligence"],
    evidence: [
      { id: "3omda-custom-detection-rules", label: "Custom Wazuh detection rules" },
      { id: "soc-env-depi-r3-project", label: "SOC environment build" },
    ],
  },
  {
    id: "ir",
    label: "Incident Response & Threat Detection",
    items: ["Security Monitoring", "Incident Detection", "Alert Triage", "IOC Analysis", "Log Analysis", "Incident Response"],
    evidence: [
      { id: "soc326-report", label: "SOC326 — full IR lifecycle" },
      { id: "soc336-report", label: "SOC336 — APT persistence" },
      { id: "soc274-pdf", label: "SOC274 — lateral movement" },
    ],
  },
  {
    id: "identity",
    label: "Identity & Access Security",
    items: ["IAM", "PAM", "DAM", "RBAC", "ABAC", "Access Control"],
    evidence: [
      { id: "iam-access-control-room", label: "IAM & access control" },
      { id: "aws-kms-security", label: "AWS KMS key management" },
    ],
  },
  {
    id: "automation",
    label: "Programming & Automation",
    items: ["Python", "Bash", "PowerShell", "Regex"],
  },
  {
    id: "network",
    label: "Networking & Network Security",
    items: ["TCP/IP", "VPN", "Packet Analysis", "IDS/IPS", "Suricata", "Zeek", "Wireshark", "pfSense"],
    evidence: [
      { id: "ettercap-case", label: "EtterCap MITM analysis" },
      { id: "malicious-web-traffic-room-report", label: "Malicious web traffic" },
    ],
  },
  {
    id: "forensics",
    label: "Malware Analysis & Forensics",
    items: ["Volatility", "Autopsy", "PEStudio", "CFF Explorer", "YARA", "FakeNet-NG", "Process Hacker"],
    evidence: [
      { id: "data-exfiltration-investigation", label: "Memory forensics — exfiltration" },
      { id: "autopsy", label: "Autopsy data recovery" },
      { id: "ecir-registry-forensics", label: "Windows registry forensics" },
      { id: "malware-analysis-wannacry", label: "WannaCry analysis & response" },
    ],
  },
  {
    id: "frameworks",
    label: "Security Frameworks",
    items: ["MITRE ATT&CK", "NIST CSF", "NIST 800-61", "NIST 800-53", "Cyber Kill Chain", "ISO 27001", "PCI DSS"],
  },
  {
    id: "os",
    label: "Operating Systems",
    items: ["Windows", "Windows Server", "Ubuntu", "Kali Linux", "Arch Linux"],
  },
  {
    // من الـ CV — مجموعة كاملة كانت غايبة عن الموقع.
    id: "soft",
    label: "Soft Skills",
    items: ["Analytical Thinking", "Problem Solving", "Team Collaboration", "Communication", "Adaptability", "Attention to Detail"],
  },
];

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Professional working proficiency" },
] as const;
