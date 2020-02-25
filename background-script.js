
browser.browserAction.onClicked.addListener(() => {
  reloadResults();
});

var tmr = new Timer();
tmr.run(true);
