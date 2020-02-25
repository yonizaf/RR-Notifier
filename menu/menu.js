function createRow(listItem){
	let row = document.createElement("div");
	row.textContent=listItem.bookTitle;
	row.title=listItem.chapTitle;
	row.className="button";
	return row;
	//document.getElementById("unread-list").append(row);
}

document.getElementById("check-now").addEventListener("click",function(){reloadResults()} );
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