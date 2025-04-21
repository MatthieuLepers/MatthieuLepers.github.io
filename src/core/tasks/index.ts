export abstract class Task {
  public enabled: boolean = true;

  abstract frame(): Promise<void>;
}
