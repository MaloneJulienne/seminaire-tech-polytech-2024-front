import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {RouterLink, RouterOutlet} from "@angular/router";
import {NewlinePipe} from "../newline.pipe";

export interface FilmSynopsis {
  synopsis: string;
  resume: string;
  id: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterOutlet, NewlinePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  inputText: string = '';
  lastRequests: FilmSynopsis[] = [];
  response: string | null = null;
  isLoading: boolean = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    // Récupérer les requêtes au chargement de la page
    this.fetchLastRequests();
  }

  fetchLastRequests() {
    this.http.get<FilmSynopsis[]>('http://localhost:3000/film-synopsis?take=10')
      .subscribe({
          next: (res) => {
            this.lastRequests = res
          },
          error: (error) => {
            console.log(`Erreur: ${error.message}`)
          },
        }
      )
  }

  saveLastRequest(synopsis: string, resume: string) {
    this.http.post<void>('http://localhost:3000/film-synopsis', {synopsis, resume})
      .subscribe({
          next: (res) => {
            this.fetchLastRequests();
          },
          error: (error) => {
            console.log(`Erreur: ${error.message}`)
          },
        }
      )
  }


  sendRequest() {
    if (this.inputText.trim()) {
      this.isLoading = true

      this.http.post<{ response: string }>('http://localhost:3000/film-synopsis/generate', {message: this.inputText})
        .subscribe({
            next: (res) => {
              this.response = res.response;
              this.saveLastRequest(this.inputText, res.response);
              this.inputText = '';
              this.isLoading = false
            },
            error: (error) => {
              console.log(`Erreur: ${error.message}`)
              this.isLoading = false
            },
          }
        )
    }
  }

  deleteRequest(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette requête ?')) {
      this.http.delete(`http://localhost:3000/film-synopsis/${id}`)
        .subscribe(
          {
            next: () => {
              this.fetchLastRequests(); // Recharger la liste après la suppression
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la requête:', error);
            }
          }
        );
    }
  }
}
