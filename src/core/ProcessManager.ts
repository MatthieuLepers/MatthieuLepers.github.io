import { serial } from '@/core/utils';
import type { Task } from '@/core/tasks';

export class ProcessManager {
  private tasks: Array<Task> = [];

  private running: boolean = false;

  private frame: number = 0;

  addTask(task: Task) {
    this.tasks.push(task);
  }

  start() {
    this.frame = requestAnimationFrame(this.update.bind(this));
    this.running = true;
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.running = false;
  }

  async update() {
    if (this.running) {
      await serial(this.tasks.filter(({ enabled }) => enabled).map((task) => () => task.frame()));
    }

    this.frame = requestAnimationFrame(this.update.bind(this));
  }
}
