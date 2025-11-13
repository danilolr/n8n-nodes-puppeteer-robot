import { GenericValue, IExecuteFunctions, IHttpRequestMethods, IHttpRequestOptions } from "n8n-workflow"

export async function safeHttpCall(self: IExecuteFunctions, url: string, method: IHttpRequestMethods, body: GenericValue | GenericValue[] ) {
    self.logger.info(`Making SAFE HTTP call to ${url} with method ${method}`)
    self.logger.debug(`Request body: ${JSON.stringify(body)}`)
    const options: IHttpRequestOptions = {
        method: method,
        url: url,
        body: body,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
    }
    const resp = await self.helpers.httpRequest(options)
    return resp
}

export function getPrevInput(self: IExecuteFunctions) {
    const input = self.getInputData(0)[0].json
    return input
}