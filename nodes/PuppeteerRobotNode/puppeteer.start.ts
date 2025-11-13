import { IExecuteFunctions, INodeExecutionData, sleep } from "n8n-workflow"
import { safeHttpCall } from "./util"
import { PuppeteerMemoryService } from "./memory"

export async function executePuppeteerStart(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const input = self.getInputData()[0].json
    self.logger.error("Input Data: " + JSON.stringify(input))
    const resumeUrl = self.evaluateExpression('{{ $execution?.resumeUrl }}', 0) as string
    const puppeteerServer = self.getNodeParameter('puppeteerServer', 0, '') as string
    let puppeteerPool = self.getNodeParameter('puppeteerPoolStart', 0, '') as string
    if (puppeteerPool === '') {
        puppeteerPool = "none"
    }

    const executionMemory = PuppeteerMemoryService.getExecutionMemory(self)
    executionMemory.write("puppeteerServer", puppeteerServer)
    executionMemory.write("resumeUrl", resumeUrl)
    executionMemory.write("params", input.params)
    executionMemory.write("puppeteerPool", puppeteerPool)
    executionMemory.write("executionId", self.getExecutionId())

    self.logger.info("Puppeteer: execute Puppeteer Start operation")
    self.logger.info("Resume URL: " + resumeUrl)
    self.logger.info("Resume puppeteerServer: " + puppeteerServer)
    const url = `${puppeteerServer}/puppeter-robot/create/${puppeteerPool}`
    self.logger.info("Vai chamar o puppeteer server: " + url)
    const resp = await safeHttpCall(self, url, 'POST', null)
    self.logger.info("Puppeteer response: " + JSON.stringify(resp))
    executionMemory.write("robotId", resp.robotId)

    self.logger.info("Instance Data: " + JSON.stringify(executionMemory.getAll()))

    const jsonResp = {
        context: executionMemory.getAll(),
        resp: resp,
        executionId: self.getExecutionId(),
    }

    const sleepInSeconds = self.getNodeParameter('sleepOnStart', 0, '') as number
    if (sleepInSeconds > 0) {
        if (sleepInSeconds < 65) {
            await sleep(sleepInSeconds * 1000)
        } else {
            const waitTill: Date = new Date(new Date().getTime() + sleepInSeconds * 1000)
            await self.putExecutionToWait(waitTill)
        }
    }

    const onResponse: INodeExecutionData[] = [
        {
            json: jsonResp,
        },
    ]

    return [onResponse]
}
