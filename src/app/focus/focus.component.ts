import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NewlinePipe} from "../newline.pipe";
import {CommonModule} from "@angular/common";
import {FilmSynopsis} from "../home/home.component";

@Component({
  selector: 'app-focus',
  standalone: true,
  imports: [NewlinePipe, CommonModule, RouterModule],
  templateUrl: './focus.component.html',
  styleUrl: './focus.component.css'
})
export class FocusComponent implements OnInit {
  request: string | null = null;
  response: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchRequest(id);
      }
    });
  }

  fetchRequest(id: string): void {
    this.http.get<FilmSynopsis>(`http://localhost:3000/film-synopsis/${id}`)
      .subscribe(
        {
          next: (res) => {
            this.request = res.synopsis;
            this.response = res.resume;
          },
          error: (error) => {
            this.request = `Erreur: ${error.message}`;
            this.response = "";
          }
        }
      );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

}
