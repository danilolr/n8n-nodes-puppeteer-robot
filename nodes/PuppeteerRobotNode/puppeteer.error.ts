import { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow"
import { safeHttpCall } from "./util"


export async function executePuppeteerErrorHandling(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const input = self.getInputData(0)[0].json as IDataObject & { execution: { id: string, error: { message: string, description: string } } }
    const params = {
        "id": input.execution.id,
        "payload": {
            "message": input.execution.error.message,
            "description": input.execution.error.description
        }
    }
    self.logger.info('executePuppeteerErrorHandling: ' + JSON.stringify(params))
    await safeHttpCall(self, `puppeteer-robot/error`, 'PUT', params)
    return [[{
        json: input,
    }]]
}

