import axios from "axios";
export default class NewsApiService {
    constructor () {
        this.searchQuery = '';
        this.page = 1;
        this.API_KEY = "31322734-692d0c8f8a819df0edc128403";
        this.SITE = 'https://pixabay.com/api';
        this.PER_PAGE = 40;
};

async myApi() {
    
    const url = await axios.get(`
    https://pixabay.com/api/?key=${this.API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
);
    return url.data;
  
      }
  
  incrimentPage() {
    this.page += 1;
  }
  
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
}

  set query(newQuery) {
    this.searchQuery = newQuery;
}
}