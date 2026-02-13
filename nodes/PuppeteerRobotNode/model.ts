import { IExecuteFunctions } from "n8n-workflow"

export class ExecutionMemoryData {

    private lastValue : unknown
    private data: Map<string, unknown[]> = new Map()

    addExecutionData(self: IExecuteFunctions, value: unknown): void {        
        self.logger.info("Adding execution data: " + self.getNode().name + " -> " + JSON.stringify(value))
        const nodeName = self.getNode().name
        if (!this.data.has(nodeName)) {
            self.logger.info("Creating new entry for node: " + nodeName)
            this.data.set(nodeName, [])
        }
        const list = this.data.get(nodeName)
        self.logger.info("Current list for node " + nodeName + ": " + JSON.stringify(list))
        list?.push(value)
        self.logger.info("Updated list for node " + nodeName + ": " + JSON.stringify(list))
        self.logger.info("Updated data " + JSON.stringify(Object.fromEntries(this.data)))
        this.lastValue = value
    }

    getData():Map<string, unknown[]> {
        return Object.fromEntries(this.data) as unknown as Map<string, unknown[]>
    }

    getLastValue(): unknown {
        return this.lastValue
    }

}