import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData, sleep } from "n8n-workflow"
import { PuppeteerMemoryService as PuppeteerMemoryService } from "./memory"
import { ExecutionMemoryData } from "./model"
import { throwException } from "./util"

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
    self.logger.info("Code: " + code + " runOnPageContext: " + runOnPageContext + " options: " + JSON.stringify(options))
    const resp = await self.helpers.httpRequest(options)
    self.logger.info("Puppeteer response test2 -------------------- : " + JSON.stringify(resp))
    if (resp.status == "FUNCTION_RETURN_ERROR") {
        throwException(self, 'Call robot failed (CODE EXECUTION RETURNS ERROR).' + resp.message, 'Call robot failed (CODE EXECUTION RETURNS ERROR).' + resp.message,
        )
    }
    if (resp.status == "ROBOT_NOT_FOUND") {
        executionMemoryData.addExecutionData(self, {
            error: 'Call robot failed (ROBOT NOT FOUND).' + resp,
        })
        throwException(self, 'Call robot failed (ROBOT NOT FOUND).' + resp.message, 'Call robot failed (ROBOT NOT FOUND).' + resp.message,
        )
    }
    if (resp.status == "JAVASCRIPT_EXCEPTION_ERROR") {
        executionMemoryData.addExecutionData(self, {
            error: 'Call robot failed (CODE EXCEPTION ERROR).' + resp,
        })
        throwException(self, 'Call robot failed (CODE EXCEPTION ERROR).' + resp.message, 'Call robot failed (CODE EXCEPTION ERROR).' + resp.message
        )
    }
    if (resp.status != "OK") {
        executionMemoryData.addExecutionData(self, {
            error: 'Call robot failed (GENERIC).' + resp,
        })
        throwException(self, resp.message, 'Call robot failed (GENERIC).' + resp.message
        )
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
