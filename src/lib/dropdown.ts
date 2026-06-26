/**
 * Dropdown utilities
 */

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface Dropdown {
  id: string;
  trigger: HTMLElement;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

class DropdownManager {
  private dropdowns: Map<string, Dropdown> = new Map();
  private activeDropdown: string | null = null;
  private listeners: Set<(activeId: string | null) => void> = new Set();

  register(options: Omit<Dropdown, "id">): string {
    const id = crypto.randomUUID();
    const dropdown: Dropdown = {
      ...options,
      id,
    };

    this.dropdowns.set(id, dropdown);

    // Add click listener
    options.trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle(id);
    });

    return id;
  }

  unregister(id: string): void {
    this.dropdowns.delete(id);
    if (this.activeDropdown === id) {
      this.activeDropdown = null;
      this.notify();
    }
  }

  toggle(id: string): void {
    if (this.activeDropdown === id) {
      this.close();
    } else {
      this.open(id);
    }
  }

  open(id: string): void {
    this.activeDropdown = id;
    this.notify();

    // Close on outside click
    setTimeout(() => {
      const closeHandler = () => {
        this.close();
        document.removeEventListener("click", closeHandler);
      };
      document.addEventListener("click", closeHandler);
    }, 0);
  }

  close(): void {
    this.activeDropdown = null;
    this.notify();
  }

  getActive(): Dropdown | undefined {
    if (!this.activeDropdown) return undefined;
    return this.dropdowns.get(this.activeDropdown);
  }

  isActive(id: string): boolean {
    return this.activeDropdown === id;
  }

  subscribe(listener: (activeId: string | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.activeDropdown);
      } catch (error) {
        console.error("Error in dropdown listener:", error);
      }
    });
  }
}

export function createDropdownManager(): DropdownManager {
  return new DropdownManager();
}

export function createDropdown(
  trigger: HTMLElement,
  options: DropdownOption[],
  onSelect: (value: string) => void,
  position?: Dropdown["position"]
): Omit<Dropdown, "id"> {
  return {
    trigger,
    options,
    onSelect,
    position: position || "bottom-left",
  };
}

// Global dropdown manager
let globalDropdownManager: DropdownManager | null = null;

export function getGlobalDropdownManager(): DropdownManager {
  if (!globalDropdownManager) {
    globalDropdownManager = createDropdownManager();
  }
  return globalDropdownManager;
}

export function setGlobalDropdownManager(manager: DropdownManager): void {
  globalDropdownManager = manager;
}

// Convenience functions
export function registerDropdown(
  trigger: HTMLElement,
  options: DropdownOption[],
  onSelect: (value: string) => void,
  position?: Dropdown["position"]
): string {
  return getGlobalDropdownManager().register({ trigger, options, onSelect, position: position || "bottom-left" });
}

export function unregisterDropdown(id: string): void {
  getGlobalDropdownManager().unregister(id);
}

export function toggleDropdown(id: string): void {
  getGlobalDropdownManager().toggle(id);
}

export function openDropdown(id: string): void {
  getGlobalDropdownManager().open(id);
}

export function closeDropdown(): void {
  getGlobalDropdownManager().close();
}
