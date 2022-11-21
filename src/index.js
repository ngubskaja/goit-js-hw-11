
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './news-service';
import cards from './templates/articles.hbs';
import LoadMoreBTN from './components/load-more.btn';

const refs ={
  formRefs:document.querySelector('.search-form'),
  button:document.querySelector('button'),
  gallery:document.querySelector('.gallery'),
  // loadMoreBtn:document.querySelector('.load-more'),
}
const loadMoreBtn = new LoadMoreBTN({
  selector: '[data-action = "load-more"]',
  hidden: true,
})

let totalPages = 0;

const newsApiService = new NewsApiService();

const lightbox = {
  init(){
    this.lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      close: true,
    });
  },
  refresh() {
    this.lightbox.refresh();
  }
};



refs.formRefs.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchHits);


 function onSearch(evt) {
   evt.preventDefault();
   clearArticleContainer();
   loadMoreBtn.show();
   newsApiService.resetPage();
   newsApiService.query = evt.currentTarget.elements.searchQuery.value;
   fetchHits();
 }

 function fetchHits(){
  loadMoreBtn.enable();
  newsApiService.myApi().then(({hits, totalHits}) => {
    if(newsApiService.query === '') {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    clearArticleContainer();
    return loadMoreBtn.hide();
  }
  totalPages = totalHits;
  if (hits < 1 ){
    Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    return loadMoreBtn.hide();
  }
  Notify.success(`Hooray! We found ${totalHits} images.`);
  createResultMarkup(hits)
  lightbox.init();
  if(totalPages < 1 ){
    Notify.warning('Sorry, there are no images matching your search query. Please try again.')
    clearArticleContainer()
  }
  newsApiService.incrimentPage()
  if(totalPages > totalHits) {
    Notify.info(`We're sorry, but you've reached the end of search results.`)
    return loadMoreBtn.hide()
    
  }
  
 })
 }

 function clearArticleContainer(){
  refs.gallery.innerHTML ='';
 }
 function createResultMarkup(hits){
  refs.gallery.insertAdjacentHTML('beforeend' , cards(hits));
 }

 


