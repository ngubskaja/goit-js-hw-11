// 1. 
// Форма поиска
// Пользователь будет вводить строку для поиска в текстовое поле, а при сабмите формы необходимо выполнять HTTP-запрос.

// 2. 
// HTTP-запросы
// Список параметров строки запроса которые тебе обязательно необходимо указать:

// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.
// В ответе будет массив изображений удовлетворивших критериям параметров запроса.

//  Каждое изображение описывается объектом, из которого тебе интересны только следующие свойства:

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.
// Если бэкенд возвращает пустой массив, значит ничего подходящего найдено небыло. 
// В таком случае показывай уведомление с текстом 
// "Sorry, there are no images matching your search query. Please try again.". Для уведомлений используй библиотеку notiflix.

// 3. 
// в єлемент div.gallery необходимо рендерить разметку карточек изображений. 
// При поиске по новому ключевому слову необходимо полностью очищать содержимое галереи, чтобы не смешивать результаты.

// 4. 
//  параметры page и per_page. 
// Сделай так, чтобы в каждом ответе приходило 40 объектов (по умолчанию 20).

// Изначально page должно быть 1.
// При каждом последующем запросе, его необходимо увеличить на 1.
// При поиске по новому ключевому слову значение page надо вернуть в исходное, 
// так как будет пагинация по новой коллекции изображений.

// <button type="button" class="load-more">Load more</button>

// Изначально кнопка должна быть скрыта.
// После первого запроса кнопка появляется в интерфейсе под галереей.
// При повторном сабмите формы кнопка сначала прячется, а после запроса опять отображается.





import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './news-service';
import cards from './templates/articles.hbs';
import LoadMoreBTN from './components/load-more.btn';

const refs ={
  formRefs:document.querySelector('#search-form'),
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
const lightbox = new SimpleLightbox('.galery a', {
  close: true,
  captionsData: 'alt',
  captionDelay: 250,
});



refs.formRefs.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', fetchHits);



// // gallery.addEventListener('click', )

 function onSearch(evt) {
   evt.preventDefault();
   clearArticleContainer();
   loadMoreBtn.show();
   newsApiService.resetPage();
   newsApiService.query = evt.currentTarget.elements.searchQuery.value;
   fetchHits();
 }

 function fetchHits(){
  loadMoreBtn.anable();
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
  Notify.success('Hooray! We found ${totalHits} images.');
  createResultMarkup(hits)
  new SimpleLightbox('.galery a');
  if(totalPages < 1 ){
    Notify.warning('Sorry, there are no images matching your search query. Please try again.')
    clearArticleContainer()
  }
  newsApiService.incrimentPages()
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
  refs.gallery.insertAdjacentElement('before' , cards(hits));
 }

 


