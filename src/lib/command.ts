/**
 * Command pattern utilities
 */

interface Command<T = void> {
  execute(): T;
  undo?(): void;
}

class CommandHistory {
  private history: Command[] = [];
  private undone: Command[] = [];
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  execute<T>(command: Command<T>): T {
    const result = command.execute();

    this.history.push(command);
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }

    this.undone = [];
    return result;
  }

  undo(): boolean {
    const command = this.history.pop();
    if (command && command.undo) {
      command.undo();
      this.undone.push(command);
      return true;
    }
    if (command) {
      this.history.push(command);
    }
    return false;
  }

  redo(): boolean {
    const command = this.undone.pop();
    if (command) {
      command.execute();
      this.history.push(command);
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.history.length > 0 && !!this.history[this.history.length - 1].undo;
  }

  canRedo(): boolean {
    return this.undone.length > 0;
  }

  clear(): void {
    this.history = [];
    this.undone = [];
  }

  getHistorySize(): number {
    return this.history.length;
  }

  getUndoneSize(): number {
    return this.undone.length;
  }
}

export function createCommand<T = void>(
  execute: () => T,
  undo?: () => void
): Command<T> {
  return { execute, undo };
}

export function createCommandHistory(maxSize?: number): CommandHistory {
  return new CommandHistory(maxSize);
}

export function createMacroCommand<T = void>(commands: Command<T>[]): Command<T[]> {
  return {
    execute: () => commands.map((cmd) => cmd.execute()),
    undo: () => {
      [...commands].reverse().forEach((cmd) => cmd.undo?.());
    },
  };
}

export function createConditionalCommand<T = void>(
  condition: () => boolean,
  trueCommand: Command<T>,
  falseCommand?: Command<T>
): Command<T | undefined> {
  return {
    execute: () => {
      if (condition()) {
        return trueCommand.execute();
      }
      return falseCommand?.execute();
    },
    undo: () => {
      if (condition()) {
        trueCommand.undo?.();
      } else {
        falseCommand?.undo?.();
      }
    },
  };
}

export function createSequentialCommand<T = void>(commands: Command<T>[]): Command<T[]> {
  return {
    execute: () => {
      const results: T[] = [];
      for (const cmd of commands) {
        results.push(cmd.execute());
      }
      return results;
    },
  };
}

export function createParallelCommand<T = void>(commands: Command<T>[]): Command<Promise<T[]>> {
  return {
    execute: () => Promise.all(commands.map((cmd) => cmd.execute())),
  };
}
