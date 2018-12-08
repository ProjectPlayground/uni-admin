import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { NewsService } from '../services/news.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {
	
	video_title: any;
    video_link: any;

  constructor(private router: Router,
    public afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
     public newsService: NewsService,
     @Inject(SESSION_STORAGE) private mstorage: StorageService) {}

  ngOnInit( ) {
    console.log(this.mstorage
      .get(STORAGE_KEY) || 'LocaL storage is empty');
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }
  
  async saveFormData(form) {

	this.newsService.addVideos(this.video_title, this.video_link).then(
		(res) => {
			this.router.navigate(['videos']);
			},(err) => {
        alert("خطا في ادخال البيانات");
    });
  }
}