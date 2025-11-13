import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow"
import { PuppeteerMemoryService } from "./memory"
import { getPrevInput } from "./util"

export async function executePuppeteerContextSet(self: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const memory = PuppeteerMemoryService.getExecutionMemory(self)
    const setters = self.getNodeParameter('setters', 0, '') as { setter: { key: string, value: string }[] }
    for (const setter of setters.setter) {
        const key = setter.key as string
        const value = setter.value as string
        memory.write(key, value)
    }
    return [[{
        json: {
            context: memory,
            prevInput: getPrevInput(self),
        },
    }]]
}
