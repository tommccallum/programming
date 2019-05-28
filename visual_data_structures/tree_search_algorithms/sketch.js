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

let DEBUG = false;										// verbose output to console for debugging 
let graph = null;											// tree object that we will keep track of
let NODE_DIAMETER = 50									// the diameter of the node node
let GAP_BETWEEN_NODES = 20								// the gap between two nodes on the same layer with the same parent
let LAYER_HEIGHT = 100 									// the height between each layer
let GRAPH_Y_OFFSET = 150 								// top of the root node from top of canvas
let GRAPH_X_OFFSET = 10 								// leftmost node x coordinate
let numberOfChildNodesSlider = null;				// slider object for user to select number of children per node
let numberOfLayersSlider = null;						// slider object for user to select number of layers
let numberOfChildNodes=-1								// variable to hold user-selected number of child nodes
let numberOfLayers = -1									// variable to hold user-selected number of layers
let traversalStyleSelect = null						// select control for user to choose search style
let actionStyleSelect = null							// select control for user to choose when a node is processed
let traversalStyle = null								// variable to hold user-selected traversal style
let actionStyle = "Visit After Children"			// variable to hold user-selected action style
let is_animating = false								// has the user pressed the "Start Traversal" button


/**
 * Creates a tree of the required size
 * @param 	childNodeCount		number of children per node
 * @param 	layerCount			number of layers in tree
 * @return 	tree 
 */
function createTree( childNodeCount, layerCount ) {
	const tree = new Tree( childNodeCount, layerCount )	
	const dfs = new DepthFirstSearch()
	dfs.setActionStyle("Visit After Children")
	
	// first assign all nodes to left side at appropriate layer
	let leftmost_x = GRAPH_X_OFFSET //+ NODE_DIAMETER/2	
	dfs.visit( tree.root, function( node ) {
		if ( node.hasChildren() ) {
			let n = node.children.length
			// place this node in the middle of its children
			let x = node.children[0].center.x + (node.children[n-1].center.x - node.children[0].center.x) / 2
			node.center = createVector( x, NODE_DIAMETER/2 + GRAPH_Y_OFFSET + ( (node.layer-1) * LAYER_HEIGHT ) );
			leftmost_x = node.children[n-1].center.x + NODE_DIAMETER //+ GAP_BETWEEN_NODES
		} else {
			let x = leftmost_x + ( node.childIndex * GAP_BETWEEN_NODES ) + ( node.childIndex * NODE_DIAMETER ) + ( NODE_DIAMETER / 2 )  
			node.center = createVector( x, NODE_DIAMETER/2 + GRAPH_Y_OFFSET + ( (node.layer-1) * LAYER_HEIGHT ) );
		}
	}) 

	if ( DEBUG ) {
		dfs.visit( tree.root, function( node ) {
			console.log("["+node.index+"] P:"+( node.parent === null ? "N/A" : node.parent.index)+" L:"+node.layer+" CHILD:"+node.childIndex +" X:"+node.center.x+" Y:"+node.center.y)
		})
	}
	
	return tree
}

/**
 * Builds a new tree after testing for any changes to global variables
 * @param 	childNodeCount		number of children per node
 * @param 	layerCount			number of layers in tree
 * @return 	tree 
 */ 
function buildTreeIfUserInputChanged(tree, childrenPerNode,layerCount, force=false) {
	if ( childrenPerNode !== numberOfChildNodes || 
		layerCount !== numberOfLayers || 
		force ) {
			// rebuild graph if something has changed or we are forced to
			if ( DEBUG ) console.log("BUILDING GRAPH")
			numberOfChildNodes = childrenPerNode
			numberOfLayers = layerCount
			
			tree = createTree( numberOfChildNodes, numberOfLayers )
	}
	return tree
}

// Catch change event for traversal style select control
function onTraversalStyleChanged() {
	// do nothing here
}

// Catch change event for action style select control
function onActionStyleChanged() {
	// do nothing here
}

// disable controls that are not required during animation
function disableControlsDuringAnimation() {
	traversalStyleSelect.attribute("disabled", "disabled")
	actionStyleSelect.attribute("disabled", "disabled")
	numberOfChildNodesSlider.attribute("disabled", "disabled")
	numberOfLayersSlider.attribute("disabled", "disabled")
	traverseButton.html("Stop Traversal")
}

// enable controls after the animation has stopped
function enableControlsAfterAnimation() {
	traversalStyleSelect.removeAttribute("disabled")
	actionStyleSelect.removeAttribute("disabled")
	numberOfChildNodesSlider.removeAttribute("disabled")
	numberOfLayersSlider.removeAttribute("disabled")
	traverseButton.html("Start Traversal")		
}

