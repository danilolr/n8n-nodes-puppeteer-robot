import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow"
import { safeHttpCall } from "./util"
import { PuppeteerMemoryService } from "./memory"

export async function executePuppeteerScreenshot(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const executionMemory = PuppeteerMemoryService.getExecutionMemory(self)
    const robotId = executionMemory.read("robotId")
    
    const resp = await safeHttpCall(self, `puppeteer-robot/screenshot/${robotId}`, "GET", null)
    self.logger.info("Puppeteer screenshot response: " + JSON.stringify(resp))

    return [[{
        json: resp,
    }]]
}
