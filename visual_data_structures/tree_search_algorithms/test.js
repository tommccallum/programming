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


// Test single node tree
var vda_tests = function() {
	function assertArrayEquals( output, expected ) {
		if ( output.length !== expected.length ) {
			console.log("[Error] Array assertion length check failed, output is first")
			console.log(output)
			console.log(expected)
			throw "Assertion failed, see console for more information"
		}
		for( let ii=0; ii < output.length; ii++ ) {
			if ( output[ii] !== expected[ii] ) {
				console.log("[Error] Array assertion item " + ii + " check failed, output is first")
				console.log(output)
				console.log(expected)
				throw "Assertion failed, see console for more information"
			}
		} 
		return true;
	}	
	
	function given(message) {
		console.log("GIVEN "+message)
	}
	function when(message) {
		console.log("WHEN "+message)
	}
	function then(message) {
		console.log("THEN "+message)
	}

	function testDFS1() {
		given("a tree (1,1)")
		const tree = new Tree( 1, 1 )
		when("dfs and post-children actions")
		const bfs = new DepthFirstSearch()
		bfs.setActionStyle( "Visit After Children" )
		const expected = [1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [1]")
		assertArrayEquals(arr, expected)
	}
	
	function testDFS2() {
		given("a tree (2,2)")
		const tree = new Tree( 2, 2 )
		when("dfs and pre-children actions")
		const bfs = new DepthFirstSearch()
		bfs.setActionStyle( "Visit Before Children" )
		const expected = [1,2,3]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [1,2,3]")		
		assertArrayEquals(arr, expected)
	}
	
	function testDFS3() {
		given("a tree (2,2)")
		const tree = new Tree( 2, 2 )
		when("dfs and post-children actions")
		const bfs = new DepthFirstSearch()
		bfs.setActionStyle( "Visit After Children" )
		const expected = [2,3,1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [2,3,1]")		
		assertArrayEquals(arr, expected)
	}
	
	function testDFS4b() {
		given("a tree (3,2)")
		const tree = new Tree( 3, 2 )
		when("dfs and pre-children actions")		
		const bfs = new DepthFirstSearch()		
		bfs.setActionStyle( "Visit Before Children" )
		const expected = [1,2,3,4]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [2,3,4,1]")
		console.log(tree)		
		assertArrayEquals(arr, expected)
	}
	
	function testDFS4() {
		given("a tree (3,2)")
		const tree = new Tree( 3, 2 )
		when("dfs and post-children actions")		
		const bfs = new DepthFirstSearch()		
		bfs.setActionStyle( "Visit After Children" )
		const expected = [2,3,4,1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [2,3,4,1]")		
		assertArrayEquals(arr, expected)
	}
	
	function testDFS5() {
		given("a tree (3,3)")
		const tree = new Tree( 3, 3 )
		when("dfs and pre-children actions")		
		const bfs = new DepthFirstSearch()
		bfs.setActionStyle( "Visit Before Children" )
		const expected = [1,2,5,6,7,3,8,9,10,4,11,12,13]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [1,2,5,6,7,3,8,9,10,4,11,12,13]")		
		assertArrayEquals(arr, expected)
	}
	
	function testDFS6() {
		given("a tree (3,3)")
		const tree = new Tree( 3, 3 )
		when("dfs and post-children actions")		
		const bfs = new DepthFirstSearch()
		bfs.setActionStyle( "Visit After Children" )
		const expected = [5,6,7,2,8,9,10,3,11,12,13,4,1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be ["+expected.join(",")+"]")
		assertArrayEquals(arr, expected)
	}
	
	function testDFS7() {
		given("a tree (2,3)")
		const tree = new Tree( 2, 3 )
		when("dfs and pre-children actions")		
		const bfs = new DepthFirstSearch()
		bfs.setActionStyle( "Visit Before Children" )
		const expected = [1,2,4,5,3,6,7]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be ["+expected.join(",")+"]")		
		assertArrayEquals(arr, expected)
	}
	
	function testDFS8() {
		given("a tree (2,3)")
		const tree = new Tree( 2, 3 )
		when("dfs and post-children actions")		
		const bfs = new DepthFirstSearch()
		bfs.setActionStyle( "Visit After Children" )
		const expected = [4,5,2,6,7,3,1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be ["+expected.join(",")+"]")
		assertArrayEquals(arr, expected)
	}	
	
	function testBFS1() {
		given("a tree (1,1)")
		const tree = new Tree( 1, 1 )
		when("bfs and post-children actions")
		const bfs = new BreadthFirstSearch()
		bfs.setActionStyle( "Visit After Children" )
		const expected = [1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [1]")
		assertArrayEquals(arr, expected)
	}
	
	function testBFS2() {
		given("a tree (1,1)")
		const tree = new Tree( 2, 2 )
		when("bfs and pre-children actions")
		const bfs = new BreadthFirstSearch()
		bfs.setActionStyle( "Visit Before Children" )
		const expected = [1,2,3]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [1,2,3]")
		assertArrayEquals(arr, expected)
	}
	
	function testBFS3() {
		given("a tree (2,2)")
		const tree = new Tree( 2, 2 )
		when("bfs and post-children actions")
		const bfs = new BreadthFirstSearch()
		bfs.setActionStyle( "Visit After Children" )
		const expected = [2,3,1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be ["+expected.join(",")+"]")
		assertArrayEquals(arr, expected)
	}
	
	function testBFS4b() {
		given("a tree (3,2)")
		const tree = new Tree( 3, 2 )
		when("bfs and pre-children actions")
		const bfs = new BreadthFirstSearch()
		bfs.setActionStyle( "Visit Before Children" )
		const expected = [1,2,3,4]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [1,2,3,4]")
		console.log(tree)
		assertArrayEquals(arr, expected)
	}
	
	function testBFS4() {
		given("a tree (3,2)")
		const tree = new Tree( 3, 2 )
		when("bfs and post-children actions")
		const bfs = new BreadthFirstSearch()
		bfs.setActionStyle( "Visit After Children" )
		const expected = [2,3,4,1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be [2,3,4,1]")
		assertArrayEquals(arr, expected)
	}
	
	function testBFS5() {
		given("a tree (3,3)")
		const tree = new Tree( 3, 3 )
		when("bfs and pre-children actions")
		const bfs = new BreadthFirstSearch()
		bfs.setActionStyle( "Visit Before Children" )
		const expected = [1,2,3,4,5,6,7,8,9,10,11,12,13]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be ["+expected.join(",")+"]")
		assertArrayEquals(arr, expected)
	}
	
	function testBFS6() {
		given("a tree (3,3)")
		const tree = new Tree( 3, 3 )
		when("bfs and post-children actions")
		const bfs = new BreadthFirstSearch()
		bfs.setActionStyle( "Visit After Children" )
		const expected = [5,6,7,8,9,10,11,12,13,2,3,4,1]
		const arr = [] 
		bfs.visit( tree.root, function(node) { arr.push( node.index ) } );
		then("result should be ["+expected.join(",")+"]")
		assertArrayEquals(arr, expected)
	}

	testDFS1()
	testDFS2()
	testDFS3()
	testDFS4b()
	testDFS4()
	testDFS5()
	testDFS6()
	testDFS7()
	testDFS8()

	testBFS1()
	testBFS2()
	testBFS3()
	testBFS4b()
	testBFS4()
	testBFS5()
	testBFS6()
	
}