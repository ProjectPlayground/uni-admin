import { Observable } from 'rxjs';
import { NewsService } from '../services/news.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators/map';
import {finalize} from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
const STORAGE_KEY = 'local_user';


@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {

  article_title: any;
  article_details: any;
  article_image: any;
  img_name: any;
  
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private router: Router,
    private storage: AngularFireStorage,
     public newsService: NewsService,
		 @Inject(SESSION_STORAGE) private mstorage: StorageService,
		 private toastr: ToastrService) {}


  ngOnInit( ) {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
	}
  
 saveFormData(form) {
	 if(this.article_image){
		this.newsService.addNews(this.article_title, this.article_details, this.article_image, this.img_name).then(
	   (res) => {
		this.router.navigate(['articles']);
	});
	 }
	 else {
		 this.toastr.error('خطأ','يرجى انتظار تحميل الصورة');
	 }
  }
  
 onSelectedFile(event) {
	 this.img_name = event.target.files[0].name;
	  const id = '/posts/' + this.img_name;
	  this.ref = this.storage.ref(id);
	  this.task = this.ref.put(event.target.files[0]);
	  this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
	  this.uploadProgress = this.task.percentageChanges();
	  this.task.snapshotChanges().pipe(
		  finalize(() => {
			this.ref.getDownloadURL().subscribe(url => {
			  this.article_image = url;
			});
		  })
		).subscribe();
	}
	
	cancel(){
		this.router.navigate(['articles']);
	}
}
