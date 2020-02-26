const msSecond = 1000, msMinute = msSecond*60, msHour=msMinute*60,msDay=msHour*24,msWeek=msDay*7,msMonth=msDay*30;
function createRow(listItem){
	let row = document.createElement("div");
	row.textContent=listItem.bookTitle;
	row.title=listItem.chapTitle;
	row.className="button";
	return row;
	//document.getElementById("unread-list").append(row);
}
function timeAgo(time){
	const units = [{unit:"hour",value:msHour},{unit:"minute",value:msMinute},{unit:"second",value:msSecond}]
	if (typeof(time)=="object") time=time.getTime();
	let timeDiff = Date.now()-time;
	let agoStr = "";
	for (let i in units){
		if (timeDiff >= units[i].value ) {
			let amount = Math.floor(timeDiff / units[i].value);
			agoStr += amount + " " + units[i].unit+(amount == 1 ? " ": "s ");
			timeDiff -= (amount*units[i].value);
		}
	}
	agoStr += "ago";
	return agoStr;
}
function updateTimeSince(){
	browser.storage.local.get("lastCheck").then(result => {
		var title = "Last check was " + timeAgo(result.lastCheck);
		document.getElementById("time-since").title=title;	
	});
}

document.getElementById("time-since").addEventListener("mouseover",updateTimeSince);

var page = browser.extension.getBackgroundPage();

document.getElementById("version-info").textContent = browser.runtime.getManifest().version;

document.getElementById("check-now").addEventListener("click",function(){page.reloadResults()} );
document.getElementById("set-updated").addEventListener("click",function(){
	browser.storage.local.get("lastCheck").then(result => {
	browser.storage.sync.set({lastUpdated:result.lastCheck})
	})
} );
document.getElementById("open-rr").addEventListener("click",function(){
	browser.tabs.create({
    url:"https://www.royalroad.com/my/follows",
	active:true
  });
});

browser.storage.local.get({"unread":{count:0,list:[]}}).then((result=>{
	let unread=result.unread;
	if (!unread.count) return;
	let rows = unread.list.map(createRow)
	document.getElementById("unread-list").append(...rows);
	//for (let i =0; i < unread.list.length;i++){
	//	createRow(unread.list[i])
	//}
}));
/**/