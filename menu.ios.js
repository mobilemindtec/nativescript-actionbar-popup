
var frameModule = require("@nativescript/core/ui/frame")
var Color = require("@nativescript/core/color").Color

var TapHandler = NSObject.extend({

	init: function() {
		var self = this.super.init()
		return self
	},

	itemTap: function(sender){
		
		if(callback.itemTap)
			callback.itemTap(sender.view.text)

		menuClose()
	}

}, {
	name: "TapHandler",
	exposedMethods:{
		itemTap: { returns: interop.types.void, params: [ UITapGestureRecognizer ] }
	}
})


var TAG_VIEWS = 9998

var callback = {}
var tapHandler = TapHandler.alloc().init()
var menuView



function menuClose() {
	CGAffineTransformMakeScale(1,1)
	UIView.beginAnimationsContext("fadeOutNewView", null)
	

	UIView.animateWithDurationAnimationsCompletion(0.3, function(){
		menuView.alpha = 0
	}, function(){
		menuView.removeFromSuperview()
	})

	menuView.transform = CGAffineTransformMakeScale(0.1,0.1)
	menuView.alpha = 0
	UIView.commitAnimations()	
}

function menuOpen(){
	var controller = frameModule.Frame.topmost().ios.controller 
	controller.view.addSubview(menuView)
	menuView.transform = CGAffineTransformMakeScale(0.1,0.1)
	UIView.beginAnimationsContext("fadeInNewView", null)
	UIView.setAnimationDuration(0.3)
	menuView.transform = CGAffineTransformMakeScale(1,1)
	menuView.alpha = 1
	UIView.commitAnimations()

}

// call in delegate
exports.menuTouchesBeganWithEvent = function(touches, event){

	if(menuView && touches){
		var touch = touches.anyObject()
		if(touch && touch.view){

			if(TAG_VIEWS != touch.view.tag){
				menuClose()
			}
			
		}
	}
}



exports.hide = function(){
	menuClose()
}

exports.show = function(){
	var controller = frameModule.Frame.topmost().ios.controller 
	if(!menuView.isDescendantOfView(controller.view)){		
		menuOpen()
	}
}

exports.toggle = function(){
	var controller = frameModule.Frame.topmost().ios.controller 
	if(!menuView.isDescendantOfView(controller.view)){
		menuOpen()
	}else{
		menuClose()
	}
}


/* 

	params = {
		values: [],
		font: {
			size: 14,
			family: undefined,
			color: #000
		},		
		viewCreated: (view) => {},
		itemTap: (value) => {},
		bgColor: #fff,
		tag: 9998
	}

*/
exports.configure = function(params) {

	
	params.font = params.font || {}

	TAG_VIEWS = params.tag || TAG_VIEWS

	var whiteColor = UIColor.whiteColor
	var blackColor = UIColor.blackColor

	var font = UIFont.systemFontOfSize(14.0)	 //UIFont.fontWithNameSize("Thaoma", 15.0)	


	var values = params.values
	var bgColor = params.bgColor ? new Color(params.bgColor).ios : whiteColor
	var fontSize = params.font.size ? params.font.size : 14
	var fontColor = params.font.color ? new Color(params.font.color).ios : blackColor
	var fontFamily = params.font.family ? params.font.family : undefined	
	var font = fontFamily ? UIFont.fontWithNameSize(fontFamily, fontSize)	: UIFont.systemFontOfSize(fontSize)


	callback.itemTap = params.itemTap
	callback.viewCreated = params.viewCreated

		
  var controller = frameModule.Frame.topmost().ios.controller 
  var navSize = controller.navigationBar.frame.size
  var navOrigin = controller.navigationBar.frame.origin
  var maxWidth = navSize.width*0.55 // max width 55% of view width
  var minWidth = navSize.width*0.35 // max width 55% of view width
  var height = values.length * 40 + 20 // 30 label height, 20 = margin
  var maxNameSize = 0

  for(var i = 0; i < values.length; i++){
  	var gsize = NSString.stringWithString(values[0]).sizeWithFont(font)    	
  	if(gsize.width > maxNameSize) 
  		maxNameSize = gsize.width
  }

  width = maxWidth
  maxNameSize += 80

  if(maxNameSize < minWidth)
  	width = minWidth
  else if(maxNameSize < maxWidth)
  	width = maxNameSize


  
  var frame = CGRectMake(navSize.width - width, (navOrigin.y + navSize.height) * .90, width, height)
  menuView = UIView.alloc().initWithFrame(frame)
  menuView.backgroundColor = bgColor
  menuView.tag = TAG_VIEWS

	menuView.layer.masksToBounds = false
	menuView.layer.shadowOffset = CGSizeMake(-4, 4)
	menuView.layer.shadowRadius = 5
	menuView.layer.shadowOpacity = 0.3; 



 	var labels = createLabels(menuView, width, font, fontColor, values)

 	for(var i = 0; i < labels.length; i++){
 		menuView.addSubview(labels[i])	
 	}

  
  menuView.alpha = 0

	
  if(callback.viewCreated)
  	callback.viewCreated(menuView)
}

function createLabels(view, width, font, fontColor, values){

	console.log(view)
	console.log(width)
	console.log(font)
	console.log(fontColor)
	console.log(values)

	var labels = []
	var position = 10
	var height = 40

	for(var i = 0; i < values.length; i++){

	  var label = UILabel.alloc().initWithFrame(CGRectMake(10, position, width, height))
	  label.text = values[i]	  
	  label.textColor = fontColor
	  label.font = font

	  labels.push(label)

	  
	  var tapRecognizer = UITapGestureRecognizer.alloc().initWithTargetAction(tapHandler, "itemTap")
	  tapRecognizer.numberOfTapsRequired = 1
    label.addGestureRecognizer(tapRecognizer)
    label.userInteractionEnabled = true
    label.tag = TAG_VIEWS


	  position += height
		
	}
  return labels
}
