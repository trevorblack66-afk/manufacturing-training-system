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
  const qualified=demo.employees.filter(employee=>employee.progress>=90).length;
  const inTraining=demo.qualifications.filter(q=>q.status==="In Training").length;
  const expiring=demo.qualifications.filter(q=>q.status==="Expiring Soon").length;
  const openIdeas=demo.improvementIdeas.filter(i=>i.status!=="Implemented").length;
  const kpis=[
    ["Total Employees",demo.employees.length,"Across 4 departments"],["Fully Qualified",qualified,"90%+ progress"],
    ["Training In Progress",inTraining,"Active qualifications"],["Expiring Soon",expiring,"Renewals needed"],["Open Improvement Ideas",openIdeas,"Not yet implemented"]
  ];
  document.getElementById("kpiGrid").innerHTML=kpis.map(([label,value,note])=>`<article class="kpi-card"><span>${label}</span><strong>${value}</strong><em>${note}</em></article>`).join("");

  const avg=demo.employees.reduce((sum,e)=>sum+e.progress,0)/demo.employees.length;
  document.getElementById("trainingOverview").innerHTML=`<div class="data-row"><div><strong>${Math.round(avg)}% average progress</strong><small>${demo.employees.filter(e=>e.progress===100).length} employees at 100%</small></div><strong>${demo.employees.filter(e=>e.progress<70).length} at-risk</strong></div><div class="progress-track"><span style="width:${avg}%"></span></div><div class="data-list">${demo.employees.slice(0,5).map(e=>`<div class="data-row"><div><strong>${escapeHtml(e.name)}</strong><small>${escapeHtml(e.department)} · Shift ${escapeHtml(e.shift)}</small></div><div style="width:110px"><div class="progress-track"><span style="width:${e.progress}%"></span></div><small>${e.progress}%</small></div></div>`).join("")}</div>`;

  document.getElementById("qualificationAlerts").innerHTML=demo.qualifications.filter(q=>["Expiring Soon","Expired","In Training"].includes(q.status)).slice(0,6).map(q=>{const employee=getEmployee(q.employeeId);return `<div class="data-row"><div><strong>${escapeHtml(employee?.name||q.employeeId)}</strong><small>${escapeHtml(q.skill)} · ${q.renewalDate?formatDate(q.renewalDate):"No date"}</small></div>${statusBadge(q.status)}</div>`;}).join("")||`<p>No active qualification alerts.</p>`;

  document.getElementById("recentActivity").innerHTML=[
    ["Maya Torres","Completed practice review","Nov 25, 2026"],["Theo Morgan","Started Packaging Standard","Nov 24, 2026"],["Marcus Green","Qualification observation scheduled","Nov 22, 2026"],["Priya Shah","Renewal review submitted","Nov 20, 2026"]
  ].map(([name,activity,date])=>`<div class="data-row"><div><strong>${name}</strong><small>${activity}</small></div><small>${date}</small></div>`).join("");

  document.getElementById("itemsAttention").innerHTML=`<div class="data-row"><div><strong>${demo.qualifications.filter(q=>q.status==="Expired").length} expired qualifications</strong><small>Require retraining or renewal review</small></div><span class="status-badge status-expired">Review</span></div><div class="data-row"><div><strong>${demo.employees.filter(e=>e.progress<70).length} employees below 70% progress</strong><small>May need additional coaching</small></div><span class="status-badge status-expiring-soon">Monitor</span></div><div class="data-row"><div><strong>${demo.improvementIdeas.filter(i=>i.status==="Submitted").length} submitted ideas awaiting review</strong><small>Continuous improvement backlog</small></div><span class="status-badge status-in-training">Act</span></div>`;
}

function renderEmployees(){
  const search=document.getElementById("employeeSearch").value.trim().toLowerCase();
  const department=document.getElementById("employeeDepartment").value;
  const shift=document.getElementById("employeeShift").value;
  const filtered=demo.employees.filter(e=>(!department||e.department===department)&&(!shift||e.shift===shift)&&(!search||`${e.name} ${e.id} ${e.role}`.toLowerCase().includes(search)));
  document.getElementById("employeeGrid").innerHTML=filtered.map(e=>`<article class="employee-card"><h3>${escapeHtml(e.name)}</h3><div class="employee-meta">${escapeHtml(e.id)} · ${escapeHtml(e.department)} · Shift ${escapeHtml(e.shift)}</div><div class="employee-detail"><div><span>Role</span><strong>${escapeHtml(e.role)}</strong></div><div><span>Assigned Trainer</span><strong>${escapeHtml(e.trainer)}</strong></div><div><span>Hire Date</span><strong>${formatDate(e.hireDate)}</strong></div><div><span>Training Progress</span><strong>${e.progress}%</strong></div></div><div class="progress-track"><span style="width:${e.progress}%"></span></div><div style="margin-top:12px"><span class="eyebrow">Development goal</span><p style="font-size:13px;margin:6px 0">${escapeHtml(e.goals)}</p></div></article>`).join("")||`<p>No employees match these filters.</p>`;
}

