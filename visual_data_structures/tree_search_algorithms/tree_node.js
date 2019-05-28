var TreeNodeEvents = [ "selected", "before_action", "after_action", "agenda_changed", "push"]

class TreeNode {
	
	constructor( center, diameter ) {
		this.center = center 
		this.diameter = diameter
		this.index = "A"
		this.backgroundColor = "yellow"
		this.borderColor = "yellow"
		this.children = []
		this.layer = 1
		this.parent = null
		this.childIndex = 0
		this.listeners = {}			// map of event strings to array of listeners
	}

	// Check if user supplied action is a valid event string
	// @return boolean	true if string is valid action, false otherwise
	_isValidEvent(actionLabel) {
		return TreeNodeEvents.indexOf(actionLabel) !== -1 
	}

	// Add a callback to listen to a property change
	// @param 	actionLabel		string value of property to listen to
	// @param 	callback			function to call when property changes
	// @return nothing
	addListener( actionLabel, callback ) {
		if ( this._isValidEvent( actionLabel) === false ) {
			console.log("[TreeNode::addListener] invalid event label specified (" + actionLabel+")")
			return
		}
		if ( actionLabel in this.listeners ) {
			this.listeners[ actionLabel ].push( callback )
		} else {
			this.listeners[ actionLabel ] = [ callback ]
		}
	}
		
	// Add a child to this node
	// @return nothing
	add( treeNode ) {
		this.children.push( treeNode )
	}	

	// Does this node have any child nodes?
	// @return 	boolean	true if node has children, false otherwise
	hasChildren() {
		return this.children.length !== 0
	}
	
	// Notify node that a change has taken place
	// @param 	actionLabel		string indicating the property that has changed
	// @param	agenda			optional variable to pass on to the callback
	// @return 	nothing
	notify( actionLabel, agenda ) {
		if ( actionLabel in this.listeners ) {
			const listeners = this.listeners[ actionLabel ]
			for( let listener of listeners ) {
				listener( this, agenda )
			}
		}
	}

	// implement visitor pattern	
	// @param  callback	callback that takes 1 argument which is the current node
	visit( callback ) {
		return callback( this )
	}
	
	// Draws this node as a circle with number in the middle.
	// Recursively calls draw on child nodes
	// @return nothing
	draw() {
		// first we draw the arcs between nodes
		stroke(0)
		for( let t of this.children ) {	
			line( t.center.x, t.center.y, this.center.x, this.center.y )
		}		
		push();
		translate( this.center.x, this.center.y );
		stroke( this.borderColor );
		fill( this.backgroundColor );
		circle( 0, 0, this.diameter );
		textSize(16);
		textAlign( CENTER, CENTER )
		stroke(0);
		fill(0);
		text( ""+this.index, 0, 0 );
		pop()
		
		for( let t of this.children ) {
			t.draw()
		}
		
	}
	
	// Draws this node as a rectangle with a value in at a point on the canvas
	// @param 	top			the x coordinate to draw representing the LEFT
	// @param 	left			the y coordinate to draw representing the TOP
	// @param 	height		the height of the box being drawn
	// @return nothing
	drawAsAgendaItem(top,left,height) {
		push()

		// moved to top left
		translate(left,top)
		const label = " "+this.index+" "
		textSize(16)
		const w = textWidth(label)
		fill(0)
		rect( 0, 0, w, height )
		
		textAlign(CENTER,CENTER)
		stroke("white")
		fill("white")
		push()
		translate(w/2,height/2)		
		text(label, 0, 0)
		pop()
		
		pop()
		return left + w;
	}	
	
}
