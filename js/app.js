"use strict";

const STORAGE_KEY = "manufacturing-training-demo-v1";
let demo = loadDemo();

function loadDemo(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){ try { return JSON.parse(saved); } catch(e) {} }
  return getFreshDemoData();
}
function saveDemo(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(demo)); }
function escapeHtml(value){ return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char])); }
function getEmployee(id){ return demo.employees.find(employee => employee.id === id); }
function slug(value){ return String(value).toLowerCase().replace(/[^a-z0-9]+/g,"-"); }
function statusBadge(status){ return `<span class="status-badge status-${slug(status)}">${escapeHtml(status)}</span>`; }
function formatDate(value){ if(!value) return "—"; const date = new Date(`${value}T00:00:00`); return date.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); }

const titleMap={dashboard:"Dashboard",employees:"Employees",matrix:"Skills Matrix",training:"Training Center",qualifications:"Qualification Management",improvements:"Continuous Improvement",gaps:"Training Gap Analysis",analytics:"Analytics"};

function showSection(section){
  document.querySelectorAll(".page-section").forEach(node=>node.classList.toggle("active",node.id===section));
  document.querySelectorAll(".nav-item").forEach(node=>node.classList.toggle("active",node.dataset.section===section));
  document.getElementById("pageTitle").textContent=titleMap[section];
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("menuButton").setAttribute("aria-expanded","false");
  if(section==="dashboard") renderDashboard();
}

function renderDashboard(){
  const qualifications=getCalculatedQualifications();
  const qualified=demo.employees.filter(employee=>calculateEmployeeProgress(employee)>=90).length;
  const inTraining=qualifications.filter(q=>q.status==="In Training").length;
  const expiring=qualifications.filter(q=>q.status==="Expiring Soon").length;
  const openIdeas=getOpenImprovementIdeas().length;
  const kpis=[
    ["Total Employees",demo.employees.length,"Across 4 departments"],["Fully Qualified",qualified,"90%+ progress"],
    ["Training In Progress",inTraining,"Active qualifications"],["Expiring Soon",expiring,"Renewals needed"],["Open Improvement Ideas",openIdeas,"Not yet implemented"]
  ];
  document.getElementById("kpiGrid").innerHTML=kpis.map(([label,value,note])=>`<article class="kpi-card"><span>${label}</span><strong>${value}</strong><em>${note}</em></article>`).join("");

  const avg=demo.employees.reduce((sum,e)=>sum+e.progress,0)/demo.employees.length;
  document.getElementById("trainingOverview").innerHTML=`<div class="data-row"><div><strong>${Math.round(avg)}% average progress</strong><small>${demo.employees.filter(e=>e.progress===100).length} employees at 100%</small></div><strong>${demo.employees.filter(e=>e.progress<70).length} at-risk</strong></div><div class="progress-track"><span style="width:${avg}%"></span></div><div class="data-list">${demo.employees.slice(0,5).map(e=>`<div class="data-row"><div><strong>${escapeHtml(e.name)}</strong><small>${escapeHtml(e.department)} · Shift ${escapeHtml(e.shift)}</small></div><div style="width:110px"><div class="progress-track"><span style="width:${e.progress}%"></span></div><small>${e.progress}%</small></div></div>`).join("")}</div>`;

  document.getElementById("qualificationAlerts").innerHTML=qualifications.filter(q=>["Expiring Soon","Expired","In Training"].includes(q.status)).slice(0,6).map(q=>{const employee=getEmployee(q.employeeId);return `<div class="data-row"><div><strong>${escapeHtml(employee?.name||q.employeeId)}</strong><small>${escapeHtml(q.skill)} · ${q.renewalDate?formatDate(q.renewalDate):"No date"}</small></div>${statusBadge(q.status)}</div>`;}).join("")||`<p>No active qualification alerts.</p>`;

  document.getElementById("recentActivity").innerHTML=[
    ["Maya Torres","Completed practice review","Nov 25, 2026"],["Theo Morgan","Started Packaging Standard","Nov 24, 2026"],["Marcus Green","Qualification observation scheduled","Nov 22, 2026"],["Priya Shah","Renewal review submitted","Nov 20, 2026"]
  ].map(([name,activity,date])=>`<div class="data-row"><div><strong>${name}</strong><small>${activity}</small></div><small>${date}</small></div>`).join("");

  document.getElementById("itemsAttention").innerHTML=`<div class="data-row"><div><strong>${qualifications.filter(q=>q.status==="Expired").length} expired qualifications</strong><small>Require retraining or renewal review</small></div><span class="status-badge status-expired">Review</span></div><div class="data-row"><div><strong>${demo.employees.filter(e=>calculateEmployeeProgress(e)<DEMO_DATA.demoSettings.trainingProgressThreshold).length} employees below ${DEMO_DATA.demoSettings.trainingProgressThreshold}% progress</strong><small>May need additional coaching</small></div><span class="status-badge status-expiring-soon">Monitor</span></div><div class="data-row"><div><strong>${demo.improvementIdeas.filter(i=>i.status==="Submitted").length} submitted ideas awaiting review</strong><small>Continuous improvement backlog</small></div><span class="status-badge status-in-training">Act</span></div>`;
}

