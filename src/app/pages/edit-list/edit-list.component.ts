import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskservice: TaskService, private router: Router) { }

  listid: string;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.listid = params.listid;
    });

  }

  updatelist(title: string) {
    this.taskservice.updatelist(this.listid, title).subscribe(() => {
      this.router.navigate(['/lists', this.listid]);
    })

  }

}
