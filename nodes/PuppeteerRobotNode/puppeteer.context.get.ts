import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow"
import { PuppeteerMemoryService } from "./memory"
import { getPrevInput } from "./util"

export async function executePuppeteerContextGet(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const memory = PuppeteerMemoryService.getExecutionMemory(self)
    const ctx = memory.getAll()
    return [[{
        json: {
            context: ctx,
            prevInput: getPrevInput(self),
        },
    }]]    
}
