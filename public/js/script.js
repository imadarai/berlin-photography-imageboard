(function() {
    console.log("Hellow Beautiful");

    new Vue({
        el: "main",
        data: {
            images: []
        },
        //MOUNTED is a good time to go talk to the server
        mounted: function(){
            console.log("My View Component has mounted!!");
            // console.log(this.images);
            var me = this;
            // console.log("this.cities from data: ", this.cities);
            axios.get('/getImages').then( function (response) {
                // console.log("response from server on the route /getImages: ", response);
                // console.log(response.data[0].name);
                //response.data is where the info lives ...
                me.images = response.data;
                console.log("Me.images insdie axios is: ", me.images);
            });



        }
        // methods: {
        //     muffin: function(imageData) {
        //         console.log("Printing Image Data: ", imageData);
        //     }
        // }


    });



}());
