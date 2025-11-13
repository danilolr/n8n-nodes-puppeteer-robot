import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow"
import { safeHttpCall } from "./util";
import { PuppeteerMemoryService } from "./memory";

export async function executePuppeteerEnd(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const executionMemory = PuppeteerMemoryService.getExecutionMemory(self)
    const puppeteerServer = executionMemory.read("puppeteerServer");
    const robotId = executionMemory.read("robotId");
    const resp = await safeHttpCall(self, `${puppeteerServer}/puppeteer-robot/delete/${robotId}`, "DELETE", null)
    return [[{
        json: resp,
    }]]
}
