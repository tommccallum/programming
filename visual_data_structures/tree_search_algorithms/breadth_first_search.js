class BreadthFirstSearch extends TraversalAlgorithm {
	constructor() {
		super()
		this.actionStyle = "Visit After Children"
		this.animationContext = { "agenda": [] }
		this.name = "Breadth First Search"
		this.abbrev = "BFS"
	}
	
	//@Override
	_traverse( agenda, actFirst, fn, animate=false  ) {
		let childrenOnNextLayer = []
		if ( animate === false ) {
			// ideally we would write this bit animated but
			// its hard to keep correct. so I have separated them for now.
			for( let node of agenda ) {
				if ( actFirst ) this._performAction( fn, node, animate )
				if ( node.hasChildren() ) {
					childrenOnNextLayer = childrenOnNextLayer.concat( node.children )
				}
			}
			if ( childrenOnNextLayer.length > 0 ) {
				this._traverse( childrenOnNextLayer, actFirst, fn, animate )
			}
			for( let node of agenda ) {
				if ( actFirst === false ) this._performAction( fn, node, animate )
			}
		} else {
			let n = this.animationContext.agenda.length
			let curNodeList = this.animationContext.agenda[ n-1 ]
			if ( this.animationContext.loop2 ) {
				if ( this.animationContext.child === null ) {	
					if ( this.animationContext.childIndex < curNodeList.length ) {
						// select next node
						let child = curNodeList[ this.animationContext.childIndex ]
						this.animationContext.child = child
						child.notify( "selected" )
						return;
					} else {
						// finished second loop
						this.animationContext.agenda.pop()
						if ( this.animationContext.agenda.length === 0 ) {
							this.animationContext.status = "complete"
							return
						}
						
						// reset ready to POP back up the stack as if we were
						// exiting the function
						this.animationContext.child = null
						this.animationContext.childIndex = 0
						return
					}
				}
				if ( this.animationContext.child !== null ) {
					// this means we are in the second for loop, only visiting nodes
					if ( actFirst === false ) {
						const hasVisited = this.animationContext.visited.indexOf( this.animationContext.child.index )
						if ( hasVisited === -1 ) {
							this._performAction( fn, this.animationContext.child, animate )
							this.animationContext.visited.push( this.animationContext.child.index )
							return // we return here to give the node time to change to done, before moving on						
						}
					} 
					// move on to next iteration of second for loop
					this.animationContext.childIndex++
					this.animationContext.child = null
					return
				}
			} else {
				if ( this.animationContext.child === null ) {	
					if ( this.animationContext.childIndex < curNodeList.length ) {
						// select next node
						let child = curNodeList[ this.animationContext.childIndex ]
						this.animationContext.child = child
						child.notify( "selected" )
						return;
					} else {
						if ( this.animationContext.nextLayer.length === 0 ) {
							// if the nextLayer array is empty, this means all
							// the nodes on this level were children
							// so we can begin final for loop
							this.animationContext.loop2 = true
							this.animationContext.child = null
							this.animationContext.childIndex = 0
							return
						} else {
							// this is the end of the first for loop
							// we push the next layer on to our current agenda
							// reset as if we were recursing down
							this.animationContext.agenda.push( this.animationContext.nextLayer )
							this.animationContext.nextLayer = []
							this.animationContext.child = null
							this.animationContext.childIndex = 0
							return
						}
					}
				}
				if ( this.animationContext.child !== null ) {
					// this means we are in the first for loop, gathering up children
					if ( actFirst ) {
						const hasVisited = this.animationContext.visited.indexOf( this.animationContext.child.index )
						if ( hasVisited === -1 ) {
							this._performAction( fn, this.animationContext.child, animate )
							this.animationContext.visited.push( this.animationContext.child.index )
							return // we return here to give the node time to change to done, before moving on
						}
					} 
					// add children
					if ( this.animationContext.child.hasChildren() ) {
						this.animationContext.nextLayer = this.animationContext.nextLayer.concat( [...this.animationContext.child.children] )
						this.animationContext.child.notify("agenda_changed")
					}
					
					// move on to next item in the for loop
					this.animationContext.child = null
					this.animationContext.childIndex++
					return 
				}
			
			} // end of loop2
			
		}
		
	}	
	
	// @Override
	beginAnimation( root ) {
		console.log("STARTING ANIMATION OF: "+this.name)
		const me = this;
		this.animationContext = { "nodeIndex": 1, 
										  "agenda":[[root]], 
										  "actFirst": this.actionStyle === "Visit Before Children", 
										  "callback": function(node) { console.log(me.abbrev+ " "+node.index); }, 
										  "stepCounter": 0,
										  "status": "in progress",
										  "parents":[],
										  "nextLayer":[],
										  "childIndex":0,
										  "visited":[],
										  "loop2":false,
										  "child": null
										  }
	}
	
}