function renderEmployees(){
  const search=document.getElementById("employeeSearch")?.value.trim().toLowerCase()||"";
  const department=document.getElementById("employeeDepartment")?.value||"";
  const shift=document.getElementById("employeeShift")?.value||"";
  const role=document.getElementById("employeeRole")?.value||"";
  const status=document.getElementById("employeeStatus")?.value||"";
  const filtered=demo.employees.filter(e=>(!department||e.department===department)&&(!shift||e.shift===shift)&&(!role||e.role===role)&&(!search||`${e.name} ${e.id} ${e.role}`.toLowerCase().includes(search))&&(!status||(status==="complete"&&e.progress>=90)||(status==="progress"&&e.progress>=70&&e.progress<90)||(status==="support"&&e.progress<70)));
  document.getElementById("employeeCount").textContent=`${filtered.length} result${filtered.length===1?"":"s"}`;
  document.getElementById("employeeGrid").innerHTML=filtered.map(e=>`<article class="employee-card"><h3>${escapeHtml(e.name)}</h3><div class="employee-meta">${escapeHtml(e.id)} · ${escapeHtml(e.department)} · Shift ${escapeHtml(e.shift)}</div><div class="employee-detail"><div><span>Role</span><strong>${escapeHtml(e.role)}</strong></div><div><span>Assigned Trainer</span><strong>${escapeHtml(e.trainer)}</strong></div><div><span>Hire Date</span><strong>${formatDate(e.hireDate)}</strong></div><div><span>Training Progress</span><strong>${e.progress}%</strong></div></div><div class="progress-track" aria-label="${e.progress}% training progress"><span style="width:${e.progress}%"></span></div><div style="margin-top:12px"><span class="eyebrow">Development goal</span><p style="font-size:13px;margin:6px 0">${escapeHtml(e.goals)}</p></div><button class="secondary-button" data-employee="${e.id}">View profile</button></article>`).join("")||`<div class="empty-state"><strong>No employees found</strong><p>Try adjusting or resetting the employee filters.</p></div>`;
}

function openEmployeeProfile(id){
  const e=getEmployee(id); if(!e)return;
  document.getElementById("employeeDialogTitle").textContent=e.name;
  const qualifications=e.qualifications||[]; const assignments=e.assignments||[]; const activity=e.activity||[];
  document.getElementById("employeeDialogContent").innerHTML=`<div class="profile-overview"><div><span class="eyebrow">Employee overview</span><p><strong>${escapeHtml(e.id)}</strong> · ${escapeHtml(e.role)} · ${escapeHtml(e.department)} · Shift ${escapeHtml(e.shift)}</p><p>Hire date: ${formatDate(e.hireDate)} · Assigned trainer: ${escapeHtml(e.trainer)}</p></div></div><div class="profile-section"><h3>Training progress</h3><div class="progress-track"><span style="width:${e.progress}%"></span></div><strong>${e.progress}% complete</strong></div><div class="profile-section"><h3>Qualification status</h3>${qualifications.map(q=>`<div class="data-row"><span>${escapeHtml(q)}</span></div>`).join("")||"<p>No qualifications recorded.</p>"}</div><div class="profile-section"><h3>Current assignments</h3><ul class="module-detail-list">${assignments.map(a=>`<li>${escapeHtml(a)}</li>`).join("")||"<li>No current assignments.</li>"}</ul></div><div class="profile-section"><h3>Development goals</h3><p>${escapeHtml(e.goals)}</p></div><div class="profile-section"><h3>Recent training activity</h3>${activity.map(a=>`<div class="data-row"><strong>${escapeHtml(a.text)}</strong><small>${formatDate(a.date)}</small></div>`).join("")||"<p>No recent activity.</p>"}</div>`;
  document.getElementById("employeeDialog").showModal();
}

