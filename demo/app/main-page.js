var PopupMenu = require("./index")

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
