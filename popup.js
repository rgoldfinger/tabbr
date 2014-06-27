
var tabbr = {

  listAllTabs: function () {
    chrome.tabs.getAllInWindow(function (currentTabs) {
      var title = document.createElement('div');
      title.innerHTML = 'You have '  + currentTabs.length + ' tabs open. This is too many and you will get lost and confused.' ;
      document.body.appendChild(title);
    });

  },
  manageTabs: function(maxTabs) {
    chrome.tabs.getAllInWindow(function (currentTabs) {
      var node = document.getElementById('status');
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
      node.innerHTML = 'You have '  + currentTabs.length + ' tabs open. This is too many and you will get lost and confused.' ;

      var del = document.getElementById('deleted');
      while (del.hasChildNodes()) {
        del.removeChild(del.firstChild);
      }
      

      tabbr.storeTabs(currentTabs);

      if (currentTabs.length > maxTabs) {


        del.innerHTML = 'Ok, Now I\'m serious. I\'m closing some tabs now.';



        var oldestID = tabbr.getOldestTab();
        // tabbr.saveClosingTab(oldestID);
        chrome.tabs.remove(oldestID);
        delete tabbr.tabsStore[oldestID];
      }
    });

  },

  saveClosingTab: function(closingTabID) {
    var tab = chrome.tabs.get(closingTabID);

    var bookmark = {
      'title': tab.title || "title",
      'url': tab.url || "url"
    };

    chrome.bookmarks.create(bookmark, function(bk) {
      console.log("bookmark create!");
      console.log(bk);
    });
  },

  folderID: '',

  storeTabs: function(tabs) {
    for ( var i = 0; i < tabs.length; i ++) {
      if (!(tabbr.tabsStore.hasOwnProperty(tabs[i].id))){
       tabbr.tabsStore[tabs[i].id] = Date.now();
     }
    }
  },

  tabsStore: {},

  getOldestTab: function () {
    var oldest = [0, 0]; //will store tab ID and time first seen
    for (var key in tabbr.tabsStore) {
      if (tabbr.tabsStore[key] > oldest[1]) {
        oldest = [key, tabbr.tabsStore[key]];
      }

    }
    return parseInt(oldest[0]);

  }





};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {

  setInterval(function() {
    tabbr.manageTabs(5);
  }, 1000);
});
