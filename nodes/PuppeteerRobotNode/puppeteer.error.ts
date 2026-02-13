import { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow"
import { safeHttpCall } from "./util"


export async function executePuppeteerErrorHandling(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const input = self.getInputData(0)[0].json as IDataObject
    const params = {
        "id": input.execution.id,
        "payload": {
            "error": {
                "message": input.execution.error.message,
                "description": input.execution.error.description.replaceAll('"', '\'')
            }
        }
    }
    self.logger.info('executePuppeteerErrorHandling: ' + JSON.stringify(params))
    await safeHttpCall(self, `puppeteer-robot/error`, 'PUT', params)
    return [[{
        json: input,
    }]]
}

