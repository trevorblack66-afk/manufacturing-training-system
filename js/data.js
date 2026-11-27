// Fictional portfolio demonstration data.
// No records in this file represent real people, employers, processes, or proprietary information.
const DEMO_DATA = {
  employees: [
    {id:"EMP-101", name:"Maya Torres", department:"Assembly", shift:"A", role:"Assembly Technician", hireDate:"2022-03-14", trainer:"Jordan Lee", progress:92, goals:"Cross-train on Final Inspection; develop coaching skills."},
    {id:"EMP-102", name:"Elijah Brooks", department:"Assembly", shift:"A", role:"Team Lead", hireDate:"2020-08-03", trainer:"Jordan Lee", progress:100, goals:"Prepare for shift supervisor development path."},
    {id:"EMP-103", name:"Priya Shah", department:"Quality", shift:"A", role:"Quality Technician", hireDate:"2021-11-22", trainer:"Morgan Reed", progress:86, goals:"Complete inspection verification certification."},
    {id:"EMP-104", name:"Theo Morgan", department:"Packaging", shift:"A", role:"Packaging Operator", hireDate:"2023-02-06", trainer:"Sam Chen", progress:68, goals:"Improve changeover documentation skills."},
    {id:"EMP-105", name:"Nora Kim", department:"Maintenance", shift:"A", role:"Maintenance Associate", hireDate:"2019-05-18", trainer:"Avery Grant", progress:95, goals:"Learn planning and PM workflow reviews."},
    {id:"EMP-106", name:"Caleb Davis", department:"Assembly", shift:"B", role:"Assembly Technician", hireDate:"2024-01-08", trainer:"Morgan Reed", progress:54, goals:"Build confidence across core assembly skills."},
    {id:"EMP-107", name:"Lena Ortiz", department:"Packaging", shift:"B", role:"Packaging Technician", hireDate:"2022-07-25", trainer:"Sam Chen", progress:78, goals:"Qualify for line support and trainer observations."},
    {id:"EMP-108", name:"Owen Patel", department:"Quality", shift:"B", role:"Quality Inspector", hireDate:"2023-09-12", trainer:"Morgan Reed", progress:73, goals:"Complete audit and nonconformance practice."},
    {id:"EMP-109", name:"Amara Wilson", department:"Maintenance", shift:"B", role:"Maintenance Technician", hireDate:"2021-04-19", trainer:"Avery Grant", progress:88, goals:"Expand skill coverage on preventive routines."},
    {id:"EMP-110", name:"Jon Bell", department:"Assembly", shift:"C", role:"Assembly Technician", hireDate:"2025-02-10", trainer:"Jordan Lee", progress:41, goals:"Complete onboarding and two core qualifications."},
    {id:"EMP-111", name:"Sofia Nguyen", department:"Packaging", shift:"C", role:"Packaging Lead", hireDate:"2020-10-30", trainer:"Sam Chen", progress:100, goals:"Coach new trainers and standardize handoffs."},
    {id:"EMP-112", name:"Marcus Green", department:"Quality", shift:"C", role:"Quality Technician", hireDate:"2022-12-01", trainer:"Morgan Reed", progress:64, goals:"Strengthen measurement and reporting consistency."}
  ],
  skills: [
    {id:"SK-01", name:"Component Assembly"}, {id:"SK-02", name:"Visual Verification"},
    {id:"SK-03", name:"Packaging Standard"}, {id:"SK-04", name:"Label & Lot Control"},
    {id:"SK-05", name:"Preventive Routine"}, {id:"SK-06", name:"Process Audit"}
  ],
  skillStatuses: {
    "EMP-101":["Qualified","Trainer Qualified","Qualified","Qualified","In Training","Not Started"],
    "EMP-102":["Trainer Qualified","Qualified","Qualified","Qualified","Qualified","Qualified"],
    "EMP-103":["Qualified","Trainer Qualified","In Training","Qualified","Not Started","Trainer Qualified"],
    "EMP-104":["In Training","Not Started","Trainer Qualified","Qualified","Not Started","Not Started"],
    "EMP-105":["Qualified","Qualified","Qualified","Qualified","Trainer Qualified","Qualified"],
    "EMP-106":["In Training","In Training","Not Started","Qualified","Not Started","Not Started"],
    "EMP-107":["Qualified","Qualified","Trainer Qualified","Qualified","In Training","Not Started"],
    "EMP-108":["Qualified","Qualified","In Training","Trainer Qualified","Not Started","Qualified"],
    "EMP-109":["Qualified","Qualified","Qualified","Qualified","Trainer Qualified","In Training"],
    "EMP-110":["In Training","Not Started","Not Started","In Training","Not Started","Not Started"],
    "EMP-111":["Qualified","Qualified","Trainer Qualified","Trainer Qualified","Qualified","Qualified"],
    "EMP-112":["In Training","Qualified","Qualified","Qualified","Not Started","In Training"]
  },
  qualifications: [
    {employeeId:"EMP-101", skill:"Component Assembly", qualificationDate:"2025-08-12", renewalDate:"2027-08-12", trainer:"Jordan Lee", status:"Current"},
    {employeeId:"EMP-102", skill:"Component Assembly", qualificationDate:"2023-04-09", renewalDate:"2026-12-15", trainer:"Jordan Lee", status:"Expiring Soon"},
    {employeeId:"EMP-103", skill:"Visual Verification", qualificationDate:"2024-01-18", renewalDate:"2026-12-01", trainer:"Morgan Reed", status:"Expiring Soon"},
    {employeeId:"EMP-104", skill:"Packaging Standard", qualificationDate:"2025-10-02", renewalDate:"2027-10-02", trainer:"Sam Chen", status:"Current"},
    {employeeId:"EMP-105", skill:"Preventive Routine", qualificationDate:"2023-02-15", renewalDate:"2025-02-15", trainer:"Avery Grant", status:"Expired"},
    {employeeId:"EMP-106", skill:"Label & Lot Control", qualificationDate:"2026-05-20", renewalDate:"2028-05-20", trainer:"Morgan Reed", status:"Current"},
    {employeeId:"EMP-107", skill:"Packaging Standard", qualificationDate:"2024-06-11", renewalDate:"2026-12-20", trainer:"Sam Chen", status:"Expiring Soon"},
    {employeeId:"EMP-108", skill:"Process Audit", qualificationDate:"2025-03-28", renewalDate:"2027-03-28", trainer:"Morgan Reed", status:"Current"},
    {employeeId:"EMP-109", skill:"Preventive Routine", qualificationDate:"2024-11-06", renewalDate:"2026-11-30", trainer:"Avery Grant", status:"Expiring Soon"},
    {employeeId:"EMP-110", skill:"Component Assembly", qualificationDate:"", renewalDate:"", trainer:"Jordan Lee", status:"In Training"},
    {employeeId:"EMP-111", skill:"Label & Lot Control", qualificationDate:"2023-07-14", renewalDate:"2026-12-30", trainer:"Sam Chen", status:"Expiring Soon"},
    {employeeId:"EMP-112", skill:"Visual Verification", qualificationDate:"2026-09-02", renewalDate:"2028-09-02", trainer:"Morgan Reed", status:"Current"},
    {employeeId:"EMP-112", skill:"Process Audit", qualificationDate:"", renewalDate:"", trainer:"Morgan Reed", status:"Not Qualified"}
  ],
  trainingModules: [
    {id:"TM-101", title:"Component Assembly Fundamentals", purpose:"Introduce learners to the generic fictional sequence for preparing, assembling, and verifying a standard component unit.",
      steps:["Review the work-area condition and required visual aids","Confirm materials match the documented batch card","Complete the assembly sequence using the approved standardized work","Perform the learner demonstration and documented self-check"],
      keyPoints:["Follow one standard sequence","Stop and seek guidance when an item is unclear","Keep process deviations visible and documented"], reasons:["Reduces variation, improves repeatability, and makes defects easier to detect."],
      safety:["Use only general area, ergonomics, material-handling, and PPE practices demonstrated by site leadership. This fictional portfolio module does not describe real equipment operation."],
      trainerChecklist:["Explain purpose and scope","Observe setup and sequence","Ask learner to identify two escalation points","Document verification"], learnerChecklist:["Explain the standard sequence","Complete demonstration accurately","Identify stop-work conditions","Sign practice acknowledgment"]},
    {id:"TM-102", title:"Visual Verification Basics", purpose:"Teach a consistent, fictional method for visual examination and documentation.",
      steps:["Review the known accept and reject examples","Set up the work area under normal review conditions","Complete a guided review of practice samples","Explain and record each disposition"], keyPoints:["Use agreed criteria","Do not improvise missing acceptance limits","Document observations consistently"], reasons:["Standard reviews support quality and make coaching easier."], safety:["Use appropriate eye protection and ergonomic practices defined by fictional local policy. No real inspection instrument settings are provided."], trainerChecklist:["Review criteria with learner","Present representative practice samples","Observe documentation","Confirm follow-up needs"], learnerChecklist:["Describe acceptance criteria","Complete practice samples","Record disposition rationale","Request clarification appropriately"]},
    {id:"TM-103", title:"Packaging and Label Standard", purpose:"Practice the standard fictional sequence for product presentation, label review, and lot traceability.",
      steps:["Verify the generic production and label documents","Confirm contents against a practice count sheet","Apply the fictional packaging sequence","Perform independent review before release"], keyPoints:["Lot and label information must match","Separate good and hold items","Record changes and exceptions"], reasons:["Clear packaging standards help prevent mix-ups and support traceability."], safety:["Maintain a clear walkway, use safe lifting practices, and report damaged materials according to fictional local procedures."], trainerChecklist:["Confirm understanding of labels","Observe count and review","Test exception recognition","Complete final verification"], learnerChecklist:["Match document and practice item","Complete count accurately","Identify an incorrect label example","Document review"]},
    {id:"TM-104", title:"Preventive Routine Fundamentals", purpose:"Build familiarity with generic, fictional preventive maintenance planning and documentation routines.",
      steps:["Review the planned routine card","Complete an awareness-level work-area check","Document completed and deferred items","Review findings with the assigned mentor"], keyPoints:["Only authorized personnel perform maintenance tasks","Do not bypass interlocks or safeguards","Report abnormalities immediately"], reasons:["Consistent routines improve planning and communication without replacing qualified maintenance procedures."], safety:["This module is awareness-only and provides no equipment operating or maintenance instructions. Follow official fictional site procedures and authorization boundaries."], trainerChecklist:["Confirm authorization and scope","Review record format","Observe communication of findings","Escalate incomplete work"], learnerChecklist:["Explain routine scope","Review a practice record","Identify items requiring escalation","Complete mentor review"]}
  ],
  improvementIdeas: [
    {id:"CI-001", title:"Visual handoff checklist", category:"Standardization", currentIssue:"Shift handoffs vary in detail, which can hide open actions.", proposedImprovement:"Use one shared visual checklist for open work and unresolved items.", expectedBenefit:"More consistent handoffs and fewer missed actions.", status:"Under Review", submittedBy:"Maya Torres", submittedDate:"2026-11-18"},
    {id:"CI-002", title:"Training material refresh labels", category:"Training", currentIssue:"Learners sometimes use outdated practice aids.", proposedImprovement:"Add revision and owner labels to all standardized practice aids.", expectedBenefit:"Reduced use of obsolete materials.", status:"Trial", submittedBy:"Priya Shah", submittedDate:"2026-11-10"},
    {id:"CI-003", title:"Ergonomic reach improvement", category:"Safety", currentIssue:"Practice stations require repeated long reaches.", proposedImprovement:"Pilot adjusted staging locations at a low-risk sample station.", expectedBenefit:"Lower repetitive reach effort and improved setup flow.", status:"Submitted", submittedBy:"Nora Kim", submittedDate:"2026-11-23"},
    {id:"CI-004", title:"First-piece review coaching", category:"Quality", currentIssue:"New team members receive inconsistent first-piece review coaching.", proposedImprovement:"Create a standard coaching observation card.", expectedBenefit:"More consistent verification and faster feedback.", status:"Implemented", submittedBy:"Owen Patel", submittedDate:"2026-10-02"},
    {id:"CI-005", title:"Packaging setup lane marking", category:"Productivity", currentIssue:"Practice materials are mixed across setup lanes.", proposedImprovement:"Use simple color-coded floor marks for fictional staging zones.", expectedBenefit:"Faster setup and fewer misplaced practice items.", status:"Under Review", submittedBy:"Sofia Nguyen", submittedDate:"2026-11-15"},
    {id:"CI-006", title:"Recognition for peer coaching", category:"Employee Experience", currentIssue:"Peer coaching contributions are not consistently recognized.", proposedImprovement:"Add peer coaching contributions to monthly team recognition.", expectedBenefit:"Encourage knowledge sharing and skill development.", status:"Submitted", submittedBy:"Elijah Brooks", submittedDate:"2026-11-21"}
  ]
};

function getFreshDemoData() {
  return JSON.parse(JSON.stringify(DEMO_DATA));
}
