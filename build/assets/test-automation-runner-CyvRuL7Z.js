class p{constructor(){this.testRunner=new PWAOfflineTester,this.isRunning=!1,this.currentScenario=null,this.currentAssessment=0,this.currentRepetition=0,this.totalTests=90,this.completedTests=0,this.testResults=[],this.onProgressCallback=null,this.onCompleteCallback=null}onProgress(e){this.onProgressCallback=e}onComplete(e){this.onCompleteCallback=e}async startAutomatedTest(){if(this.isRunning){console.log("Test already running");return}this.isRunning=!0,this.completedTests=0,this.testResults=[],console.log("Starting automated PWA offline testing..."),console.log(`Total tests to run: ${this.totalTests}`);const e=[{name:"stable_online",config:{type:"stable"}},{name:"offline_mode",config:{type:"offline"}},{name:"intermittent",config:{type:"intermittent",bandwidth:"300kbps",disconnectInterval:3e4}}];try{for(const s of e){this.currentScenario=s,console.log(`
=== Starting Scenario: ${s.name} ===`);for(let n=1;n<=10;n++){this.currentAssessment=n,console.log(`
--- Assessment ${n}/10 ---`);for(let o=1;o<=3;o++){if(this.currentRepetition=o,!this.isRunning){console.log("Test execution stopped");return}console.log(`Running test: ${s.name}_assessment_${n}_rep_${o}`);try{const t=await this.testRunner.runTestCase(s,n,o);this.testResults.push(t),this.completedTests++,this.reportProgress()}catch(t){console.error(`Test failed: ${s.name}_assessment_${n}_rep_${o}`,t),this.testResults.push({testId:`${s.name}_assessment_${n}_rep_${o}`,scenario:s.name,assessmentNumber:n,repetition:o,success:!1,error:t.message,timestamp:new Date().toISOString()}),this.completedTests++,this.reportProgress()}await this.delay(1e3)}}}console.log(`
=== All tests completed ===`),this.generateFinalReport()}catch(s){console.error("Automated testing failed:",s)}finally{this.isRunning=!1,this.onCompleteCallback&&this.onCompleteCallback(this.testResults)}}stopAutomatedTest(){this.isRunning=!1,console.log("Stopping automated test execution...")}reportProgress(){var n;const e=this.completedTests/this.totalTests*100,s=this.getCurrentTestId();console.log(`Progress: ${this.completedTests}/${this.totalTests} (${e.toFixed(1)}%) - ${s}`),this.onProgressCallback&&this.onProgressCallback({completed:this.completedTests,total:this.totalTests,progress:e,currentTest:s,currentScenario:(n=this.currentScenario)==null?void 0:n.name,currentAssessment:this.currentAssessment,currentRepetition:this.currentRepetition})}getCurrentTestId(){return this.currentScenario?`${this.currentScenario.name}_assessment_${this.currentAssessment}_rep_${this.currentRepetition}`:"Initializing..."}generateFinalReport(){const e={timestamp:new Date().toISOString(),totalTests:this.totalTests,completedTests:this.completedTests,scenarios:{},summary:{overallSuccessRate:0,averageSyncDelay:0,dataIntegrityFailures:0,performanceMetrics:{minResponseTime:1/0,maxResponseTime:0,avgResponseTime:0,totalResponseTime:0}}},s={};this.testResults.forEach(i=>{s[i.scenario]||(s[i.scenario]=[]),s[i.scenario].push(i)}),Object.keys(s).forEach(i=>{const a=s[i],u=a.filter(r=>r.success).length,g=a.reduce((r,l)=>{var m;return r+(((m=l.submissionResult)==null?void 0:m.responseTime)||0)},0)/a.length,h=a.filter(r=>{var l;return(l=r.syncMetrics)==null?void 0:l.success}).reduce((r,l)=>{var m;return r+(((m=l.syncMetrics)==null?void 0:m.delay)||0)},0)/a.filter(r=>{var l;return(l=r.syncMetrics)==null?void 0:l.success}).length;e.scenarios[i]={total:a.length,successful:u,successRate:u/a.length*100,avgProcessingTime:g,avgSyncDelay:h,dataIntegrityFailures:a.filter(r=>r.integrityCheck&&!r.integrityCheck.passed).length,timeoutFailures:a.filter(r=>{var l;return(l=r.syncMetrics)==null?void 0:l.timeout}).length}});const n=this.testResults.filter(i=>i.success).length,o=this.testResults.filter(i=>{var a;return(a=i.syncMetrics)==null?void 0:a.success}).length,t=this.testResults.filter(i=>i.integrityCheck&&!i.integrityCheck.passed).length;e.summary.overallSuccessRate=n/this.totalTests*100,e.summary.syncSuccessRate=o/this.totalTests*100,e.summary.dataIntegrityFailures=t;const c=this.testResults.map(i=>{var a;return((a=i.submissionResult)==null?void 0:a.responseTime)||0}).filter(i=>i>0);return c.length>0&&(e.summary.performanceMetrics={minResponseTime:Math.min(...c),maxResponseTime:Math.max(...c),avgResponseTime:c.reduce((i,a)=>i+a,0)/c.length,totalResponseTime:c.reduce((i,a)=>i+a,0)}),console.log(`
=== FINAL TEST REPORT ===`),console.log(JSON.stringify(e,null,2)),e}exportResults(e="json"){const s=this.generateFinalReport();switch(e){case"json":return JSON.stringify(s,null,2);case"csv":return this.exportToCSV(s);case"html":return this.exportToHTML(s);default:return s}}exportToCSV(e){const s=["Test ID,Scenario,Assessment,Repetition,Success,Response Time,Sync Success,Sync Delay,Data Integrity,Error"];return this.testResults.forEach(n=>{var o,t,c,i;s.push([n.testId,n.scenario,n.assessmentNumber,n.repetition,n.success?"Yes":"No",((o=n.submissionResult)==null?void 0:o.responseTime)||"N/A",(t=n.syncMetrics)!=null&&t.success?"Yes":"No",((c=n.syncMetrics)==null?void 0:c.delay)||"N/A",(i=n.integrityCheck)!=null&&i.passed?"Pass":"Fail",n.error||""].join(","))}),s.join(`
`)}exportToHTML(e){var s,n,o;return`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PWA Offline Test Report</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">PWA Offline Testing Report</h1>
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Test Summary</div>
                    <div class="card-body">
                        <p><strong>Total Tests:</strong> ${e.totalTests}</p>
                        <p><strong>Completed Tests:</strong> ${e.completedTests}</p>
                        <p><strong>Overall Success Rate:</strong> ${e.summary.overallSuccessRate.toFixed(1)}%</p>
                        <p><strong>Data Integrity Failures:</strong> ${e.summary.dataIntegrityFailures}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Performance Metrics</div>
                    <div class="card-body">
                        <p><strong>Average Response Time:</strong> ${((s=e.summary.performanceMetrics.avgResponseTime)==null?void 0:s.toFixed(2))||"N/A"}ms</p>
                        <p><strong>Min Response Time:</strong> ${((n=e.summary.performanceMetrics.minResponseTime)==null?void 0:n.toFixed(2))||"N/A"}ms</p>
                        <p><strong>Max Response Time:</strong> ${((o=e.summary.performanceMetrics.maxResponseTime)==null?void 0:o.toFixed(2))||"N/A"}ms</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">Scenario Results</div>
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Scenario</th>
                                    <th>Total Tests</th>
                                    <th>Success Rate</th>
                                    <th>Avg Processing Time</th>
                                    <th>Data Integrity Failures</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.keys(e.scenarios).map(t=>{var c;return`
                                    <tr>
                                        <td>${t}</td>
                                        <td>${e.scenarios[t].total}</td>
                                        <td>${e.scenarios[t].successRate.toFixed(1)}%</td>
                                        <td>${((c=e.scenarios[t].avgProcessingTime)==null?void 0:c.toFixed(2))||"N/A"}ms</td>
                                        <td>${e.scenarios[t].dataIntegrityFailures}</td>
                                    </tr>
                                `}).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">Detailed Results</div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Test ID</th>
                                        <th>Success</th>
                                        <th>Response Time</th>
                                        <th>Sync Status</th>
                                        <th>Data Integrity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.testResults.slice(0,100).map(t=>{var c,i,a,u,g,h;return`
                                        <tr>
                                            <td>${t.testId}</td>
                                            <td><span class="badge ${t.success?"bg-success":"bg-danger"}">${t.success?"Pass":"Fail"}</span></td>
                                            <td>${((i=(c=t.submissionResult)==null?void 0:c.responseTime)==null?void 0:i.toFixed(2))||"N/A"}ms</td>
                                            <td><span class="badge ${(a=t.syncMetrics)!=null&&a.success?"bg-success":"bg-warning"}">${(u=t.syncMetrics)!=null&&u.success?"Synced":"Failed"}</span></td>
                                            <td><span class="badge ${(g=t.integrityCheck)!=null&&g.passed?"bg-success":"bg-danger"}">${(h=t.integrityCheck)!=null&&h.passed?"Pass":"Fail"}</span></td>
                                        </tr>
                                    `}).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`}delay(e){return new Promise(s=>setTimeout(s,e))}getStatistics(){const e=this.testResults.length,s=this.testResults.filter(t=>t.success).length,n=this.testResults.filter(t=>{var c;return(c=t.syncMetrics)==null?void 0:c.success}).length,o=this.testResults.filter(t=>{var c;return(c=t.integrityCheck)==null?void 0:c.passed}).length;return{totalTests:this.totalTests,completedTests:this.completedTests,successful:s,successRate:e>0?s/e*100:0,syncSuccessRate:e>0?n/e*100:0,integrityPassRate:e>0?o/e*100:0,currentProgress:this.completedTests/this.totalTests*100}}reset(){this.isRunning=!1,this.currentScenario=null,this.currentAssessment=0,this.currentRepetition=0,this.completedTests=0,this.testResults=[]}}document.addEventListener("DOMContentLoaded",function(){window.TestAutomationRunner=p,document.getElementById("startTest")&&y()});function y(){const d=new p;let e=!1;d.onProgress(o=>{document.getElementById("overallProgress").style.width=`${o.progress}%`,document.getElementById("completedTests").textContent=o.completed,document.getElementById("successfulTests").textContent=d.getStatistics().successful;const t=document.createElement("div");t.className="log-entry info",t.textContent=`[${new Date().toLocaleTimeString()}] Completed: ${o.currentTest} (${o.progress.toFixed(1)}%)`,document.getElementById("testResults").appendChild(t),document.getElementById("testResults").scrollTop=document.getElementById("testResults").scrollHeight}),d.onComplete(o=>{const t=d.getStatistics();document.getElementById("syncSuccessRate").textContent=`${t.syncSuccessRate.toFixed(1)}%`,document.getElementById("dataIntegrity").textContent=`${t.integrityPassRate.toFixed(1)}%`;const c=document.createElement("div");c.className="log-entry success",c.textContent=`[${new Date().toLocaleTimeString()}] Automated testing completed! Success rate: ${t.successRate.toFixed(1)}%`,document.getElementById("testResults").appendChild(c),document.getElementById("startTest").disabled=!1,document.getElementById("pauseTest").disabled=!0,document.getElementById("stopTest").disabled=!0}),document.getElementById("startTest").addEventListener("click",function(o){e&&(o.preventDefault(),d.startAutomatedTest())});const n=document.getElementById("autoMode");n.addEventListener("change",function(){e=this.checked,e?(document.getElementById("testScenario").disabled=!0,document.getElementById("assessmentCount").disabled=!0,document.getElementById("repetitionCount").disabled=!0,document.getElementById("startTest").textContent="Start Automated Testing"):(document.getElementById("testScenario").disabled=!1,document.getElementById("assessmentCount").disabled=!1,document.getElementById("repetitionCount").disabled=!1,document.getElementById("startTest").textContent="Start Testing")}),n.dispatchEvent(new Event("change"))}
