import {
    IWebhookFunctions,
    IWebhookResponseData,
    INodeType,
    INodeTypeDescription
} from 'n8n-workflow';

export class PuppeteerRobotWebhook implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Puppeteer Robot Webhook',
        name: 'puppeteerRobotWebhook',
        group: ['trigger'],
        version: 1,
        icon: 'file:puppeteerRobot.svg',
        usableAsTool: true,
        description: 'Webhook to receive POST requests for Puppeteer Robot',
        defaults: {
            name: 'Puppeteer Robot Webhook',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
				responseMode: 'onReceived',

                isFullPath: true,
                path: '={{ `puppeteer-robot/${$parameter["path"]}`}}',
            },
        ],
        properties: [
            {
                displayName: 'Path',
                name: 'path',
                type: 'string',
                default: '',
                placeholder: '',
                required: true,
                description: 'The URL path to listen on',
            },
        ],
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const bodyData = this.getBodyData()
		const responseData = {
			ok: true,
			startTime: new Date().toISOString(),
		};
        return {
            workflowData: [[{
                json: {
                    params: bodyData,
                },
            }]],
			webhookResponse: responseData,
            noWebhookResponse: false,
        }
    }
}