// Catch click event for "Start Traversal" button
function traverseButtonClicked() {
	if ( traverseButton.html() === "Start Traversal" ) {
		disableControlsDuringAnimation()
		
		// setup relevant variables for animation
		if ( traversalStyleSelect.value().indexOf("BFS") !== -1 ) {
			traversalStyle = new BreadthFirstSearch()
		} else if ( traversalStyleSelect.value().indexOf("DFS") !== -1 ) {
			traversalStyle = new DepthFirstSearch()
		}
		if ( actionStyleSelect.value().indexOf("Before") !== -1 ) {
			actionStyle = "Visit Before Children"
		} else if ( actionStyleSelect.value().indexOf("After") !== -1 ) {
			actionStyle = "Visit After Children"
		}
		traversalStyle.setActionStyle( actionStyle )
		
		// force build of new tree to reset colours
		graph = buildTreeIfUserInputChanged( graph, numberOfChildNodesSlider.value(), numberOfLayersSlider.value(), true );
		
		// set frame rate to use, this is the rate that each stage of the
		// algorithms will play out so we want it to be slow
		frameRate(5)
		
		// start animation
		traversalStyle.beginAnimation( graph.root )
		is_animating = true
	} else {
		// turn off animation
		is_animating = false
		
		// put frame rate back to default
		frameRate(60)

		enableControlsAfterAnimation()		
	}
}

function addUserControls() {
	// add a slider to control number of nodes per child
	numberOfChildNodesSlider = createSlider( 0, 5, 2, 1 )
	numberOfChildNodesSlider.position( 200, 10)
	// add a slider for number of layers
	numberOfLayersSlider = createSlider( 1, 4, 2, 1)
	numberOfLayersSlider.position( 520, 10)
	
	traversalStyleSelect = createSelect()
	traversalStyleSelect.option("Breadth First Search (BFS)")
	traversalStyleSelect.option("Depth First Search (DFS)")
	traversalStyleSelect.changed( onTraversalStyleChanged )
	traversalStyleSelect.position( 10, 50 )
	
	actionStyleSelect = createSelect()
	actionStyleSelect.option("Visit After Children")	
	actionStyleSelect.option("Visit Before Children")	
	actionStyleSelect.changed( onActionStyleChanged )
	actionStyleSelect.position( 250, 50 )
	
	traverseButton = createButton("Start Traversal")
	traverseButton.position( 450, 50)
	traverseButton.mousePressed( traverseButtonClicked )	
}

// this function is required by p5.js and sets up the canvas and puts in 
// the UI controls.
// we also run a batch of tests first if DEBUG is true
function setup() {
	// perform tests first if we are in debug mode
	// - this needs to run after the p5.js library has loaded
	if ( DEBUG ) vda_tests();
	createCanvas( window.innerWidth, window.innerHeight );
	addUserControls()
}

// function required by p5.js and is called every frame
function draw() {
	background("white")
	
	if ( is_animating === false ) {
		graph = buildTreeIfUserInputChanged( graph, numberOfChildNodesSlider.value(), numberOfLayersSlider.value(), graph === null );
		graph.root.draw();
	} else {
		if ( traversalStyle.isAnimationFinished() ) {
			traverseButtonClicked()
		} else {
			traversalStyle.nextAnimationFrame()
			graph.root.draw()
		}
	}

	// draw agenda holder
	textFont('Helvetica');
	fill(0)
	strokeWeight(1)
	text( "Search Agenda", 10, 110 )
	let w = textWidth("Search Agenda")
	fill(255)
	rect( w+20, 90, window.innerWidth-40-w, 25)
	if ( traversalStyle !== null ) {
		traversalStyle.drawAgendaItems( w+20, 90, 25 )
	}
	
	// draw agenda holder
	textFont('Helvetica');
	fill(0)
	strokeWeight(1)
	text( "Stack", 10, 140 )
	fill(255)
	rect( w+20, 120, window.innerWidth-40-w, 25)
	if ( traversalStyle !== null ) {
		traversalStyle.drawStackItems( w+20, 120, 25 )
	}


	// update text for sliders	
	textFont('Helvetica');
	fill(0)
	strokeWeight(1)
	textStyle(NORMAL)
	text( "Number of Children Per Node:", 10, 25)
	text( "Number of layers:", numberOfChildNodesSlider.x+numberOfChildNodesSlider.width+10, 25)
}