function renderMatrix(){
  const search=document.getElementById("matrixSearch")?.value.trim().toLowerCase()||"";
  const department=document.getElementById("matrixDepartment")?.value||"";
  const shift=document.getElementById("matrixShift")?.value||"";
  const employeeId=document.getElementById("matrixEmployee")?.value||"";
  const skillId=document.getElementById("matrixSkill")?.value||"";
  const status=document.getElementById("matrixStatus")?.value||"";
  if(document.getElementById("matrixSkill").options.length<=1) document.getElementById("matrixSkill").innerHTML=`<option value="">All skills</option>`+demo.skills.map(s=>`<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
  let employees=demo.employees.filter(e=>(!department||e.department===department)&&(!shift||e.shift===shift)&&(!employeeId||e.id===employeeId)&&(!search||`${e.name} ${e.id}`.toLowerCase().includes(search)));
  let skills=skillId?demo.skills.filter(s=>s.id===skillId):demo.skills;
  if(status) employees=employees.filter(e=>demo.skillStatuses[e.id].some((value,index)=>(!skillId||demo.skills[index].id===skillId)&&value===status));
  document.getElementById("matrixCount").textContent=`${employees.length} employee${employees.length===1?"":"s"} · ${skills.length} process${skills.length===1?"":"es"}`;
  const thead=`<tr><th scope="col">Employee</th>${skills.map(s=>`<th scope="col">${escapeHtml(s.name)}</th>`).join("")}</tr>`;
  const tbody=employees.map(e=>`<tr><td><strong>${escapeHtml(e.name)}</strong><br><small>${escapeHtml(e.department)} · Shift ${escapeHtml(e.shift)}</small></td>${skills.map(s=>{const index=demo.skills.findIndex(x=>x.id===s.id);const value=demo.skillStatuses[e.id]?.[index]||"Not Started";return `<td class="matrix-cell"><button class="matrix-dot status-${slug(value)}" data-matrix-employee="${e.id}" data-matrix-skill="${s.id}" title="${escapeHtml(value)} for ${escapeHtml(e.name)} — select for details" aria-label="${escapeHtml(e.name)}, ${escapeHtml(s.name)}, ${escapeHtml(value)}">${escapeHtml(value)}</button></td>`;}).join("")}</tr>`).join("");
  document.querySelector("#skillsMatrix thead").innerHTML=thead;
  document.querySelector("#skillsMatrix tbody").innerHTML=tbody||`<tr><td colspan="${skills.length+1}"><div class="empty-state"><strong>No matrix records found</strong><p>Try resetting or adjusting the matrix filters.</p></div></td></tr>`;
  document.getElementById("matrixLegend").innerHTML=["Trainer Qualified","Qualified","In Training","Not Started","Expiring Soon","Expired"].map(s=>`<span>${statusBadge(s)}</span>`).join("");
}

function openMatrixDetail(employeeId,skillId){
  const employee=getEmployee(employeeId); const skill=demo.skills.find(s=>s.id===skillId); if(!employee||!skill)return;
  const index=demo.skills.indexOf(skill); const status=demo.skillStatuses[employeeId]?.[index]||"Not Started";
  const qualification=demo.qualifications.find(q=>q.employeeId===employeeId&&q.skill===skill.name);
  document.getElementById("matrixDialogTitle").textContent=`${employee.name} — ${skill.name}`;
  document.getElementById("matrixDialogContent").innerHTML=`<div class="profile-section"><h3>Current status</h3>${statusBadge(status)}</div><div class="profile-section"><h3>Qualification details</h3><dl class="detail-list"><dt>Qualification date</dt><dd>${qualification?formatDate(qualification.qualificationDate):"Not available"}</dd><dt>Renewal date</dt><dd>${qualification?formatDate(qualification.renewalDate):"Not available"}</dd><dt>Trainer</dt><dd>${escapeHtml(qualification?.trainer||employee.trainer)}</dd><dt>Training progress</dt><dd>${employee.progress}%</dd></dl></div><p class="fictional-notice">This status is fictional portfolio data and is not a professional qualification or compliance determination.</p>`;
  document.getElementById("matrixDialog").showModal();
}

function getModuleChecklist(moduleId){ try{return JSON.parse(localStorage.getItem(`module-${moduleId}`)||"{}");}catch(e){return{};} }
function getModuleStatus(module){
  const state=getModuleChecklist(module.id); const items=[...(module.trainerChecklist||[]),...(module.learnerChecklist||[])]; const complete=items.filter((_,i)=>state[String(i)]).length;
  if(!complete)return "Not Started"; if(complete===items.length)return "Complete"; if(complete>=items.length*.5)return "Ready for Verification"; return "In Progress";
}
function renderTraining(){
  const search=document.getElementById("trainingSearch")?.value.trim().toLowerCase()||"";
  const category=document.getElementById("trainingCategory")?.value||"";
  const status=document.getElementById("trainingStatus")?.value||"";
  const modules=demo.trainingModules.filter(m=>(!category||m.category===category)&&(!search||`${m.id} ${m.title} ${m.purpose}`.toLowerCase().includes(search))&&(!status||getModuleStatus(m)===status));
  document.getElementById("trainingModules").innerHTML=modules.map((m,index)=>`<article class="module-card"><p class="eyebrow">${escapeHtml(m.id)} · ${escapeHtml(m.category||"General")}</p><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.purpose)}</p><div class="module-meta"><span>${escapeHtml(m.estimatedTime||"Time not specified")}</span><span>Revision ${escapeHtml(m.revision||"1.0")}</span></div><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="status-badge status-${slug(getModuleStatus(m))}">${getModuleStatus(m)}</span><button class="secondary-button" data-module="${demo.trainingModules.indexOf(m)}">Open module</button></div></article>`).join("")||`<div class="empty-state"><strong>No training modules found</strong><p>Try resetting or adjusting the training filters.</p></div>`;
}

function openModule(index){
  const m=demo.trainingModules[index]; const state=getModuleChecklist(m.id);
  document.getElementById("moduleDialogTitle").textContent=m.title;
  const sections=(title,items)=>`<div class="module-detail-section"><h3>${title}</h3><ul class="module-detail-list">${items.map(i=>`<li>${escapeHtml(i)}</li>`).join("")}</ul></div>`;
  const checklist=[...(m.trainerChecklist||[]).map((text,i)=>({text,type:"Trainer",key:`trainer-${i}`})),...(m.learnerChecklist||[]).map((text,i)=>({text,type:"Learner",key:`learner-${i}`}))];
  document.getElementById("moduleDialogContent").innerHTML=`<p>${escapeHtml(m.purpose)}</p><div class="module-meta"><span>Module ${escapeHtml(m.id)}</span><span>${escapeHtml(m.category||"General")}</span><span>${escapeHtml(m.estimatedTime||"Time not specified")}</span><span>Revision ${escapeHtml(m.revision||"1.0")}, ${formatDate(m.revisionDate)}</span></div>${sections("Required Prerequisites",m.prerequisites||["No prerequisite listed"])}${sections("Major Steps",m.steps)}${sections("Key Points",m.keyPoints)}${sections("Reasons",m.reasons)}${sections("General Safety Considerations",m.safety)}<div class="module-detail-section"><h3>Trainer & Learner Checklists</h3>${checklist.map(item=>`<label class="checklist-row"><input type="checkbox" data-check-module="${m.id}" data-check-key="${item.key}" ${state[item.key]?"checked":""}> <span><small>${item.type}</small>${escapeHtml(item.text)}</span></label>`).join("")}</div><p><strong>Verification requirements:</strong> ${escapeHtml(m.verification||"Trainer and learner verification")}</p><p class="fictional-notice">“This is a fictional training example and is not an operating procedure.”</p><div class="dialog-actions"><button type="button" class="secondary-button" id="resetModuleChecklist">Reset Checklist</button></div>`;
  document.getElementById("moduleDialog").showModal();
}

let qualificationSort={key:"renewal",direction:"asc"};
function renderQualifications(){
  const employee=document.getElementById("qualificationEmployee")?.value||"";
  const department=document.getElementById("qualificationDepartment")?.value||"";
  const skill=document.getElementById("qualificationSkill")?.value||"";
  const status=document.getElementById("qualificationStatus")?.value||"";
  const search=document.getElementById("qualificationSearch")?.value.trim().toLowerCase()||"";
  let rows=getCalculatedQualifications().filter(q=>{const e=getEmployee(q.employeeId);return(!employee||q.employeeId===employee)&&(!department||e?.department===department)&&(!skill||q.skill===skill)&&(!status||q.status===status)&&(!search||`${e?.name} ${q.skill} ${q.trainer}`.toLowerCase().includes(search));});
  rows.sort((a,b)=>{let av,bv; if(qualificationSort.key==="employee"){av=getEmployee(a.employeeId)?.name||"";bv=getEmployee(b.employeeId)?.name||"";}else if(qualificationSort.key==="qualification"){av=a.skill;bv=b.skill;}else if(qualificationSort.key==="status"){av=a.status;bv=b.status;}else{av=a.renewalDate||"9999-12-31";bv=b.renewalDate||"9999-12-31";}const result=String(av).localeCompare(String(bv));return qualificationSort.direction==="asc"?result:-result;});
  document.getElementById("qualificationCount").textContent=`${rows.length} result${rows.length===1?"":"s"}`;
  document.getElementById("qualificationTable").innerHTML=rows.map(q=>{const e=getEmployee(q.employeeId);return `<tr><td><strong>${escapeHtml(e?.name||q.employeeId)}</strong><br><small>${escapeHtml(q.employeeId)}</small></td><td>${escapeHtml(q.skill)}</td><td>${escapeHtml(e?.department||"—")}</td><td>${formatDate(q.qualificationDate)}</td><td>${formatDate(q.renewalDate)}</td><td>${escapeHtml(q.trainer)}</td><td>${statusBadge(q.status)}</td></tr>`;}).join("")||`<tr><td colspan="7"><div class="empty-state"><strong>No qualifications found</strong><p>Try resetting or adjusting the qualification filters.</p></div></td></tr>`;
}

function renderIdeas(){
  const search=document.getElementById("ideaSearch")?.value.trim().toLowerCase()||"";
  const category=document.getElementById("ideaCategoryFilter")?.value||"";
  const status=document.getElementById("ideaStatusFilter")?.value||"";
  const ideas=demo.improvementIdeas.filter(i=>(!category||i.category===category)&&(!status||i.status===status)&&(!search||`${i.title} ${i.category} ${i.currentIssue} ${i.proposedImprovement} ${i.submittedBy}`.toLowerCase().includes(search)));
  document.getElementById("ideaCount").textContent=`${ideas.length} result${ideas.length===1?"":"s"}`;
  const stages=["Submitted","Under Review","Trial","Implemented","Closed"];
  document.getElementById("ideaStatusCounts").innerHTML=stages.map(stage=>`<span>${stage}: <strong>${demo.improvementIdeas.filter(i=>i.status===stage).length}</strong></span>`).join("");
  document.getElementById("ideaWorkflow").innerHTML=stages.map(stage=>{const stageIdeas=ideas.filter(i=>i.status===stage);return `<section class="workflow-column"><h3>${stage} <span>${stageIdeas.length}</span></h3>${stageIdeas.map(i=>`<article class="idea-card"><div style="display:flex;justify-content:space-between;gap:8px"><p class="eyebrow">${escapeHtml(i.category)}</p>${statusBadge(i.priority||"Medium")}</div><h3>${escapeHtml(i.title)}</h3><p><strong>Issue:</strong> ${escapeHtml(i.currentIssue)}</p><p><strong>Proposal:</strong> ${escapeHtml(i.proposedImprovement)}</p><p><strong>Benefit:</strong> ${escapeHtml(i.expectedBenefit)}</p><small>${escapeHtml(i.submittedBy||"Demo employee")} · ${formatDate(i.submittedDate)}</small><label class="workflow-update">Status<select data-idea-status="${i.id}"><option${i.status==="Submitted"?" selected":""}>Submitted</option><option${i.status==="Under Review"?" selected":""}>Under Review</option><option${i.status==="Trial"?" selected":""}>Trial</option><option${i.status==="Implemented"?" selected":""}>Implemented</option><option${i.status==="Closed"?" selected":""}>Closed</option></select></label><div class="card-actions"><button class="secondary-button" data-edit-idea="${i.id}">Edit</button><button class="danger-button" data-delete-idea="${i.id}">Delete</button></div></article>`).join("")||`<p class="workflow-empty">No ideas at this stage.</p>`}</section>`;}).join("")||`<div class="empty-state"><strong>No improvement ideas found</strong><p>Try resetting or adjusting the idea filters.</p></div>`;
}

function generateGapFindings(){
  const department=document.getElementById("gapDepartment")?.value||"";
  const shift=document.getElementById("gapShift")?.value||"";
  const process=document.getElementById("gapProcess")?.value||"";
  const alertType=document.getElementById("gapType")?.value||"";
  const windowDays=Number(document.getElementById("gapWindow")?.value||30);
  const threshold=Number(document.getElementById("gapThreshold")?.value||DEMO_DATA.demoSettings.trainingProgressThreshold);
  const employees=demo.employees.filter(e=>(!department||e.department===department)&&(!shift||e.shift===shift));
  const skills=process?demo.skills.filter(s=>s.id===process):demo.skills;
  const findings=[];
  skills.forEach(skill=>{const index=demo.skills.indexOf(skill);const trainers=employees.filter(e=>demo.skillStatuses[e.id]?.[index]==="Trainer Qualified").length;const qualified=employees.filter(e=>["Trainer Qualified","Qualified"].includes(demo.skillStatuses[e.id]?.[index])).length;const coverage=employees.length?Math.round(qualified/employees.length*100):0;
    if(trainers===0)findings.push({level:"Critical",title:"Trainer Coverage Risk",text:`${skill.name} currently has zero Trainer Qualified employees in the filtered dataset.`,reason:"Generated because the trainer count is zero.",related:skill.name,next:"Review which qualified employees could participate in trainer development."});
    else if(trainers===1)findings.push({level:"Attention",title:"Single-Point Trainer Coverage",text:`${skill.name} currently has only one Trainer Qualified employee.`,reason:"Generated because trainer count equals the minimum attention threshold.",related:skill.name,next:"Identify a backup qualified employee for possible trainer-development observation."});
    else findings.push({level:"Strength",title:"Strong Trainer Coverage",text:`${skill.name} has ${trainers} Trainer Qualified employees.`,reason:"Generated because trainer count meets or exceeds the configured coverage threshold.",related:skill.name,next:"Share this approach as a strength example and protect observation capacity."});
    if(coverage>=80)findings.push({level:"Strength",title:"Strong Qualification Coverage",text:`${skill.name} has ${coverage}% employee qualification coverage in the filtered dataset.`,reason:"Generated because coverage is at least 80%.",related:skill.name,next:"Maintain evidence, renewal visibility, and cross-shift access."});
  });
  const below=employees.filter(e=>e.progress<threshold);
  if(below.length)findings.push({level:"Attention",title:"Incomplete Training Progress",text:`${below.length} employee(s) are below the ${threshold}% progress threshold.`,reason:"Generated from employee training progress compared with the selected threshold.",related:below.map(e=>e.name).join(", "),next:"Review assignment sequencing and determine whether coaching or clarification is needed."});
  const qualifications=getCalculatedQualifications().filter(q=>{const e=getEmployee(q.employeeId);return(!department||e?.department===department)&&(!shift||e?.shift===shift)&&(!process||q.skill===demo.skills.find(s=>s.id===process)?.name);});
  const expired=qualifications.filter(q=>q.status==="Expired");
  if(expired.length)findings.push({level:"Critical",title:"Expired Qualification Attention",text:`${expired.length} qualification record(s) are expired at the demo reporting date.`,reason:"Generated using renewal dates against DEMO_CURRENT_DATE.",related:expired.map(q=>`${getEmployee(q.employeeId)?.name} — ${q.skill}`).join("; "),next:"Review renewal or retraining ownership and remove stale assumptions."});
  const expiring=qualifications.filter(q=>q.status==="Expiring Soon"||q.renewalDate&&daysBetween(DEMO_DATA.DEMO_CURRENT_DATE,q.renewalDate)<=windowDays&&daysBetween(DEMO_DATA.DEMO_CURRENT_DATE,q.renewalDate)>=0);
  if(expiring.length)findings.push({level:"Attention",title:"Renewals Within Selected Window",text:`${expiring.length} qualification record(s) renew within the selected ${windowDays}-day window.`,reason:"Generated from renewal dates compared with DEMO_CURRENT_DATE and the selected time window.",related:expiring.map(q=>`${getEmployee(q.employeeId)?.name} — ${q.skill}`).join("; "),next:"Confirm preparation and learner availability before renewal dates."});
  const incomplete=employees.filter(e=>e.assignments?.length&&(e.progress<threshold));
  if(incomplete.length)findings.push({level:"Attention",title:"Incomplete Required Training",text:`${incomplete.length} employee(s) have open assignments and progress below ${threshold}%.`,reason:"Generated from current assignments and employee progress.",related:incomplete.map(e=>e.name).join(", "),next:"Review assignment workload and prioritize the next practical learning step."});
  employees.forEach(e=>{const expiredRequired=getCalculatedQualifications().some(q=>q.employeeId===e.id&&q.status==="Expired");const strong=e.progress>=90;const skillIndexes=demo.skills.map((s,i)=>({s,i,status:demo.skillStatuses[e.id]?.[i]})).filter(x=>["Qualified","Trainer Qualified"].includes(x.status));const notTrainer=skillIndexes.some(x=>x.status==="Qualified");if(strong&&notTrainer&&!expiredRequired)findings.push({level:"Opportunity",title:"Potential Trainer-Development Candidate",text:`${e.name} may be suitable for further trainer-development discussion.`,reason:"Potential candidate because progress is 90%+, qualification status is current, and no expired qualification was found.",related:e.name,next:"Discuss interest and readiness; this is not an automatic trainer designation."});});
  const filtered=alertType?findings.filter(f=>f.level===alertType):findings;
  return filtered;
}

function renderGapAnalysis(){
  const findings=generateGapFindings();
  document.getElementById("gapFindings").innerHTML=findings.length?findings.map(f=>`<div class="gap-item gap-${slug(f.level)}"><div class="gap-level">${escapeHtml(f.level)}</div><strong>${escapeHtml(f.title)}</strong><p>${escapeHtml(f.text)}</p><p><strong>Reason:</strong> ${escapeHtml(f.reason)}</p><p><strong>Related:</strong> ${escapeHtml(f.related)}</p><p><strong>Suggested next step:</strong> ${escapeHtml(f.next)}</p></div>`).join(""): `<div class="empty-state"><strong>No findings match these filters</strong><p>Adjust the department, shift, process, alert type, or time window.</p></div>`;
  document.getElementById("coverageBars").innerHTML=demo.skills.map(skill=>{const index=demo.skills.indexOf(skill);const covered=demo.employees.filter(e=>["Trainer Qualified","Qualified","In Training"].includes(demo.skillStatuses[e.id]?.[index])).length;const pct=demo.employees.length?Math.round(covered/demo.employees.length*100):0;return `<div class="coverage-row"><span>${escapeHtml(skill.name)}</span><div class="progress-track"><span style="width:${pct}%"></span></div><strong>${pct}%</strong></div>`;}).join("");
}
function getQualificationStatus(qualification){
  if(["In Training","Not Qualified"].includes(qualification.status)) return qualification.status;
  if(!qualification.renewalDate) return "Not Qualified";
  const days=daysBetween(DEMO_DATA.DEMO_CURRENT_DATE,qualification.renewalDate);
  if(days<0) return "Expired";
  if(days<=DEMO_DATA.demoSettings.expiringSoonDays) return "Expiring Soon";
  return "Current";
}
function getCalculatedQualifications(){ return demo.qualifications.map(q=>({...q,status:getQualificationStatus(q)})); }
function formatDemoDate(){ return formatDate(DEMO_DATA.DEMO_CURRENT_DATE); }
function calculateEmployeeProgress(employee){ return Number(employee.progress||0); }
function getTrainerCoverage(skillName){ const skill=demo.skills.find(s=>s.name===skillName); if(!skill)return 0; const index=demo.skills.indexOf(skill); return demo.employees.filter(e=>demo.skillStatuses[e.id]?.[index]==="Trainer Qualified").length; }
function getOpenImprovementIdeas(){ return demo.improvementIdeas.filter(i=>!["Implemented","Closed"].includes(i.status)); }
function populateSelects(){
  document.getElementById("qualificationEmployee").innerHTML=`<option value="">All employees</option>`+demo.employees.map(e=>`<option value="${e.id}">${escapeHtml(e.name)}</option>`).join("");
  document.getElementById("matrixEmployee").innerHTML=`<option value="">All employees</option>`+demo.employees.map(e=>`<option value="${e.id}">${escapeHtml(e.name)}</option>`).join("");
  document.getElementById("qualificationSkill").innerHTML=`<option value="">All qualifications</option>`+demo.skills.map(s=>`<option value="${s.name}">${escapeHtml(s.name)}</option>`).join("");
  document.getElementById("gapProcess").innerHTML=`<option value="">All processes</option>`+demo.skills.map(s=>`<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
  document.getElementById("employeeRole").innerHTML=`<option value="">All roles</option>`+[...new Set(demo.employees.map(e=>e.role))].sort().map(role=>`<option>${escapeHtml(role)}</option>`).join("");
  document.getElementById("ideaSubmittedBy").innerHTML=`<option value="">Select fictional employee</option>`+demo.employees.map(e=>`<option>${escapeHtml(e.name)}</option>`).join("");
  document.getElementById("demoDate").textContent=`Demo reporting date: ${formatDemoDate()}`;
}

