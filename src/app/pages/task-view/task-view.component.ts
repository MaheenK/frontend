import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';
import { CommonModule } from '@angular/common';

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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.listid) {
        this.taskservice.getTasks(params.listid).subscribe((tasks: any) => {
          this.tasks = tasks;
        });
      } else {
        this.tasks = undefined;
      }
    });

    this.taskservice.getLists().subscribe((lists: any) => {
      this.lists = lists;
    });
  }

  ontaskclick(task: Task) {
    // we want to set the task to completed
    this.taskservice.complete(task).subscribe(() => {
      // the task has been set to completed successfully
      console.log('Completed successully!');
    });
  }
}
