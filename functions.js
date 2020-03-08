const msSecond = 1000, msMinute = msSecond*60, msHour=msMinute*60,msDay=msHour*24,msWeek=msDay*7,msMonth=msDay*30;


function showHidden (showAll) {// --- temporary debug function until option is added to reset hideBefore --- //
	browser.storage.sync.set({hideBefore:showAll?0:Date.now()-msDay*30});
	reloadResults();
}

function onError(e){
	let errorText = e.message || e;
	browser.browserAction.setIcon({path: "/icons/icon-red-32.png"})
	browser.browserAction.setTitle({title: "Error: "+errorText});
	browser.browserAction.setBadgeBackgroundColor({color:"red"})
	browser.browserAction.setBadgeText({text:e.message?e.message[0]:"E"});
	console.error(errorText);
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function reloadResults(fromTimer){
	var hideBefore;
	var baseURL = "https://www.royalroad.com";
	
	browser.browserAction.setIcon({path: "/icons/icon-grey-32.png"})
	browser.browserAction.setBadgeBackgroundColor({color:"#00000000"})
	browser.browserAction.setBadgeText({text: "⏳"});
	await browser.storage.sync.get({hideBefore:0}, result => {hideBefore=result.hideBefore})
	
	//await timeout(3000);
	await fetch(baseURL+'/my/follows?listType=v2').then(function(response) {
			return response.text();
		}).then(function(html) {
			var parser = new DOMParser();
			var doc = parser.parseFromString(html, "text/html");
			var unread = {count:0,list:[]};
			if (doc.body.className == "login"){
				return Promise.reject(new Error('Login Required'))
			}
			var rows = doc.querySelectorAll("#result>.fiction-list-item.row")
			for (let i = 0; i<rows.length;i++){
				let row = rows[i];
				let time = row.querySelector("time").title + " GMT";
				let timestamp = new Date(time).getTime()
				let isNew = (timestamp - hideBefore) > 0;
				if (isNew && row.querySelector(".fas.fa-circle")){
					let listItem = {
						bookTitle:"",
						chapTitle:"",
						lastReadTitle:"",
						bookUrl:"",
						chapUrl:"",
						timeText:time,
						timestamp:timestamp
					}
					listItem.bookTitle=row.querySelector(".fiction-title").textContent.trim();
					listItem.chapTitle=row.querySelector(".list-item span").textContent.trim();
					listItem.lastReadTitle=row.querySelector(".list-item:nth-of-type(2) span").textContent.trim();
					listItem.bookUrl=baseURL+row.querySelector(".fiction-title a").getAttribute("href");
					listItem.chapUrl=baseURL+row.querySelector(".list-item a").getAttribute("href");
					unread.list.push(listItem)
				}
			}
			unread.count = unread.list.length;
			return unread;
		}).then(function(unread) {
			return Promise.all([
				browser.storage.local.set({"lastCheck":Date.now()-msSecond}),
				browser.storage.local.set({"unread":unread}),
				browser.browserAction.setIcon({path: "/icons/icon-32.png"}),
				browser.browserAction.setBadgeBackgroundColor({color:"gold"}),
				browser.browserAction.setTitle({title: unread.count+" fictions with unread chapters"}),
				browser.browserAction.setBadgeText({text: unread.count?unread.count.toString():""})
			])
		}).catch(onError);
	if (tmr && !fromTimer) {
		if (console && console.info) console.info("Manual check! Timer id is "+tmr.timerId+".\n Time: "+new Date());
		tmr.restart();
	}
}
