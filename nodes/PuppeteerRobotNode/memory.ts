import { IExecuteFunctions } from "n8n-workflow"

export class PuppeteerMemoryService {

    private static globalMemory: PuppeteerMemory
    private static executionMemory: Map<string, PuppeteerMemory> = new Map()

    public static getGlobalMemory(): PuppeteerMemory {
        if (!this.globalMemory) {
            this.globalMemory = new PuppeteerMemory()
        }
        return this.globalMemory
    }

    public static getExecutionMemory(self: IExecuteFunctions): PuppeteerMemory {
        const executionId = self.getExecutionId()
        let memory = this.executionMemory.get(executionId)
        if (!memory) {
            memory = new PuppeteerMemory()
            this.executionMemory.set(executionId, memory)
        }
        return memory
    }
}

export class PuppeteerMemory {

    private data: Map<string, unknown> = new Map()

    write(key: string, value: unknown): void {
        this.data.set(key, value)
    }

    read(key: string): unknown {
        return this.data.get(key)
    }

    getAll(): Record<string, unknown> {
        const obj: Record<string, unknown> = {}
        this.data.forEach((value, key) => {
            obj[key] = value
        })
        return obj
    }

}