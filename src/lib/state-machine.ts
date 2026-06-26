/**
 * State machine utilities
 */

interface Transition {
  from: string;
  to: string;
  event: string;
  guard?: (context: unknown) => boolean;
  action?: (context: unknown) => void;
}

class StateMachine {
  private state: string;
  private transitions: Transition[] = [];
  private listeners: Map<string, Set<() => void>> = new Map();

  constructor(
    private initialState: string,
    private states: string[]
  ) {
    this.state = initialState;
  }

  addTransition(transition: Transition): void {
    this.transitions.push(transition);
  }

  async send(event: string, context?: unknown): Promise<boolean> {
    const transition = this.transitions.find(
      (t) => t.from === this.state && t.event === event
    );

    if (!transition) {
      console.warn(`No transition from "${this.state}" with event "${event}"`);
      return false;
    }

    if (transition.guard && !transition.guard(context)) {
      console.warn(`Guard failed for transition from "${this.state}" to "${transition.to}"`);
      return false;
    }

    if (transition.action) {
      transition.action(context);
    }

    this.state = transition.to;
    this.notify(transition.to);

    return true;
  }

  getState(): string {
    return this.state;
  }

  can(event: string): boolean {
    return this.transitions.some(
      (t) => t.from === this.state && t.event === event
    );
  }

  getAvailableEvents(): string[] {
    return this.transitions
      .filter((t) => t.from === this.state)
      .map((t) => t.event);
  }

  on(state: string, listener: () => void): () => void {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, new Set());
    }
    this.listeners.get(state)!.add(listener);
    return () => this.listeners.get(state)?.delete(listener);
  }

  private notify(state: string): void {
    this.listeners.get(state)?.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error(`Error in state listener for "${state}":`, error);
      }
    });
  }

  reset(): void {
    this.state = this.initialState;
  }

  getTransitions(): Transition[] {
    return [...this.transitions];
  }

  getStates(): string[] {
    return [...this.states];
  }
}

export function createStateMachine(
  initialState: string,
  states: string[]
): StateMachine {
  return new StateMachine(initialState, states);
}

export function createTransition(
  from: string,
  to: string,
  event: string,
  guard?: (context: unknown) => boolean,
  action?: (context: unknown) => void
): Transition {
  return { from, to, event, guard, action };
}

// State chart
interface StateNode {
  id: string;
  initial?: boolean;
  final?: boolean;
  on?: Record<string, string>;
  entry?: () => void;
  exit?: () => void;
}

class StateChart {
  private nodes: Map<string, StateNode> = new Map();
  private currentState: string;

  constructor(config: Record<string, StateNode>) {
    Object.entries(config).forEach(([id, node]) => {
      this.nodes.set(id, { ...node, id });
    });

    const initial = Object.entries(config).find(([, node]) => node.initial);
    this.currentState = initial ? initial[0] : Object.keys(config)[0];
  }

  async send(event: string): Promise<void> {
    const node = this.nodes.get(this.currentState);
    if (!node?.on?.[event]) return;

    const nextStateId = node.on[event];
    const nextState = this.nodes.get(nextStateId);
    if (!nextState) return;

    // Execute exit action
    if (node.exit) {
      node.exit();
    }

    // Transition
    this.currentState = nextStateId;

    // Execute entry action
    if (nextState.entry) {
      nextState.entry();
    }
  }

  getState(): string {
    return this.currentState;
  }

  can(event: string): boolean {
    const node = this.nodes.get(this.currentState);
    return !!node?.on?.[event];
  }

  getAvailableEvents(): string[] {
    const node = this.nodes.get(this.currentState);
    return node?.on ? Object.keys(node.on) : [];
  }

  isFinal(): boolean {
    const node = this.nodes.get(this.currentState);
    return !!node?.final;
  }

  reset(): void {
    const initial = Array.from(this.nodes.entries()).find(([, node]) => node.initial);
    this.currentState = initial ? initial[0] : Array.from(this.nodes.keys())[0];
  }
}

export function createStateChart(config: Record<string, StateNode>): StateChart {
  return new StateChart(config);
}
