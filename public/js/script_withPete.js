(function() {
    console.log("Hellow Beautiful");

    new Vue({
        el: "main",
        data: {
            cohort: "Allspice", //these properties are dynamic and reactive.
            //OBJECTS
            name: {
                first: "Imad",
                last: "Arain"
            },
            //TRUTHY AND FLASY
            seen: true,
            //ARRAY OF OBJECTS
            cities: []
        },
        //MOUNTED is a good time to go talk to the server
        mounted: function(){
            console.log("My View Component has mounted!!");
            // console.log("This.cities before push: ", this.cities);
            // this.cities.push('hello');
            // console.log("This.cities after push: ", this.cities);

            //We need to store this in a variable so it dosn't get overwrittn
            var me = this;
            // console.log("this.cities from data: ", this.cities);
            axios.get('/cities').then( function (response) {
                console.log("response from server on the route /cities: ", response);
                console.log(response.data[0].name);
                //response.data is where the info lives ...
                me.cities = response.data;


            });


        },
        methods: {
            muffin: function(cityName) {
                console.log("Muffin is running!", cityName);
            }
        }


    });



}());
