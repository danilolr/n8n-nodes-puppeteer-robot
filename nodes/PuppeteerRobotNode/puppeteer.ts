import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData, sleep } from "n8n-workflow"
import { PuppeteerMemoryService as PuppeteerMemoryService } from "./memory";

export async function executePuppeteerExecute(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const executionMemory = PuppeteerMemoryService.getExecutionMemory(self)
    self.logger.error("Instance Data ON EXECUTE: " + JSON.stringify(executionMemory.getAll()))
    const puppeteerServer = executionMemory.read("puppeteerServer");
    const robotId = executionMemory.read("robotId");

    self.logger.info("Execute Puppeteer operation")
    let code = self.getNodeParameter('code', 0, '') as string
    const runOnPageContext = self.getNodeParameter('runOnPageContext', 0, '') as boolean
    if (runOnPageContext) {
        self.logger.info("Running on page context")
        code = `return page.evaluate(() => {
  ${code}
})`
    }
    self.logger.info("Code: " + code + " runOnPageContext: " + runOnPageContext)
    const options: IHttpRequestOptions = {
        method: 'PUT',
        url: `${puppeteerServer}/puppeter-robot/run`,
        body: {
            "robotId": robotId,
            "command": code
        },
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
    }
    const resp = await self.helpers.httpRequest(options)
    self.logger.info("Puppeteer response: " + JSON.stringify(resp))

    const sleepTimeInSeconds = self.getNodeParameter('sleep', 0, '') as number
    if (sleepTimeInSeconds > 0) {
        if (sleepTimeInSeconds < 65) {
            await sleep(sleepTimeInSeconds * 1000)
        } else {
            const waitTill: Date = new Date(new Date().getTime() + sleepTimeInSeconds * 1000)
            await self.putExecutionToWait(waitTill)
        }
    }

    return [[{
        json: {
            context: executionMemory.getAll(),
            resp: resp,
        },
    }]]
}
