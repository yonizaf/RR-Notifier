//const msSecond = 1000, msMinute = msSecond*60, msHour=msMinute*60,msDay=msHour*24,msWeek=msDay*7,msMonth=msDay*30;
class Timer {
	constructor(interval=msMinute*10,startInterval=msSecond*10){
		this.settings =  {interval:interval,startInterval:startInterval};
		this.timerId = null;
	}
	loop(){
		if (console && console.info) console.info("Timer Loop! Timer id is "+this.timerId+".\n Time: "+new Date());
		reloadResults(true);
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