function renderMatrix(){
  document.getElementById("matrixSkill").innerHTML=`<option value="">All skills</option>`+demo.skills.map(s=>`<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
  const department=document.getElementById("matrixDepartment").value;
  const shift=document.getElementById("matrixShift").value;
  const skill=document.getElementById("matrixSkill").value;
  const status=document.getElementById("matrixStatus").value;
  let employees=demo.employees.filter(e=>(!department||e.department===department)&&(!shift||e.shift===shift));
  let skills=skill?demo.skills.filter(s=>s.id===skill):demo.skills;
  if(status) employees=employees.filter(e=>demo.skillStatuses[e.id].some((s,i)=>(!skill||demo.skills[i].id===skill)&&s===status));
  const thead=`<tr><th>Employee</th>${skills.map(s=>`<th>${escapeHtml(s.name)}</th>`).join("")}</tr>`;
  const tbody=employees.map(e=>`<tr><td><strong>${escapeHtml(e.name)}</strong><br><small>${escapeHtml(e.department)} · Shift ${escapeHtml(e.shift)}</small></td>${skills.map(s=>{const originalIndex=demo.skills.findIndex(x=>x.id===s.id);const value=demo.skillStatuses[e.id]?.[originalIndex]||"Not Started";return `<td class="matrix-cell"><span class="matrix-dot ${statusBadge(value).match(/status-[^\"]+/)?.[0]||"status-not-started"}">${escapeHtml(value)}</span></td>`;}).join("")}</tr>`).join("");
  document.querySelector("#skillsMatrix thead").innerHTML=thead;
  document.querySelector("#skillsMatrix tbody").innerHTML=tbody||`<tr><td colspan="${skills.length+1}">No employees match these filters.</td></tr>`;
  document.getElementById("matrixLegend").innerHTML=["Trainer Qualified","Qualified","In Training","Not Started","Expired"].map(s=>`<span>${statusBadge(s)}</span>`).join("");
}

function renderTraining(){
  document.getElementById("trainingModules").innerHTML=demo.trainingModules.map((m,index)=>`<article class="module-card"><p class="eyebrow">${escapeHtml(m.id)}</p><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.purpose)}</p><div style="display:flex;justify-content:space-between;align-items:center"><span class="status-badge status-qualified">Available</span><button class="secondary-button" data-module="${index}">Open module</button></div></article>`).join("");
}

function openModule(index){
  const m=demo.trainingModules[index];
  document.getElementById("moduleDialogTitle").textContent=m.title;
  const sections=(title,items)=>`<div class="module-detail-section"><h3>${title}</h3><ul class="module-detail-list">${items.map(i=>`<li>${escapeHtml(i)}</li>`).join("")}</ul></div>`;
  document.getElementById("moduleDialogContent").innerHTML=`<p>${escapeHtml(m.purpose)}</p>${sections("Major Steps",m.steps)}${sections("Key Points",m.keyPoints)}${sections("Reasons",m.reasons)}${sections("General Safety Considerations",m.safety)}${sections("Trainer Checklist",m.trainerChecklist)}${sections("Learner Demonstration Checklist",m.learnerChecklist)}<p><strong>Verification status:</strong> Pending learner and trainer verification</p>`;
  document.getElementById("moduleDialog").showModal();
}

function renderQualifications(){
  const employee=document.getElementById("qualificationEmployee").value;
  const status=document.getElementById("qualificationStatus").value;
  const rows=demo.qualifications.filter(q=>(!employee||q.employeeId===employee)&&(!status||q.status===status));
  document.getElementById("qualificationTable").innerHTML=rows.map(q=>{const e=getEmployee(q.employeeId);return `<tr><td><strong>${escapeHtml(e?.name||q.employeeId)}</strong><br><small>${escapeHtml(q.employeeId)}</small></td><td>${escapeHtml(q.skill)}</td><td>${formatDate(q.qualificationDate)}</td><td>${formatDate(q.renewalDate)}</td><td>${escapeHtml(q.trainer)}</td><td>${statusBadge(q.status)}</td></tr>`;}).join("")||`<tr><td colspan="6">No qualifications match these filters.</td></tr>`;
}

function renderIdeas(){
  const status=document.getElementById("ideaStatusFilter").value;
  const ideas=demo.improvementIdeas.filter(i=>!status||i.status===status);
  document.getElementById("ideaGrid").innerHTML=ideas.map(i=>`<article class="idea-card"><div style="display:flex;justify-content:space-between;gap:8px"><p class="eyebrow">${escapeHtml(i.category)}</p>${statusBadge(i.status)}</div><h3>${escapeHtml(i.title)}</h3><p><strong>Issue:</strong> ${escapeHtml(i.currentIssue)}</p><p><strong>Proposal:</strong> ${escapeHtml(i.proposedImprovement)}</p><p><strong>Benefit:</strong> ${escapeHtml(i.expectedBenefit)}</p><small>${escapeHtml(i.submittedBy)} · ${formatDate(i.submittedDate)}</small><div style="margin-top:12px"><label><span class="sr-only">Update status for ${escapeHtml(i.title)}</span><select data-idea-status="${i.id}" style="width:100%;border:1px solid var(--border);border-radius:6px;padding:8px"><option${i.status==="Submitted"?" selected":""}>Submitted</option><option${i.status==="Under Review"?" selected":""}>Under Review</option><option${i.status==="Trial"?" selected":""}>Trial</option><option${i.status==="Implemented"?" selected":""}>Implemented</option></select></label></div></article>`).join("")||`<p>No improvement ideas match this filter.</p>`;
}

function renderGapAnalysis(){
  const findings=[];
  demo.skills.forEach(skill=>{const originalIndex=demo.skills.findIndex(s=>s.id===skill.id);const trainers=demo.employees.filter(e=>demo.skillStatuses[e.id]?.[originalIndex]==="Trainer Qualified").length;if(trainers<2)findings.push({level:"high",title:`Insufficient trainer coverage: ${skill.name}`,text:`Only ${trainers} employee(s) are marked Trainer Qualified.`});else findings.push({level:"positive",title:`Strong trainer coverage: ${skill.name}`,text:`${trainers} employees are marked Trainer Qualified.`});});
  const expiring=demo.qualifications.filter(q=>["Expiring Soon","Expired"].includes(q.status));
  if(expiring.length)findings.push({level:"high",title:`${expiring.length} qualification renewal attention items`,text:"Renewal dates include expired or near-term qualifications."});
  const incomplete=demo.employees.filter(e=>e.progress<70);
  if(incomplete.length)findings.push({level:"",title:`${incomplete.length} employees have incomplete training progress`,text:"Progress is below 70%; consider coaching and reassessment."});
  const strong=demo.employees.filter(e=>e.progress>=90).length;
  if(strong)findings.push({level:"positive",title:`Strong progress coverage`,text:`${strong} employees are at or above 90% training progress.`});
  document.getElementById("gapFindings").innerHTML=findings.map(f=>`<div class="gap-item ${f.level}"><strong>${escapeHtml(f.title)}</strong><div style="font-size:13px;color:var(--muted);margin-top:3px">${escapeHtml(f.text)}</div></div>`).join("");
  document.getElementById("coverageBars").innerHTML=demo.skills.map(skill=>{const index=demo.skills.findIndex(s=>s.id===skill.id);const covered=demo.employees.filter(e=>["Trainer Qualified","Qualified","In Training"].includes(demo.skillStatuses[e.id]?.[index])).length;const pct=Math.round(covered/demo.employees.length*100);return `<div class="coverage-row"><span>${escapeHtml(skill.name)}</span><div class="progress-track"><span style="width:${pct}%"></span></div><strong>${pct}%</strong></div>`;}).join("");
}

function renderAnalytics(){
  const skillRows=demo.skills.map(skill=>{const index=demo.skills.findIndex(s=>s.id===skill.id);const covered=demo.employees.filter(e=>["Trainer Qualified","Qualified"].includes(demo.skillStatuses[e.id]?.[index])).length;return [skill.name,covered,Math.round(covered/demo.employees.length*100)];});
  const statusCounts={"Qualified":0,"In Training":0,"Expiring Soon":0,"Expired":0,"Not Qualified":0};
  demo.qualifications.forEach(q=>{if(statusCounts[q.status]!==undefined)statusCounts[q.status]++;else if(q.status==="Current")statusCounts.Qualified++;else if(q.status==="In Training")statusCounts["In Training"]++;});
  const categoryCounts={};demo.improvementIdeas.forEach(i=>categoryCounts[i.category]=(categoryCounts[i.category]||0)+1);
  const completed=demo.employees.filter(e=>e.progress>=90).length;
  const maxSkill=Math.max(...skillRows.map(r=>r[1]),1);
  document.getElementById("analyticsGrid").innerHTML=`
    <article class="chart-panel"><h2>Qualification Coverage</h2>${skillRows.map(([name,count,pct])=>`<div class="bar-chart-row"><span>${escapeHtml(name)}</span><div class="bar-track"><span style="width:${pct}%"></span></div><strong>${pct}%</strong></div>`).join("")}</article>
    <article class="chart-panel"><h2>Training Completion</h2><div class="donut-row"><div class="donut-wrap"><div class="donut"></div><div class="donut-label" style="inset:65px 0 0;text-align:center">${completed}/${demo.employees.length}</div></div><div class="legend-list"><span>Qualified / advanced progress: ${completed}</span><span>Remaining: ${demo.employees.length-completed}</span></div></div></article>
    <article class="chart-panel"><h2>Improvement Ideas by Category</h2>${Object.entries(categoryCounts).map(([name,count])=>`<div class="bar-chart-row"><span>${escapeHtml(name)}</span><div class="bar-track"><span style="width:${count/Math.max(...Object.values(categoryCounts))*100}%"></span></div><strong>${count}</strong></div>`).join("")}</article>
    <article class="chart-panel"><h2>Qualification Status Distribution</h2>${Object.entries(statusCounts).map(([name,count])=>`<div class="data-row"><div><span class="legend-dot status-${slug(name)}"></span><strong>${name}</strong></div><strong>${count}</strong></div>`).join("")}</article>`;
}

function populateSelects(){
  const employeeOptions=`<option value="">All employees</option>`+demo.employees.map(e=>`<option value="${e.id}">${escapeHtml(e.name)}</option>`).join("");
  document.getElementById("qualificationEmployee").innerHTML=employeeOptions;
}

function setupEvents(){
  document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>showSection(button.dataset.section)));
  document.getElementById("menuButton").addEventListener("click",()=>{const sidebar=document.getElementById("sidebar");sidebar.classList.toggle("open");document.getElementById("menuButton").setAttribute("aria-expanded",sidebar.classList.contains("open"));});
  ["employeeSearch","employeeDepartment","employeeShift"].forEach(id=>document.getElementById(id).addEventListener("input",renderEmployees));
  ["matrixDepartment","matrixShift","matrixStatus"].forEach(id=>document.getElementById(id).addEventListener("change",renderMatrix));
  document.getElementById("matrixSkill").addEventListener("change",renderMatrix);
  ["qualificationEmployee","qualificationStatus"].forEach(id=>document.getElementById(id).addEventListener("change",renderQualifications));
  document.getElementById("ideaStatusFilter").addEventListener("change",renderIdeas);
  document.getElementById("trainingModules").addEventListener("click",event=>{const button=event.target.closest("[data-module]");if(button)openModule(Number(button.dataset.module));});
  document.getElementById("ideaGrid").addEventListener("change",event=>{const select=event.target.closest("[data-idea-status]");if(!select)return;const idea=demo.improvementIdeas.find(i=>i.id===select.dataset.ideaStatus);if(idea){idea.status=select.value;saveDemo();renderIdeas();renderDashboard();renderGapAnalysis();renderAnalytics();}});
  const dialog=document.getElementById("ideaDialog");
  document.getElementById("newIdeaButton").addEventListener("click",()=>dialog.showModal());
  ["closeIdeaDialog","cancelIdea"].forEach(id=>document.getElementById(id).addEventListener("click",()=>dialog.close()));
  document.getElementById("ideaForm").addEventListener("submit",event=>{event.preventDefault();const form=new FormData(event.target);demo.improvementIdeas.unshift({id:`CI-${String(demo.improvementIdeas.length+101).padStart(3,"0")}`,title:form.get("title"),category:form.get("category"),currentIssue:form.get("currentIssue"),proposedImprovement:form.get("proposedImprovement"),expectedBenefit:form.get("expectedBenefit"),status:"Submitted",submittedBy:"Demo User",submittedDate:new Date().toISOString().slice(0,10)});saveDemo();event.target.reset();dialog.close();renderIdeas();renderDashboard();renderGapAnalysis();renderAnalytics();});
  document.getElementById("closeModuleDialog").addEventListener("click",()=>document.getElementById("moduleDialog").close());
  document.getElementById("resetData").addEventListener("click",()=>{if(confirm("Reset all demonstration data to its original fictional values?")){demo=getFreshDemoData();saveDemo();populateSelects();renderAll();showSection("dashboard");}});
}

function renderAll(){renderDashboard();renderEmployees();renderMatrix();renderTraining();renderQualifications();renderIdeas();renderGapAnalysis();renderAnalytics();}

populateSelects();
setupEvents();
renderAll();
