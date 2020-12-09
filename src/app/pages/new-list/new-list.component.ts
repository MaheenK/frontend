import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private taskservice: TaskService) { }

  ngOnInit(): void {
  }

  createlist(title: string){
    this.taskservice.createlist(title).subscribe((response: any) => {
      console.log(response);
    });
  }

}
