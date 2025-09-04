export abstract class Task {
  public id: string = crypto.randomUUID();

  public enabled: boolean = true;

  abstract frame(): Promise<void>;
}
