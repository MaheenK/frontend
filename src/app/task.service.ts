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
    return this.webreq.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }

  deletelist(id: string) {
    return this.webreq.delete(`lists/${id}`);
  }

  deletetask(listid: string, taskid: string) {
    return this.webreq.delete(`lists/${listid}/tasks/${taskid}`);
  }

  updatelist(id: string, title: string) {
    return this.webreq.patch(`lists/${id}`, { title });
  }

  updatetask(listid: string, taskid: string, title: string) {
    return this.webreq.patch(`lists/${listid}/tasks/${taskid}`, { title });
  }
}