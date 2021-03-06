import Ember from 'ember';
import Satellite from '../models/satellite';

export default Ember.Service.extend({
  init(){
    this.setup();
  },

  setup(){
    if ( this.promise ) return this.promise;
    return this.promise = new Promise((resolve, reject) => {
      return $.get(`/api/satellites`).then((data) => {

        // Sort to help typeahead later on
        data = data.sort(function(obj1, obj2){
          if (obj1.city > obj2.city) return 1;
          if (obj1.city < obj2.city) return -1;
          if (obj1.state > obj2.state) return 1;
          if (obj1.state < obj2.state) return -1;
          if (obj1.country > obj2.country) return 1;
          if (obj1.country < obj2.country) return -1;
          return 0;
        });

        // Promote to Satellite objects
        data.forEach((datum, index) => {
          data[index] = new Satellite(datum);
        });

        this.set('list', data);
        resolve();
      }, (err) => {
        this.get('notifications').error('Error fetching satellite data');
        reject();
      });

    });
  },

  list: []
});
