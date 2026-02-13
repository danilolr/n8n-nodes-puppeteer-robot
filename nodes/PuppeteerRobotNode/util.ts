import { GenericValue, IDataObject, IExecuteFunctions, IHttpRequestMethods, IHttpRequestOptions, NodeOperationError } from "n8n-workflow"
import { PuppeteerMemoryService } from "./memory"
import { PuppeteerCredentialsData } from "./model"

export async function safeHttpCall(self: IExecuteFunctions, url: string, method: IHttpRequestMethods, body: GenericValue | GenericValue[]): Promise<IDataObject> {
    const credentials = (await self.getCredentials('puppeteerRobotApi')) as PuppeteerCredentialsData
    const puppeteerServer = credentials?.puppeteerServer
    const puppeteerServerApiKey = credentials?.puppeteerServerApiKey
    const fullUrl = `${puppeteerServer}/${url}`
    self.logger.info(`Making SAFE HTTP call to ${fullUrl} with method ${method} on node ${self.getNode().name}`)
    self.logger.debug(`Request body: ${JSON.stringify(body)}`)
    const options: IHttpRequestOptions = {
        method: method,
        url: fullUrl,
        body: body,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${puppeteerServerApiKey}`
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