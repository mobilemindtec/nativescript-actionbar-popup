# nativescript-actionbar-popup
IOS Action Bar PopUp Menu


## Configure

```

var PopupMenu = require("nativescript-actionbar-popup")

exports.onNavigatingTo = function(args) {

	PopupMenu.configure({
		values: ["Show", "Edit"],
		font: {
			size: 14,
			family: undefined,
			color: "#000000"
		},		
		viewCreated: (view) => { console.log("menu view created") },
		itemTap: (value) => { console.log("item taped: " + value) },
		bgColor: "#ffffff",
		tag: 9998
	})

}

exports.onPopup = function(){
	PopupMenu.toggle()
}


```


To enable global close popup when user touch out of menu

```

if (application.ios) {
	var PopupMenu = require("nativescript-actionbar-popup")
  MyDelegate = UIResponder.extend({

  	touchesBeganWithEvent: function(touches, event){
  		PopupMenu.touchesBeganWithEvent(touches, event)
  	}
           

  }, {
    name: "MyDelegate",
    protocols: [UIApplicationDelegate]
  });
  application.ios.delegate = MyDelegate;
}


```

![alt text](https://github.com/mobilemindtec/nativescript-actionbar-popup/blob/master/screen.png)
