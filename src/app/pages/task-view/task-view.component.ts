import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: any;
  tasks: any;

  constructor(
    private taskservice: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.taskservice.getTasks(params.listId).subscribe((tasks: any) => {
        this.tasks = tasks;
      });
    });
    this.taskservice.getLists().subscribe((lists) => {
      this.lists = lists;
    });
  }
}
