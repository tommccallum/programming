/**
Copyright 2019 Tom McCallum

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


// Base class for all traversal algorithms
class TraversalAlgorithm {
	constructor() {
		this.actionStyle = "Visit After Children"
		this.animationContext = { "agenda": [] }
		this.name = "Generic Traversal Algorithm"
		this.abbrev = "NA"		
	}
	
	setActionStyle( actionStyle ) {
		this.actionStyle = actionStyle
	}
	
	// Label all nodes in the order that 
	// they are traversed by this search method
	setIndex( root ) {
		let agenda = [root];
		let counter = 0
		this._traverse( agenda, true, function( node ) { 
				node.index = counter + 1
				counter++ 
		});	 	 
	}
	
	_performAction( fn, child, animate=false ) {
			if ( animate ) {
				child.notify("before_action")
			}
			if ( typeof(fn) !== "undefined" && fn !== null ) {
				fn( child )
			}
			if ( animate ) {
				child.notify("after_action")
			}		
	}	
	
	_traverse( agenda, actFirst, fn, animate=false ) {
	}
	
	visit( node, fn ) {
		let agenda = [node]
		this._traverse( agenda, this.actionStyle === "Visit Before Children", fn, false )
	}
	
	beginAnimation( root ) {
		console.log("STARTING ANIMATION OF: "+this.name)
		const me = this;
		this.animationContext = { "nodeIndex": 1, 
										  "agenda":[[root]], 
										  "actFirst": this.actionStyle === "Visit Before Children", 
										  "callback": function(node) { console.log(me.abbrev+ " "+node.index); }, 
										  "stepCounter": 0,
										  "status": "in progress",
										  "parents":[]
										  }
	}
	
	nextAnimationFrame() {
		if ( this.animationContext.status === "complete" ) {
			return;
		}
		//console.log("ANIMATE: "+this.animationContext.stepCounter)
		this._traverse( this.animationContext.agenda, 
								this.animationContext.actFirst, 
								this.animationContext.callback, 
								true )
		this.animationContext.stepCounter++
	}
	
	isAnimationFinished() {
		return this.animationContext.status === "complete"
	}

	// Draw agenda items
	// @param x			leftmost item
	// @param height	height of agenda items bar for rectangle around number
	// @return nothing	
	drawAgendaItems(x, y, height) {
		for( let a of this.animationContext.agenda ) {
			for( let b of a ) {
				x = b.drawAsAgendaItem(x, y, height)
			}
		}
	}	
	
	// Draw stack items
	// @param x			leftmost item
	// @param height	height of agenda items bar for rectangle around number
	// @return nothing	
	drawStackItems(x, y, height) {
		for( let a of this.animationContext.parents ) {
			x = a.drawAsAgendaItem(x, y, height)
		}
	}	
}