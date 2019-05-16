var id = 1;
var startTimeJobs;
var allJobs = [];
var jobsToExecute = [];

function createQueue(){
	var newJob =  new JobStruct(id,$('#time').val());
	allJobs.push(newJob);
	jobsToExecute.push(newJob);
	id++;
	$('.table-logs').append("<li class='-itemjob'><i class='fas fa-level-up-alt -arrowjobicon'></i>Job <span class='-numberjob'>" + newJob.jobId + "</span> adicionado a fila <i class='fas fa-minus -minusarrowicon'></i> Tempo de execução: <span class='-numbersecondjob'>" + newJob.totalTime +"</span> segundos </li>");
}

function startJobs() {
	$('.table-logs').append("<li>Iniciando execução dos Jobs.</li>");
	if($('.typeOfProcess').val() == "roundRobinPreemptivo"){
		while(jobsToExecute.length > 0){
			var jobNow = jobsToExecute[0];
			console.log("Job " + jobNow.jobId + " executando - P");
			$('.table-logs').append("<li>Job " + jobNow.jobId + " executando </li>");
			jobPreemptivo(jobNow);
			$('.table-logs').append("<li>Job " + jobNow.jobId + " finalizou </li>");
			console.log("Job " + jobNow.jobId + " finalizou - P");
		}
		for (var i = 0; i < allJobs.length; i++) {
			jobsToExecute.push(allJobs[i]);
		}
	}else if($('.typeOfProcess').val() == "roundRobin"){
		allJobs.sort(compare);
		for (var i = 0; i < allJobs.length; i++) {
			if(i == 0){
				startTimeJobs = new Date().getTime();
			}
			$('.table-logs').append("<li>Job " + allJobs[i].jobId + " executando </li>");
			job(allJobs[i]);
			$('.table-logs').append("<li>Job " + allJobs[i].jobId + " finalizou </li>");
		}
	}
}
function jobPreemptivo(jobItem){
	if(!jobItem.executed){
		jobItem.totalTime = jobItem.totalTime - 1;
		sleep(1500);
		jobsToExecute.shift();
		if(jobItem.totalTime <= 0){
			jobItem.executed = true;
			console.log("Job " + jobItem.jobId + " executou totalmente - P");
			$('.table-logs').append("<li>Job " + jobItem.jobId + " executou totalmente. </li>");
			
		}else{
			jobsToExecute.push(jobItem);
		}
	}
}
function job(jobItem){
	console.log("Job " + jobItem.jobId + " executando");
	sleepJob(jobItem.totalTime * 1000, jobItem);
	console.log("Job " + jobItem.jobId + " finalizou ");
}

function sleepJob(milliseconds, jobItem) {
	var now = new Date().getTime();
	jobItem.startTime = (now - startTimeJobs) / 1000;
	while ( new Date().getTime() < now + milliseconds ){}
	jobItem.finishTime  =  (new Date().getTime() - startTimeJobs)/1000;
}

function JobStruct(jobId, totalTime, ) {
    this.jobId = jobId;
	this.totalTime = totalTime;
	this.executed = false;
}

function showAllJobs(){
	console.log(allJobs);
	for (var i = 0; i < allJobs.length; i++) {
		console.log("jobId: " + allJobs[i].jobId);
		console.log("totalTime: " + allJobs[i].totalTime);
		console.log("startTime: " + allJobs[i].startTime);
		console.log("finishTime: " + allJobs[i].finishTime);
	}
}

function createChart(){
	$('.table-logs').append("<li>Montando gráfico.</li>");
	var labels = [0];
	var data = [0];
	for (var i = 0; i < allJobs.length; i++) {
		labels.push("Job " + allJobs[i].jobId);
		data.push(allJobs[i].finishTime);
	}
	var ctx = document.getElementById('myChart').getContext('2d');
	var myBarChart = new Chart(ctx, {
		type: 'horizontalBar',
		data: {
			labels: labels,
			datasets: [{
				label: 'Tempo de execução',
				backgroundColor: '5f9ea0',
				borderColor: 'r5f9ea0',
				data: data
			}]
		},
		options: {}
	});
}
function compare(jobA,jobB) {
  if (jobA.totalTime < jobB.totalTime)
     return -1;
  if (jobA.totalTime > jobB.totalTime)
    return 1;
  return 0;
}
function sleep(milliseconds) {
	var now = new Date().getTime();
	while ( new Date().getTime() < now + milliseconds ){}
}