import { Injectable } from '@angular/core';
import { Task } from './models/task.model';
import { WebrequestService } from './webrequest.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webreq: WebrequestService) { }

  createlist(title: string) {
    return this.webreq.post('lists', { title });
  }
  getLists() {
    return this.webreq.get('lists');
  }

  getTasks(listid: string) {
    return this.webreq.get(`lists/${listid}/tasks`);
  }

  createtask(title: string, listid: string) {
    return this.webreq.post(`lists/${listid}/tasks`, { title });
  }

  complete(task: Task) {
    return this.webreq.patch(`lists/${task._listId}/tasks/${task._id}`, { completed: true });
  }
}