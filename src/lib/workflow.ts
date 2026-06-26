/**
 * Workflow utilities
 */

interface WorkflowStep {
  id: string;
  name: string;
  fn: (context: WorkflowContext) => Promise<WorkflowContext>;
  condition?: (context: WorkflowContext) => boolean;
}

interface WorkflowContext {
  data: Record<string, unknown>;
  history: Array<{ step: string; timestamp: number; success: boolean }>;
}

class Workflow {
  private steps: WorkflowStep[] = [];

  addStep(step: WorkflowStep): void {
    this.steps.push(step);
  }

  async execute(initialContext: WorkflowContext): Promise<WorkflowContext> {
    let context = { ...initialContext };

    for (const step of this.steps) {
      if (step.condition && !step.condition(context)) {
        continue;
      }

      try {
        context = await step.fn(context);
        context.history.push({
          step: step.name,
          timestamp: Date.now(),
          success: true,
        });
      } catch (error) {
        context.history.push({
          step: step.name,
          timestamp: Date.now(),
          success: false,
        });
        throw error;
      }
    }

    return context;
  }

  getSteps(): WorkflowStep[] {
    return [...this.steps];
  }

  clear(): void {
    this.steps = [];
  }
}

export function createWorkflow(): Workflow {
  return new Workflow();
}

export function createWorkflowStep(
  name: string,
  fn: (context: WorkflowContext) => Promise<WorkflowContext>,
  condition?: (context: WorkflowContext) => boolean
): WorkflowStep {
  return {
    id: crypto.randomUUID(),
    name,
    fn,
    condition,
  };
}

export function createWorkflowContext(
  data: Record<string, unknown> = {}
): WorkflowContext {
  return {
    data,
    history: [],
  };
}

// Pipeline
class Pipeline<T> {
  private stages: Array<(input: T) => Promise<T>> = [];

  addStage(stage: (input: T) => Promise<T>): void {
    this.stages.push(stage);
  }

  async execute(input: T): Promise<T> {
    let result = input;
    for (const stage of this.stages) {
      result = await stage(result);
    }
    return result;
  }

  getStages(): Array<(input: T) => Promise<T>> {
    return [...this.stages];
  }

  clear(): void {
    this.stages = [];
  }
}

export function createPipeline<T>(): Pipeline<T> {
  return new Pipeline<T>();
}

// Saga
interface SagaStep<T> {
  name: string;
  execute: (context: T) => Promise<T>;
  compensate: (context: T) => Promise<T>;
}

class Saga<T> {
  private steps: SagaStep<T>[] = [];
  private executedSteps: SagaStep<T>[] = [];

  addStep(step: SagaStep<T>): void {
    this.steps.push(step);
  }

  async execute(context: T): Promise<T> {
    let currentContext = context;

    for (const step of this.steps) {
      try {
        currentContext = await step.execute(currentContext);
        this.executedSteps.push(step);
      } catch (error) {
        // Compensate in reverse order
        await this.compensate(currentContext);
        throw error;
      }
    }

    return currentContext;
  }

  private async compensate(context: T): Promise<void> {
    for (const step of this.executedSteps.reverse()) {
      try {
        await step.compensate(context);
      } catch (error) {
        console.error(`Compensation failed for step "${step.name}":`, error);
      }
    }
  }

  getSteps(): SagaStep<T>[] {
    return [...this.steps];
  }

  clear(): void {
    this.steps = [];
    this.executedSteps = [];
  }
}

export function createSaga<T>(): Saga<T> {
  return new Saga<T>();
}

export function createSagaStep<T>(
  name: string,
  execute: (context: T) => Promise<T>,
  compensate: (context: T) => Promise<T>
): SagaStep<T> {
  return { name, execute, compensate };
}
