/**
 * Search Engine utilities
 */

interface SearchDocument {
  id: string;
  type: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

interface SearchResult {
  document: SearchDocument;
  score: number;
  highlights: string[];
}

class SearchEngine {
  private documents: Map<string, SearchDocument> = new Map();
  private index: Map<string, Set<string>> = new Map(); // word -> document ids

  addDocument(doc: SearchDocument): void {
    this.documents.set(doc.id, doc);
    this.indexDocument(doc);
  }

  removeDocument(id: string): void {
    const doc = this.documents.get(id);
    if (doc) {
      this.removeFromIndex(doc);
      this.documents.delete(id);
    }
  }

  updateDocument(doc: SearchDocument): void {
    this.removeDocument(doc.id);
    this.addDocument(doc);
  }

  search(query: string, options?: {
    type?: string;
    limit?: number;
    minScore?: number;
  }): SearchResult[] {
    const words = this.tokenize(query);
    const scores = new Map<string, number>();

    // Calculate TF-IDF-like scores
    for (const word of words) {
      const docIds = this.index.get(word.toLowerCase());
      if (!docIds) continue;

      for (const docId of docIds) {
        const current = scores.get(docId) ?? 0;
        scores.set(docId, current + 1);
      }
    }

    // Build results
    const results: SearchResult[] = [];
    for (const [docId, score] of scores) {
      const doc = this.documents.get(docId);
      if (!doc) continue;

      if (options?.type && doc.type !== options.type) continue;

      const normalizedScore = (score / words.length) * 100;
      if (options?.minScore && normalizedScore < options.minScore) continue;

      results.push({
        document: doc,
        score: normalizedScore,
        highlights: this.findHighlights(doc, words),
      });
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    if (options?.limit) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  private indexDocument(doc: SearchDocument): void {
    const words = this.tokenize(`${doc.title} ${doc.content}`);
    for (const word of words) {
      if (!this.index.has(word)) {
        this.index.set(word, new Set());
      }
      this.index.get(word)!.add(doc.id);
    }
  }

  private removeFromIndex(doc: SearchDocument): void {
    const words = this.tokenize(`${doc.title} ${doc.content}`);
    for (const word of words) {
      this.index.get(word)?.delete(doc.id);
    }
  }

  private findHighlights(doc: SearchDocument, queryWords: string[]): string[] {
    const highlights: string[] = [];
    const content = `${doc.title} ${doc.content}`.toLowerCase();

    for (const word of queryWords) {
      const index = content.indexOf(word);
      if (index !== -1) {
        const start = Math.max(0, index - 30);
        const end = Math.min(content.length, index + word.length + 30);
        const snippet = content.slice(start, end);
        highlights.push(`...${snippet}...`);
      }
    }

    return highlights.slice(0, 3);
  }

  getDocumentCount(): number {
    return this.documents.size;
  }

  getIndexSize(): number {
    return this.index.size;
  }

  clear(): void {
    this.documents.clear();
    this.index.clear();
  }
}

export function createSearchEngine(): SearchEngine {
  return new SearchEngine();
}

export function createSearchDocument(
  type: string,
  title: string,
  content: string,
  metadata?: Record<string, unknown>
): SearchDocument {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    content,
    metadata,
    timestamp: Date.now(),
  };
}

// Global search engine
let globalSearchEngine: SearchEngine | null = null;

export function getGlobalSearchEngine(): SearchEngine {
  if (!globalSearchEngine) {
    globalSearchEngine = createSearchEngine();
  }
  return globalSearchEngine;
}

export function setSearchEngine(engine: SearchEngine): void {
  globalSearchEngine = engine;
}

// Convenience functions
export function indexDocument(doc: SearchDocument): void {
  getGlobalSearchEngine().addDocument(doc);
}

export function searchIndex(query: string, options?: Parameters<SearchEngine["search"]>[1]): SearchResult[] {
  return getGlobalSearchEngine().search(query, options);
}

export function removeDocument(id: string): void {
  getGlobalSearchEngine().removeDocument(id);
}

export function getDocumentCount(): number {
  return getGlobalSearchEngine().getDocumentCount();
}

export function clearSearchIndex(): void {
  getGlobalSearchEngine().clear();
}
