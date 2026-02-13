import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow"

export async function executePuppeteerErrorHandling(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await self.getCredentials('puppeteerRobotApi')
		self.logger.info('Credentials EH: ' + JSON.stringify(credentials))
    return [[{
        json: {
            ok: true,
            teste: JSON.stringify(credentials),
        },
    }]]    
}
