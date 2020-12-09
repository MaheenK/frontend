import { Injectable } from '@angular/core';
import { WebrequestService } from './webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webreq: WebrequestService) { }

  createlist(title: string) {
    return this.webreq.post('lists', { title });
  }
}
