(function() {
    console.log("Hellow Beautiful");

    new Vue({
        el: "main",
        data: {
            images: [],
            //Data Property will store the values of our input fields
            title: " ",
            description: " ",
            username: " ",
            file: null
        },
        //MOUNTED is a good time to go talk to the server
        mounted: function(){
            console.log("My View Component has mounted!!");
            var me = this;
            axios.get('/getImages').then( function (response) {
                //response.data is where the info lives ...
                me.images = response.data;
            }).catch(err => console.log("Err in /getImages in script.js : ", err));
        }, //Mounted Ends
        methods: {
            handleClick: function(e) {
                e.preventDefault();
                // console.log("THIS for imageUpload Data: ", this);

                var formData = new FormData();
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('username', this.username);
                formData.append('file', this.file); 

                axios.post('/upload', formData).then(function(resp){
                    console.log("resp from POST /upload: ", resp);
                }).catch(err => console.log("Err in /upload in axios script.js : ", err));


            },
            handleChange: function(e) {
                //this runs when user select an img in the file input field
                console.log('HandleChange is running!');
                console.log('File: ', e.target.files[0]);

                this.file = e.target.files[0];
                console.log("THIS for imageUpload Data: ", this);
            }
        }
    });



}());
