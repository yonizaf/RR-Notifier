/*
var tmr = {timerId:null,settings:{interval:1000*60*10,startInterval:1000*10}};
tmr.loop=function(){
	//the main loop
	console.log("loop; id="+tmr.timerId.toString())
	tmr.timerId = setTimeout(tmr.loop,tmr.settings.interval)
};
tmr.run=function(initialRun){
	//start the timer if it's in stop condition
	if (tmr.timerId) return;
	let interval = initialRun ? tmr.settings.startInterval : tmr.settings.interval;
	tmr.timerId = setTimeout(tmr.loop,interval)
};
tmr.stop=function(){
	//stop the timer if its running 
	clearTimeout(tmr.timerId);
	tmr.timerId=null;
};
tmr.set=function(){
	//change timer variables, should work mid run
	
};
tmr.restart=function(){
	//stop, then run. basically reset the timer's time
	tmr.stop();
	tmr.run();
};
/**/
//const msSecond = 1000, msMinute = msSecond*60, msHour=msMinute*60,msDay=msHour*24,msWeek=msDay*7,msMonth=msDay*30;
class Timer {
	constructor(interval=msMinute*10,startInterval=msSecond*10){
		this.settings =  {interval:interval,startInterval:startInterval};
		this.timerId = null;
	}
	loop(){
		reloadResults();
		this.timerId = setTimeout(()=>{this.loop()},this.settings.interval)
	}
	run(initialRun){
		//start the timer if it's in stop condition
		if (this.timerId) return;
		let interval = initialRun ? this.settings.startInterval : this.settings.interval;
		this.timerId = setTimeout(()=>{this.loop()},interval);
	}
	stop(){
		//stop the timer if its running 
		clearTimeout(this.timerId);
		this.timerId = null;
	}
	set(){
		//change timer variables, should work mid run
		
	}
	restart(){
		//stop, then run. basically reset the timer's time
		this.stop();
		this.run();
	}
}