import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData, NodeOperationError, sleep } from "n8n-workflow"
import { PuppeteerMemoryService as PuppeteerMemoryService } from "./memory"
import { ExecutionMemoryData } from "./model"

export async function executePuppeteerExecute(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const executionMemory = PuppeteerMemoryService.getExecutionMemory(self)
    self.logger.error("Instance Data ON EXECUTE: " + JSON.stringify(executionMemory.getAll()))
    self.logger.error("Instance Data ON NODE: " + self.getNode().name)

    const puppeteerServer = executionMemory.read("puppeteerServer")
    const puppeteerServerApiKey = executionMemory.read("puppeteerServerApiKey")
    const robotId = executionMemory.read("robotId")
    let executionMemoryData = executionMemory.read("ExecutionMemoryData") as ExecutionMemoryData
    if (!executionMemoryData) {
        executionMemoryData = new ExecutionMemoryData()
        executionMemory.write("ExecutionMemoryData", executionMemoryData)
    }

    self.logger.info("Execute Puppeteer operation")
    let code = self.getNodeParameter('code', 0, '') as string
    const runOnPageContext = self.getNodeParameter('runOnPageContext', 0, '') as boolean
    if (runOnPageContext) {
        self.logger.info("Running on page context")
        code = `return page.evaluate(() => {
  ${code}
})`
    }
    const options: IHttpRequestOptions = {
        method: 'PUT',
        url: `${puppeteerServer}/puppeteer-robot/run`,
        body: {
            "robotId": robotId,
            "command": code
        },
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${puppeteerServerApiKey}`
        },
    }
    self.logger.info("Code: " + code + " runOnPageContext: " + runOnPageContext+ " options: " + JSON.stringify(options))
    const resp = await self.helpers.httpRequest(options)
    self.logger.info("Puppeteer response test2 -------------------- : " + JSON.stringify(resp))
    if (resp.status!="OK") {
        throw new NodeOperationError(self.getNode(), resp.message, {
            description: 'Call robot failed (Internal API error).' + resp.message,
        })
    }

    const sleepTimeInSeconds = self.getNodeParameter('sleep', 0, '') as number
    if (sleepTimeInSeconds > 0) {
        if (sleepTimeInSeconds < 65) {
            await sleep(sleepTimeInSeconds * 1000)
        } else {
            const waitTill: Date = new Date(new Date().getTime() + sleepTimeInSeconds * 1000)
            await self.putExecutionToWait(waitTill)
        }
    }

    executionMemoryData.addExecutionData(self, resp.data)

    return [[{
        json: {
            context: executionMemory.getAll(),
            executionMemory: {
                data: executionMemoryData.getData(),
                lastValue: executionMemoryData.getLastValue()
            },
            resp: resp,
        },
    }]]
}
