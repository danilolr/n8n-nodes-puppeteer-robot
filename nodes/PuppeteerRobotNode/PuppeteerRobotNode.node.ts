import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow'
import { NodeConnectionTypes } from 'n8n-workflow'
import { executePuppeteerStart } from './puppeteer.start'
import { executePuppeteerExecute } from './puppeteer'
import { executePuppeteerEnd } from './puppeteer.end'
import { executePuppeteerContextGet } from './puppeteer.context.get'
import { executePuppeteerScreenshot } from './puppeteer.screenshot'
import { executePuppeteerContextSet } from './puppeteer.context.set'

export class PuppeteerRobotNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Puppeteer Robot',
		name: 'puppeteerRobotNode',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Puppeteer Robot',
		icon: 'file:puppeteerRobot.svg',
		defaults: {
			name: 'PuppeteerRobot',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Robot Lifecycle',
                        value: 'robot',
                    },
                    {
                        name: 'Context',
                        value: 'context',
                    },
                    {
                        name: 'Tool',
                        value: 'tools',
                    },
                ],
                default: 'robot',
            },
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
                    show: {
                        resource: [
                            'robot',
                        ],
                    },
                },
				options: [
					{
						name: 'End Robot',
						value: "puppeteerEnd",
						description: "End Puppeteer Robot",
						action: 'End robot',
					},
					{
						name: 'Start Robot',
						value: "puppeteerStart",
						description: "Start Puppeteer Robot",
						action: 'Start robot',
					},
				],
				default: 'puppeteerStart',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
                    show: {
                        resource: [
                            'context',
                        ],
                    },
                },
				options: [
					{
						name: 'Get Context',
						value: "puppeteerContextGet",
						action: 'Get context',
					},
					{
						name: 'Set Context',
						value: "puppeteerContextSet",
						action: 'Set context',
					},
				],
				default: 'puppeteerContextGet',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
                    show: {
                        resource: [
                            'tools',
                        ],
                    },	
                },
				options: [
					{
						name: "Execute",
						value: "puppeteer",
						action: 'Execute',
					},
					{
						name: 'Get Screenshot',
						value: "puppeteerScreenshot",
						action: 'Get screenshot',
					},
				],
				default: 'puppeteer',
				noDataExpression: true,
			},
			{
				displayName: 'Puppeteer Server',
				name: 'puppeteerServer',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'Puppeteer Server URL',
				displayOptions: {
					show: {
						operation: [
							'puppeteerStart',
						],
					},
				},
			},
			{
				displayName: 'Puppeteer Pool',
				name: 'puppeteerPoolStart',
				type: 'string',
				default: '',
				placeholder: '',
				displayOptions: {
					show: {
						operation: [
							'puppeteerStart',
						],
					},
				},
			},
			{
				displayName: 'Code',
				name: 'code',
				type: 'string',
				default: '',
				placeholder: '',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						operation: [
							'puppeteer',
						],
					},
				},
			},
			{
				displayName: 'Run on Page Context',
				name: 'runOnPageContext',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: [
							'puppeteer',
						],
					},
				},
			},
			{
				displayName: 'Sleep (Seconds)',
				name: 'sleep',
				type: 'number',
				default: 0,
				placeholder: '',
				description: 'Sleep time in seconds',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						operation: [
							'puppeteer',
						],
					},
				},
			},
			{
				displayName: 'Sleep (Seconds)',
				name: 'sleepOnStart',
				type: 'number',
				default: 3,
				placeholder: '',
				description: 'Sleep time in seconds',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						operation: [
							'puppeteerStart',
						],
					},
				},
			},
			{
				displayName: 'Setters',
				name: 'setters',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
					sortable: true,
				},
				displayOptions: {
					show: {
						operation: [
							'puppeteerContextSet',
						],
					},
				},
				default: { setters: [] },
				placeholder: 'Add setter',
				description: 'Add setter',
				options: [
					{
						name: 'setter',
						displayName: 'Setter',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Key to set in context',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value to set in context',
							},
						],
					},
				],
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('operation', 0, '') as string
		if (operation === 'puppeteerStart') {
			return await executePuppeteerStart(this)
		} else if (operation === 'puppeteer') {
			return await executePuppeteerExecute(this)
		} else if (operation === 'puppeteerEnd') {
			return await executePuppeteerEnd(this)
		} else if (operation === 'puppeteerContextGet') {
			return await executePuppeteerContextGet(this)
		} else if (operation === 'puppeteerContextSet') {
			return await executePuppeteerContextSet(this)
		} else if (operation === 'puppeteerScreenshot') {
			return await executePuppeteerScreenshot(this)
		}
		return [this.getInputData()]
	}

}
