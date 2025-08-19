/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ChatAgentLocation, ChatAgentService, IChatAgentData, IChatAgentImplementation, IChatAgentRequest } from '../../common/chatAgents.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';

suite('Hi Echo Agent', function () {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let chatAgentService: ChatAgentService;
	setup(() => {
		const contextKeyService = new MockContextKeyService();
		chatAgentService = store.add(new ChatAgentService(contextKeyService, store.add(new TestStorageService())));
	});

	test('hi : hi - echo functionality', async () => {
		const hiEchoAgentId = 'hiEchoAgent';
		const hiEchoAgentData: IChatAgentData = {
			id: hiEchoAgentId,
			name: 'Hi Echo Agent',
			extensionDisplayName: 'Hi Echo Extension',
			extensionId: new ExtensionIdentifier('hiecho'),
			extensionPublisherId: 'test',
			locations: [ChatAgentLocation.Panel],
			metadata: {
				sampleRequest: 'hi'
			},
			slashCommands: [],
			disambiguation: [],
		};

		const hiEchoAgentImpl: IChatAgentImplementation = {
			invoke: async (request: IChatAgentRequest, progress, history, token: CancellationToken) => {
				// Simple echo: if input is "hi", respond with "hi"
				if (request.message.trim().toLowerCase() === 'hi') {
					progress({ content: 'hi' });
				} else {
					progress({ content: `I only understand "hi", but you said: ${request.message}` });
				}
				return {};
			},
		};

		// Register the agent and implementation
		store.add(chatAgentService.registerAgent(hiEchoAgentId, hiEchoAgentData));
		store.add(chatAgentService.registerAgentImplementation(hiEchoAgentId, hiEchoAgentImpl));

		// Verify the agent is registered
		const agents = chatAgentService.getActivatedAgents();
		assert.strictEqual(agents.length, 1);
		assert.strictEqual(agents[0].id, hiEchoAgentId);

		// Test the echo functionality
		const agent = agents[0];
		const mockRequest: IChatAgentRequest = {
			sessionId: 'test-session',
			requestId: 'test-request',
			agentId: hiEchoAgentId,
			message: 'hi',
			variables: { variables: [] },
			location: ChatAgentLocation.Panel,
		};

		let capturedResponse = '';
		const mockProgress = (part: any) => {
			if (part.content) {
				capturedResponse += part.content;
			}
		};

		await agent.invoke(mockRequest, mockProgress, [], CancellationToken.None);
		
		// Verify that "hi" input produces "hi" output
		assert.strictEqual(capturedResponse, 'hi');
	});

	test('hi : hi - case insensitive', async () => {
		const hiEchoAgentId = 'hiEchoAgent';
		const hiEchoAgentData: IChatAgentData = {
			id: hiEchoAgentId,
			name: 'Hi Echo Agent',
			extensionDisplayName: 'Hi Echo Extension',
			extensionId: new ExtensionIdentifier('hiecho'),
			extensionPublisherId: 'test',
			locations: [ChatAgentLocation.Panel],
			metadata: {},
			slashCommands: [],
			disambiguation: [],
		};

		const hiEchoAgentImpl: IChatAgentImplementation = {
			invoke: async (request: IChatAgentRequest, progress, history, token: CancellationToken) => {
				if (request.message.trim().toLowerCase() === 'hi') {
					progress({ content: 'hi' });
				} else {
					progress({ content: `I only understand "hi", but you said: ${request.message}` });
				}
				return {};
			},
		};

		store.add(chatAgentService.registerAgent(hiEchoAgentId, hiEchoAgentData));
		store.add(chatAgentService.registerAgentImplementation(hiEchoAgentId, hiEchoAgentImpl));

		const agent = chatAgentService.getActivatedAgents()[0];
		
		// Test different cases of "hi"
		const testCases = ['hi', 'Hi', 'HI', 'hI', ' hi ', ' Hi '];
		
		for (const testCase of testCases) {
			const mockRequest: IChatAgentRequest = {
				sessionId: 'test-session',
				requestId: 'test-request',
				agentId: hiEchoAgentId,
				message: testCase,
				variables: { variables: [] },
				location: ChatAgentLocation.Panel,
			};

			let capturedResponse = '';
			const mockProgress = (part: any) => {
				if (part.content) {
					capturedResponse += part.content;
				}
			};

			await agent.invoke(mockRequest, mockProgress, [], CancellationToken.None);
			assert.strictEqual(capturedResponse, 'hi', `Failed for input: "${testCase}"`);
		}
	});
});