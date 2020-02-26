(function() {
    console.log("Hellow Beautiful");

    Vue.component("image-modal", {
        template: "#single-image-component",
        props: ["id"],
        data:  function () {
            return {
                image: {
                    title: "",
                    description: "",
                    username: "",
                    url: "",
                    created_at: new Date(""),
                    id: null,
                },
                newComment: {
                    username: "",
                    commentText: ""
                },
                comments: []
            };
        },
        mounted: function () {
            var self = this;
            axios.get('/getImageById/'+ self.id)
                .then( function (response) {
                    self.image = response.data;
                    //request to get comments
                    axios.get("/comments/" + self.id).then( function (response) {
                        self.comments = response.data;
                    }).catch(err => console.log("Err in /comments/ in script.js : ", err));

                }).catch(err => console.log("Err in /getImageById in script.js : ", err));
        },
        //METHODS ARE EVENT LISTENERES THAT RESPONSE TO EVENTS LIKE A @CLICK ON HTML SIDE
        methods: {
            closeModalRequestToVueComponent: function() {
                this.$emit('close-modal-message-to-template');
            },
            sendComment: function(e) {
                console.log(self);
                e.preventDefault();
                var commentData = {
                    comment: self.newComment.commentText,
                    username: self.newComment.username,
                    image_id: self.image.id
                };
                axios.post("/addcomment", commentData).then(function(response) {
                    self.comments.push(response.data);
                    self.newComment = { };
                }).catch(err => console.log("Err in post /add-comment in script.js : ", err));
            },
        }
    });


    new Vue({
        el: "main",
        data: {
            idOfImageClicked: null,
            images: [],
            //Data Property will store the values of our input fields
            title: " ",
            description: " ",
            username: " ",
            file: null
        },
        //MOUNTED is a good time to go talk to the server
        mounted: function(){
            //Setting this to self to use in AXIOS
            var self = this;
            //AXIOS request to server to Get all images
            axios.get('/getImages').then( function (response) {
                //setting images array in data to response.data
                self.images = response.data;
            }).catch(err => console.log("Err in /getImages in script.js : ", err));
        }, //Mounted Ends
        methods: {
            handleClick: function(e) {
                e.preventDefault();
                //COllecting Form Data and passing to 'this'
                var formData = new FormData();
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('username', this.username);
                formData.append('file', this.file);
                //setting self to this to user in AXIOS
                var self = this;
                //AXIOS to upload Image to stream
                axios.post('/upload', formData).then(function(response){
                    //unshifting to make sure image is the first thing added
                    self.images.unshift(response.data);
                    //setting formData to empty
                    self.formData = { };
                    // console.log("resp from POST /upload: ", response);
                }).catch(err => console.log("Err in /upload in axios script.js : ", err));
            },
            showModal: function(e) {
                this.idOfImageClicked = e.target.id;
            },
            closeModalFuncitonInInstance: function(){
                this.idOfImageClicked = null;
            },
            handleChange: function(e) {
                this.file = e.target.files[0];
                console.log("THIS for imageUpload Data: ", this);
            },
        }
    });



}());
