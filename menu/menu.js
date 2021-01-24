const msSecond = 1000, msMinute = msSecond*60, msHour=msMinute*60,msDay=msHour*24,msWeek=msDay*7,msMonth=msDay*30;
function createRow(listItem){
	let row = document.createElement("div");
	let book = document.createElement("div");
	let bookLink = document.createElement("div");
	let chapter = document.createElement("div");
	let lastLink = document.createElement("div");
	let nextLink = document.createElement("div");
	let chapterLink = document.createElement("div");
	let time = document.createElement("div");
	let links = document.createElement("div");
	let linkIcon = document.createElement("span");
	row.className="row";
	book.textContent = book.title = listItem.bookTitle;
	chapter.textContent=listItem.chapTitle;
	chapter.title="Last Read: " + listItem.lastReadTitle;
	bookLink.title=listItem.bookUrl;
	bookLink.textContent = "Fiction";
	chapterLink.title=listItem.chapUrl;
	chapterLink.textContent = "Newest"; // alternative: \uF360
	lastLink.title=listItem.lastReadLink;
	lastLink.textContent="Last";
	nextLink.title=listItem.nextUrl;
	nextLink.textContent="Next";
	linkIcon.textContent = "\uF35D"; // alternative: \uF360
	linkIcon.className = "link fas";
	time.textContent=timeAgo(listItem.timestamp,true);
	time.title=listItem.timeText;
	time.className="time";
	//common link actions
	allLinks = [bookLink,chapterLink,nextLink,lastLink];
	allLinks.forEach(link => {
		link.addEventListener("click",openTitleLink);
		link.className = "button";
		link.append(linkIcon.cloneNode(true))
	})
	//if error message, style differently
	if (listItem.error){
		row.className="error";
		book.textContent=listItem.error;
		if (listItem.error == "Login Required"){
			bookLink.textContent="Login";
			bookLink.title="https://www.royalroad.com/account/login?ReturnUrl=%2Fmy%2Ffollows";
			book.append(bookLink);
		}
		row.append(book);
		return row;	
	}
	//all appends in the end
	links.append(...allLinks)
	row.append(book,chapter,links,time)
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
		browser.storage.sync.get("hideBefore").then(result => {
			if (result.hideBefore) title += "\nOnly results since (" + timeAgo(result.hideBefore,true) + ") are shown.";
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
			browser.storage.sync.set({hideBefore:result.lastCheck}),
			browser.storage.local.set({"unread":{count:0,list:[]}}),
			browser.browserAction.setBadgeText({text: ""})
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
	browser.storage.local.get({"unread":{count:0,list:[]}}).then((result=>{
		document.querySelectorAll("#unread-list>.row").forEach(row=>row.remove());
		let unread=result.unread;
		if (!unread.count) return;
		let rows = unread.list.map(createRow)
		document.getElementById("unread-list").append(...rows);
	}));
}
populateList();
/**/