function setupEvents(){
  document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>showSection(button.dataset.section)));
  document.getElementById("menuButton").addEventListener("click",()=>{const sidebar=document.getElementById("sidebar");sidebar.classList.toggle("open");document.getElementById("menuButton").setAttribute("aria-expanded",sidebar.classList.contains("open"));});

  ["employeeSearch","employeeDepartment","employeeShift","employeeRole","employeeStatus"].forEach(id=>document.getElementById(id).addEventListener(id==="employeeSearch"?"input":"change",renderEmployees));
  document.getElementById("resetEmployeeFilters").addEventListener("click",()=>{["employeeSearch","employeeDepartment","employeeShift","employeeRole","employeeStatus"].forEach(id=>document.getElementById(id).value="");renderEmployees();});
  document.getElementById("employeeGrid").addEventListener("click",event=>{const button=event.target.closest("[data-employee]");if(button)openEmployeeProfile(button.dataset.employee);});

  ["matrixSearch","matrixDepartment","matrixShift","matrixEmployee","matrixSkill","matrixStatus"].forEach(id=>document.getElementById(id).addEventListener(id==="matrixSearch"?"input":"change",renderMatrix));
  document.getElementById("resetMatrixFilters").addEventListener("click",()=>{["matrixSearch","matrixDepartment","matrixShift","matrixEmployee","matrixSkill","matrixStatus"].forEach(id=>document.getElementById(id).value="");renderMatrix();});
  document.getElementById("skillsMatrix").addEventListener("click",event=>{const button=event.target.closest("[data-matrix-employee]");if(button)openMatrixDetail(button.dataset.matrixEmployee,button.dataset.matrixSkill);});

  ["trainingSearch","trainingCategory","trainingStatus"].forEach(id=>document.getElementById(id).addEventListener(id==="trainingSearch"?"input":"change",renderTraining));
  document.getElementById("resetTrainingFilters").addEventListener("click",()=>{["trainingSearch","trainingCategory","trainingStatus"].forEach(id=>document.getElementById(id).value="");renderTraining();});
  document.getElementById("trainingModules").addEventListener("click",event=>{const button=event.target.closest("[data-module]");if(button)openModule(Number(button.dataset.module));});
  document.getElementById("moduleDialog").addEventListener("change",event=>{const checkbox=event.target.closest("[data-check-module]");if(!checkbox)return;const key=`module-${checkbox.dataset.checkModule}`;const state=getModuleChecklist(checkbox.dataset.checkModule);state[checkbox.dataset.checkKey]=checkbox.checked;localStorage.setItem(key,JSON.stringify(state));renderTraining();});
  document.getElementById("moduleDialog").addEventListener("click",event=>{if(event.target.id==="resetModuleChecklist"){const title=document.getElementById("moduleDialogTitle").textContent;const module=demo.trainingModules.find(m=>m.title===title);if(module){localStorage.removeItem(`module-${module.id}`);openModule(demo.trainingModules.indexOf(module));renderTraining();}}});

  ["qualificationSearch","qualificationEmployee","qualificationDepartment","qualificationSkill","qualificationStatus"].forEach(id=>document.getElementById(id).addEventListener(id==="qualificationSearch"?"input":"change",renderQualifications));
  document.getElementById("resetQualificationFilters").addEventListener("click",()=>{["qualificationSearch","qualificationEmployee","qualificationDepartment","qualificationSkill","qualificationStatus"].forEach(id=>document.getElementById(id).value="");renderQualifications();});
  document.querySelectorAll("[data-sort]").forEach(button=>button.addEventListener("click",()=>{const key=button.dataset.sort;qualificationSort.direction=qualificationSort.key===key&&qualificationSort.direction==="asc"?"desc":"asc";qualificationSort.key=key;renderQualifications();}));

  ["ideaSearch","ideaCategoryFilter","ideaStatusFilter"].forEach(id=>document.getElementById(id).addEventListener(id==="ideaSearch"?"input":"change",renderIdeas));
  document.getElementById("resetIdeaFilters").addEventListener("click",()=>{["ideaSearch","ideaCategoryFilter","ideaStatusFilter"].forEach(id=>document.getElementById(id).value="");renderIdeas();});

  ["gapDepartment","gapShift","gapProcess","gapType","gapWindow","gapThreshold"].forEach(id=>document.getElementById(id).addEventListener(id==="gapThreshold"?"input":"change",renderGapAnalysis));
  document.getElementById("resetGapFilters").addEventListener("click",()=>{document.getElementById("gapDepartment").value="";document.getElementById("gapShift").value="";document.getElementById("gapProcess").value="";document.getElementById("gapType").value="";document.getElementById("gapWindow").value="30";document.getElementById("gapThreshold").value=DEMO_DATA.demoSettings.trainingProgressThreshold;renderGapAnalysis();});

  const ideaDialog=document.getElementById("ideaDialog");
  document.getElementById("newIdeaButton").addEventListener("click",()=>{document.getElementById("ideaForm").reset();document.querySelector("#ideaForm [name=id]").value="";document.querySelector("#ideaForm [name=submittedDate]").value=DEMO_DATA.DEMO_CURRENT_DATE;document.getElementById("ideaDialogTitle").textContent="Submit Improvement Idea";ideaDialog.showModal();});
  ["closeIdeaDialog","cancelIdea"].forEach(id=>document.getElementById(id).addEventListener("click",()=>ideaDialog.close()));
  document.getElementById("ideaForm").addEventListener("submit",event=>{event.preventDefault();const form=new FormData(event.target);const id=form.get("id");const record={id:id||`CI-${Date.now()}`,title:form.get("title"),category:form.get("category"),priority:form.get("priority"),status:form.get("status"),submittedBy:form.get("submittedBy")||"Demo employee",submittedDate:form.get("submittedDate")||DEMO_DATA.DEMO_CURRENT_DATE,currentIssue:form.get("currentIssue"),proposedImprovement:form.get("proposedImprovement"),expectedBenefit:form.get("expectedBenefit"),notes:form.get("notes")};if(id){const index=demo.improvementIdeas.findIndex(i=>i.id===id);if(index>=0)demo.improvementIdeas[index]=record;}else demo.improvementIdeas.unshift(record);saveDemo();ideaDialog.close();renderAll();});
  document.getElementById("ideaWorkflow").addEventListener("change",event=>{const select=event.target.closest("[data-idea-status]");if(!select)return;const idea=demo.improvementIdeas.find(i=>i.id===select.dataset.ideaStatus);if(idea){idea.status=select.value;saveDemo();renderAll();}});
  document.getElementById("ideaWorkflow").addEventListener("click",event=>{const edit=event.target.closest("[data-edit-idea]");const remove=event.target.closest("[data-delete-idea]");if(edit){const idea=demo.improvementIdeas.find(i=>i.id===edit.dataset.editIdea);if(!idea)return;const form=document.getElementById("ideaForm");Object.entries(idea).forEach(([key,value])=>{const field=form.elements.namedItem(key);if(field)field.value=value||"";});document.getElementById("ideaDialogTitle").textContent="Edit Improvement Idea";ideaDialog.showModal();}if(remove){const idea=demo.improvementIdeas.find(i=>i.id===remove.dataset.deleteIdea);if(idea&&confirm(`Delete “${idea.title}”? This cannot be undone.`)){demo.improvementIdeas=demo.improvementIdeas.filter(i=>i.id!==idea.id);saveDemo();renderAll();}}});

  const aboutButton=document.getElementById("aboutButton");const aboutDialog=document.getElementById("aboutDialog");aboutButton.addEventListener("click",()=>aboutDialog.showModal());document.getElementById("closeAboutDialog").addEventListener("click",()=>aboutDialog.close());
  ["employeeDialog","matrixDialog","moduleDialog","ideaDialog","aboutDialog"].forEach(id=>{const dialog=document.getElementById(id);dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener("close",()=>{if(id==="aboutDialog")aboutButton.focus();});});
  document.getElementById("closeEmployeeDialog").addEventListener("click",()=>document.getElementById("employeeDialog").close());
  document.getElementById("closeMatrixDialog").addEventListener("click",()=>document.getElementById("matrixDialog").close());
  document.getElementById("closeModuleDialog").addEventListener("click",()=>document.getElementById("moduleDialog").close());

  document.getElementById("resetData").addEventListener("click",()=>{if(confirm("Reset all demonstration data to its original fictional values?")){demo=getFreshDemoData();saveDemo();demo.trainingModules.forEach(m=>localStorage.removeItem(`module-${m.id}`));populateSelects();renderAll();showSection("dashboard");}});
}

