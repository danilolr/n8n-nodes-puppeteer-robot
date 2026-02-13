import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow'

export class PuppeterRobotApi implements ICredentialType {
	name = 'puppeterRobotApi';

	displayName = 'Puppeter Robot API';

	icon: Icon = 'file:puppeteerRobot.svg'

	documentationUrl =
		'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#deleting-a-personal-access-token';

	properties: INodeProperties[] = [
			{
				displayName: 'Puppeteer Server',
				name: 'puppeteerServer',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'Puppeteer Server URL',
			},
			{
				displayName: 'Puppeteer Server API Key',
				name: 'puppeteerServerApiKey',
				type: 'string',
				default: '',
				placeholder: '',
				typeOptions: {
					password: true,
				},
			},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.puppeteerServerApiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'http://192.168.0.10:3000/puppeteer-robot',
			url: '/version',
			method: 'GET',
		},
	};
}