// Tree data structure for making it easier to build trees
class Tree {
	
	constructor( childrenPerNode=0, layers = 1) {
		this.childrenPerNode = childrenPerNode;
		this.layers = layers;
		this.nodeCounter = 1
		this.root = this._createRootTreeNode() // creates new tree
	}
	
	_createRootTreeNode() {
		let node = new TreeNode( createVector(0,0), NODE_DIAMETER )
		node.parent = null
		node.layer = 1
		node.childIndex = 0
		node.index = this.nodeCounter
		this.nodeCounter++
		this._addEventHandlersToNode( node )
		this._addChildren(node, 1)
		return node
	}

	// Add all subchildren of a tree, created in breadth first order
	// @param node				node whose children we want to create
	// @param currentLayer 	number starting at 1 (root layer)
	_addChildren( node, currentLayer ) {
		if ( currentLayer < this.layers ) {
			for( let ii=0; ii < this.childrenPerNode; ii++ ) {
				let child = new TreeNode( createVector(0,0), NODE_DIAMETER )
				child.parent = node
				child.layer = currentLayer+1
				child.childIndex = ii
				child.index = this.nodeCounter
				this.nodeCounter++
				this._addEventHandlersToNode( child )
				node.add( child )
			}
			
			// recurse down the tree until we hit the required number
			// of layers						
			for( let child of node.children ) {		
				this._addChildren( child, currentLayer+1 )
			}
		} 
	}

	width() {
		return this._width(this.root)
	}
	
	_width( node ) {
		if ( node.hasChildren() ) {
			let total = 0
			for( let child of node.children ) {
				total += child.visit( this._width );
			}
			total += ( node.children.length - 1 ) * GAP_BETWEEN_NODES
			return total
		} else {
			return node.diameter
		}
	}

	height() {
		return this._height(this.root)
	}
	
	_height(node) {
		if ( node.hasChildren() ) {
			let height = LAYER_HEIGHT
			let total = []
			for( let child of node.children ) {
				total.push(child.visit( this._height ));
			}
			let maxLayerHeight = total.reduce( function(a,b) { return Math.max(a,b) } )
			return height + maxLayerHeight
		} else {
			return NODE_DIAMETER
		}
	}

	// Add default handlers for a node in the tree
	_addEventHandlersToNode(child) {
		child.addListener( "selected", function(node) {
			if ( !node.processed ) {
				node.backgroundColor = "blue"
			}
		});
		child.addListener( "before_action", function(node) {
			if ( !node.processed ) {
				node.backgroundColor = "orange"
			}
		});
		child.addListener( "after_action", function(node) {
			node.backgroundColor = "green"
			node.processed = true
		});
		child.addListener( "agenda_changed", function(node, agenda) {
			if ( !node.processed ) {
				node.backgroundColor = "pink"
			}
		});
		child.addListener( "push", function(node, agenda) {
			if ( !node.processed ) {
				node.backgroundColor = "gray"
			}
		});
	}
	
}