function renderAll(){renderDashboard();renderEmployees();renderMatrix();renderTraining();renderQualifications();renderIdeas();renderGapAnalysis();renderAnalytics();}

populateSelects();
setupEvents();
renderAll();
function daysBetween(from,to){ const start=new Date(`${from}T00:00:00`); const end=new Date(`${to}T00:00:00`); return Math.round((end-start)/86400000); }

function renderAnalytics(){
  const qualifications=getCalculatedQualifications();
  const statusNames=["Current","Expiring Soon","Expired","In Training","Not Qualified"];
  const statusCounts=statusNames.map(name=>[name,qualifications.filter(q=>q.status===name).length]);
  const departments=[...new Set(demo.employees.map(e=>e.department))];
  const departmentCompletion=departments.map(dept=>{const employees=demo.employees.filter(e=>e.department===dept);const average=employees.length?Math.round(employees.reduce((sum,e)=>sum+e.progress,0)/employees.length):0;return [dept,average];});
  const trainerCoverage=demo.skills.map(skill=>[skill.name,getTrainerCoverage(skill.name)]);
  const categoryCounts={};demo.improvementIdeas.forEach(i=>categoryCounts[i.category]=(categoryCounts[i.category]||0)+1);
  const statusIdeas=["Submitted","Under Review","Trial","Implemented","Closed"].map(name=>[name,demo.improvementIdeas.filter(i=>i.status===name).length]);
  const progressRanges=[["90–100%",e=>e.progress>=90],["70–89%",e=>e.progress>=70&&e.progress<90],["Below 70%",e=>e.progress<70]];
  const chart=(title,explanation,rows)=>`<article class="chart-panel"><h2>${title}</h2><p>${explanation}</p>${rows.map(([name,value])=>{const max=Math.max(...rows.map(r=>Number(r[1])),1);const pct=Math.round(Number(value)/max*100);return `<div class="bar-chart-row"><span>${escapeHtml(name)}</span><div class="bar-track" role="img" aria-label="${escapeHtml(name)}: ${value}"><span style="width:${pct}%"></span></div><strong>${value}</strong></div>`;}).join("")}<p class="chart-summary"><strong>Summary:</strong> ${rows.map(([name,value])=>`${escapeHtml(name)}: ${value}`).join("; ")}.</p></article>`;
  document.getElementById("analyticsGrid").innerHTML=`
    ${chart("Qualification Status Distribution","Calculated using renewal dates and the fixed demo reporting date.",statusCounts)}
    ${chart("Training Completion by Department","Average reported employee training progress by fictional department.",departmentCompletion)}
    ${chart("Trainer Coverage by Process","Count of employees marked Trainer Qualified for each process.",trainerCoverage)}
    ${chart("Improvement Ideas by Category","Current fictional improvement ideas grouped by category.",Object.entries(categoryCounts))}
    ${chart("Improvement Ideas by Status","Current fictional improvement ideas by workflow stage.",statusIdeas)}
    ${chart("Employees by Training-Progress Range","Employee count in each training progress range.",progressRanges.map(([name,fn])=>[name,demo.employees.filter(fn).length]))}`;
}
