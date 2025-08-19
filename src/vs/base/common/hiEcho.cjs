/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Simple hi echo utility function
 * Implementation for "hi : hi" requirement - when input is "hi", output should be "hi"
 */

function hiEcho(input) {
	const trimmedInput = input.trim().toLowerCase();
	if (trimmedInput === 'hi') {
		return 'hi';
	}
	return input; // Return original input if not "hi"
}

/**
 * Test the hi echo functionality
 */
function testHiEcho() {
	// Test case: "hi" -> "hi"
	const result1 = hiEcho('hi');
	if (result1 !== 'hi') {
		console.error(`Expected 'hi', got '${result1}'`);
		return false;
	}

	// Test case: "Hi" -> "hi" (case insensitive)
	const result2 = hiEcho('Hi');
	if (result2 !== 'hi') {
		console.error(`Expected 'hi', got '${result2}'`);
		return false;
	}

	// Test case: " hi " -> "hi" (with whitespace)
	const result3 = hiEcho(' hi ');
	if (result3 !== 'hi') {
		console.error(`Expected 'hi', got '${result3}'`);
		return false;
	}

	// Test case: "hello" -> "hello" (different input)
	const result4 = hiEcho('hello');
	if (result4 !== 'hello') {
		console.error(`Expected 'hello', got '${result4}'`);
		return false;
	}

	console.log('All hi echo tests passed!');
	return true;
}

// Export for module usage
module.exports = { hiEcho, testHiEcho };

// Run test if this file is executed directly
if (require.main === module) {
	console.log('Testing hi echo functionality...');
	console.log('hiEcho("hi"):', hiEcho('hi'));
	console.log('hiEcho("Hi"):', hiEcho('Hi'));
	console.log('hiEcho(" hi "):', hiEcho(' hi '));
	console.log('hiEcho("hello"):', hiEcho('hello'));
	console.log('Running full test suite...');
	testHiEcho();
}