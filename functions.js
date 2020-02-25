const msSecond = 1000, msMinute = msSecond*60, msHour=msMinute*60,msDay=msHour*24,msWeek=msDay*7,msMonth=msDay*30;

function toggleTitle(title) {
  if (title == "this") {
    browser.browserAction.setTitle({title: "that"});
  } else {
    browser.browserAction.setTitle({title: "this"});
  }
}

function onError(){
	browser.browserAction.setIcon({path: "/icons/icon-red-32.png"}).then(
	browser.browserAction.setBadgeBackgroundColor({color:"red"})).then(
	browser.browserAction.setBadgeText({text:"E"}));
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function reloadResults(){
	var lastUpdated;
	
	await browser.browserAction.setBadgeText({text: ""}).then(
	browser.browserAction.setIcon({path: "/icons/icon-wait-32.png"})).then(
	browser.storage.sync.get({lastUpdated:0}, result => {lastUpdated=result.lastUpdated})
	);
	//await timeout(3000);
	fetch('https://www.royalroad.com/my/follows?listType=v2').then(function(response) {
			return response.text();
		}).then(function(html) {
			var parser = new DOMParser();
			var doc = parser.parseFromString(html, "text/html");
			var unread = {count:0,list:[]};
			var rows = doc.querySelectorAll("#result>.fiction-list-item.row")
			for (let i = 0; i<rows.length;i++){
				let row = rows[i];
				let time = row.querySelector("time").title + " GMT";
				let timestamp = new Date(time).getTime()
				let isNew = (timestamp - lastUpdated) > 0;
				if (isNew && row.querySelector(".fas.fa-circle")){
					let listItem = {bookTitle:"",chapTitle:"",timeText:time,timestamp:timestamp}
					listItem.bookTitle=row.querySelector(".fiction-title").textContent.trim();
					listItem.chapTitle=row.querySelector(".list-item span").textContent.trim();
					unread.list.push(listItem)
				}
			}
			unread.count = unread.list.length;
			return unread;
		}).then(function(unread) {
			browser.storage.local.set({"unread":unread})
			browser.browserAction.setIcon({path: "/icons/icon-32.png"})
			browser.browserAction.setBadgeBackgroundColor({color:"gold"})
			browser.browserAction.setBadgeText({text: unread.count?unread.count.toString():""});
		}).catch(onError);
}
