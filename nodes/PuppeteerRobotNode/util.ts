import { GenericValue, IDataObject, IExecuteFunctions, IHttpRequestMethods, IHttpRequestOptions, NodeOperationError } from "n8n-workflow"
import { PuppeteerMemoryService } from "./memory"

export async function safeHttpCall(self: IExecuteFunctions, url: string, method: IHttpRequestMethods, body: GenericValue | GenericValue[], apiKey: string | null = null): Promise<IDataObject> {
    self.logger.info(`Making SAFE HTTP call to ${url} with method ${method}`)
    self.logger.debug(`Request body: ${JSON.stringify(body)}`)
    const options: IHttpRequestOptions = {
        method: method,
        url: url,
        body: body,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
    }
    const resp = await self.helpers.httpRequest(options)
    return resp
}

export function getPrevInput(self: IExecuteFunctions) {
    const input = self.getInputData(0)[0].json
    return input
}

export function throwException(self: IExecuteFunctions, label: string, description: string) {
    const executionMemory = PuppeteerMemoryService.getExecutionMemory(self)

    const robotId = executionMemory.read("robotId")
    throw new NodeOperationError(self.getNode(), label, {
        description: JSON.stringify({
            description, "robotId": robotId
        }),
    })
}