export type Observer<T> = (value: T) => void;

/**
 * Simple Observer pattern helper for lightweight event streams.
 */
export class Observable<T> {
  private observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  notify(value: T): void {
    this.observers.forEach((observer) => observer(value));
  }
}
