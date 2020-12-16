import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { WebrequestService } from 'src/app/webrequest.service';
import { CommonModule } from '@angular/common';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskservice: TaskService, private route: ActivatedRoute, private router: Router) { }

  listid: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.listid = params['listid'];
      }
    )
  }

  createtask(title: string) {
    this.taskservice.createtask(title, this.listid).subscribe((newTask: Object) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    })
  }

}
