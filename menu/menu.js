const msSecond = 1000, msMinute = msSecond*60, msHour=msMinute*60,msDay=msHour*24,msWeek=msDay*7,msMonth=msDay*30;
function createRow(listItem){
	let row = document.createElement("div");
	let book = document.createElement("div");
	let bookLink = document.createElement("img");
	let chapter = document.createElement("div");
	let chapterLink = document.createElement("img");
	let time = document.createElement("div");
	row.className="row";
	book.textContent=listItem.bookTitle;
	chapter.textContent=listItem.chapTitle;
	chapter.title="Last Read: " + listItem.lastReadTitle;
	bookLink.title=listItem.bookUrl;
	chapterLink.title=listItem.chapUrl;
	bookLink.src = chapterLink.src = "../icons/external.svg";
	bookLink.className = chapterLink.className = "link";
	time.textContent=timeAgo(listItem.timestamp,true);
	time.title=listItem.timeText;
	time.className="time";
	//event handlers
	bookLink.addEventListener("click",openTitleLink)
	chapterLink.addEventListener("click",openTitleLink)
	//all appends in the end
	chapter.append(chapterLink);
	book.append(bookLink);
	row.append(book,chapter,time)
	return row;
}
function timeAgo(time,biggerUnits){
	const units = [{unit:"day",value:msDay},{unit:"hour",value:msHour},{unit:"minute",value:msMinute},{unit:"second",value:msSecond}]
	if (typeof(time)=="object") time=time.getTime();
	let timeDiff = Date.now()-time;
	let agoStr = "";
	for (let i in units){
		if (timeDiff >= units[i].value ) {
			let amount = Math.floor(timeDiff / units[i].value);
			agoStr += amount + " " + units[i].unit+(amount == 1 ? " ": "s ");
			timeDiff -= (amount*units[i].value);
			if (biggerUnits) break;
		}
	}
	agoStr += "ago";
	return agoStr;
}
function updateTimeSince(){
	browser.storage.local.get("lastCheck").then(result => {
		var title = "Last check was " + timeAgo(result.lastCheck);
		browser.storage.sync.get("lastUpdated").then(result => {
			if (result.lastUpdated) title += "\nOnly results since (" + timeAgo(result.lastUpdated,true) + ") are shown.";
			document.getElementById("time-since").title=title;	
		});
	});
}
function openTitleLink(e){
	browser.tabs.create({
		url:e.target.title,
		active:true
	  });
	window.close();
}

document.getElementById("time-since").addEventListener("mouseover",updateTimeSince);

var page = browser.extension.getBackgroundPage();

document.getElementById("version-info").textContent = browser.runtime.getManifest().version;

document.getElementById("check-now").addEventListener("click",function(){
	page.reloadResults().then(()=>{
		populateList();
	})
});
document.getElementById("set-updated").addEventListener("click",function(){
	browser.storage.local.get("lastCheck").then(result => {
		return Promise.all ([
			browser.storage.sync.set({lastUpdated:result.lastCheck}),
			browser.storage.local.set({"unread":{count:0,list:[]}})
		])
	}).then(()=>{
		window.close();
	});
} );
document.getElementById("open-rr").addEventListener("click",function(){
	browser.tabs.create({
    url:"https://www.royalroad.com/my/follows",
	active:true
  }).then(()=>{
	  window.close();
  });
});

function populateList(){
	document.querySelectorAll("#unread-list>.row").forEach(row=>row.remove());
	browser.storage.local.get({"unread":{count:0,list:[]}}).then((result=>{
		let unread=result.unread;
		if (!unread.count) return;
		let rows = unread.list.map(createRow)
		document.getElementById("unread-list").append(...rows);
	}));
}
populateList();
/**/