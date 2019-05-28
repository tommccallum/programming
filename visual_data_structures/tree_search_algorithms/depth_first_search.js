class DepthFirstSearch extends TraversalAlgorithm {
	constructor() {
		super()
		this.actionStyle = "Visit After Children"
		this.animationContext = { "agenda": [] }
		this.name = "Depth First Search"
		this.abbrev = "DFS"			
	}
	
	// Traverse a tree using search method
	// when animating this we want to go one step at a time
	// so that the framerate of P5JS is what is driving the
	// animation not some arbitrary wait command	
	// @param agenda		list of nodes to visit, in animation mode, this is not used.
	// @param actFirst	if TRUE process current node before children
	// @param fn			callback function to operate on the node
	// @param animate		are we in animation mode
	// @return	nothing
	_traverse( agenda, actFirst, fn, animate=false  ) {
		let child = null;
		do {
			if ( animate === false ) {
				child = agenda.shift(); // make sure we pop from the FRONT of the array
			} else {
				if ( this.animationContext.stepCounter % 5 === 0 ) {
					const agendaLength = this.animationContext.agenda.length
					const parentLength = this.animationContext.parents.length
					const last_agenda = this.animationContext.agenda[agendaLength-1]
	
					console.log("[0] POP FROM AGENDA " + agendaLength  +" "+parentLength)
					
					if ( agendaLength === 0 ) { // if no more agendas to do then we are done
						if ( parentLength === 0 ) { // and we have no more parents to continue with then we are done
							this.animationContext.status = "complete"
							return
						} else {
							// we pop the parent we were just at and increase stepCounter by 4
							// so we pretend we are popping back out of the _traverse recursive call
							this.animationContext.agenda.pop() // remove empty agenda						
							child = this.animationContext.parents.pop()
							this.animationContext.stepCounter += 4
							console.log("POP")
						}
					} else { 
						// in this situation we have are deeper into the recursions so 
						// we are either moving through a child list or we need to pop
						// back up a level
						if ( last_agenda.length === 0 ) {
							// we pop the parent we were just at and increase stepCounter by 4
							// so we pretend we are popping back out of the _traverse recursive call
							this.animationContext.agenda.pop() // remove empty agenda
							if ( parentLength === 0 ) {
								this.animationContext.status = "complete"
								return					
							}
							child = this.animationContext.parents.pop()						
							this.animationContext.stepCounter += 4		
							console.log("POP")				
						} else {
							child = last_agenda.shift()
							console.log("[0] Pop off current agenda: "+child.index)
						}
					}
					this.animationContext.child = child // cache child for subsequent calls
					child.notify("selected")
				} else {
					// get current child from context
					child = this.animationContext.child
				}
			}
			console.log("CHILD: "+child.index)		
			
			if ( actFirst ) {
				if ( animate === false || this.animationContext.stepCounter % 5 === 1 ) {
					if ( animate ) {
						console.log("[1] EARLY ACTION")
					}
					this._performAction( fn, child, animate )
				}
			}
			
			
			if ( child.hasChildren() ) {
				if ( animate === false || this.animationContext.stepCounter % 5 === 2 ) {
					if ( animate ) {
						console.log("[2] ADD TO AGENDA")
					}
					if ( animate ) {
						// we push the current parent, which is where we will need to return to					
						this.animationContext.parents.push( child )
						// we push the new children on to the agenda so we have an array of arrays
						this.animationContext.agenda.push( [...child.children] )
						child.notify("agenda_changed", agenda)
					}
				}
			}		
		
			if ( animate === false || this.animationContext.stepCounter % 5 === 3 ) {
				if ( animate ) {
					if ( child.hasChildren() ) { // this stops us going down a level when there are no children
						console.log("[3] RECURSE DOWN")
						this.animationContext.stepCounter += 1 // move to next mod 5 === 0
						const agendaLength = this.animationContext.agenda.length
						const parentLength = this.animationContext.parents.length
						const last_agenda = this.animationContext.agenda[agendaLength-1]
						console.log("[-] PUSH PARENT: " + agendaLength  +" "+parentLength+" "+child.index)
						child.notify("push")
						return
					}
				} else {
					// if the node does not have any children then we need to execute the action now
					// otherwise the _traverse will move on to the next child node without this
					// one being executed
					if ( child.hasChildren() ) {
						console.log("traverse "+child.index)
						this._traverse( [...child.children], actFirst, fn, animate );
					}
				}
			}
			
			// if the node does have children, then we execute the current node once all
			// its children have been traversed
			if ( actFirst === false ) {
				if ( ( animate === false ) || this.animationContext.stepCounter % 5 === 4 ) {
					if ( animate ) {
						console.log("[4] LATE ACTION")
					}
					this._performAction( fn, child, animate )
				}
			}
			
		} while ( animate === false && agenda.length > 0 ) 
		
	}	// end of function
	
	
 } // end of class