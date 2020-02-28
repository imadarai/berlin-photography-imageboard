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
                comments: [],
                nextId: null,
                prevId: null
            };
        },
        watch: {
            id: function () {
                var id = this.id;
                this.mountComponentFunction(id);
            }
        },
        mounted: function () {
            var id = this.id;
            this.mountComponentFunction(id);
        },
        //METHODS ARE EVENT LISTENERES THAT RESPONSE TO EVENTS LIKE A @CLICK ON HTML SIDE
        methods: {
            closeModalRequestToVueComponent: function() {
                this.$emit('close-modal-message-to-template');
            },
            sendComment: function(e) {
                var self = this;
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
            mountComponentFunction: function (id) {
                var self = this;
                axios.get('/getImageById/'+ id)
                    .then( function (response) {
                        self.image = response.data;
                        self.nextId = self.image.next_id;
                        self.prevId = self.image.prev_id;
                        //request to get comments
                        axios.get("/comments/" + id).then( function (response) {
                            self.comments = response.data;
                        }).catch(err => console.log("Err in /comments/ in script.js : ", err));
                    }).catch(err => console.log("Err in /getImageById in script.js : ", err));
            },
            nextImage: function () {
                this.mountComponentFunction(this.nextId);
                // this.$emit('change-hash');
                location.hash = this.nextId;
            },
            previousImage: function () {
                this.mountComponentFunction(this.prevId);
                // this.$emit('change-hash');
                location.hash = this.prevId;
            },
        }
    });


    new Vue({
        el: "main",
        data: {
            idOfImageClicked: location.hash.slice(1),
            images: [],
            //Data Property will store the values of our input fields
            formData: {
                title: " ",
                description: " ",
                username: " ",
                file: null,
            },
            EndOfImageStream: false,
        },
        //MOUNTED is a good time to go talk to the server
        mounted: function(){
            this.mountInstanceFunction();
            this.scrollCheck();
        }, //Mounted Ends
        methods: {
            mountInstanceFunction: function() {
                //Setting this to self to use in AXIOS
                var self = this;
                //AXIOS request to server to Get all images
                axios.get('/getImages').then( function (response) {
                    //setting images array in data to response.data
                    self.images = response.data;
                }).catch(err => console.log("Err in /getImages in script.js : ", err));

                addEventListener('hashchange', function() {
                    self.idOfImageClicked= location.hash.slice(1);
                });
            },
            handleClick: function(e) {
                e.preventDefault();
                //COllecting Form Data and passing to 'this'
                var formData = new FormData();
                formData.append('title', this.formData.title);
                formData.append('description', this.formData.description);
                formData.append('username', this.formData.username);
                formData.append('file', this.formData.file);
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
            closeModalFuncitonInInstance: function(){
                this.idOfImageClicked = null;
                location.hash = "";
                history.replaceState(null, null, ' ');
            },
            handleChange: function(e) {
                this.formData.file = e.target.files[0];
            },
            getMoreImages: function() {
                var self = this;
                var idOfLastImage = this.images[this.images.length - 1].id;

                axios.get("/load-more-images/" + idOfLastImage).then(function(response) {
                    self.images.push.apply(self.images, response.data);
                    idOfLastImage = self.images[self.images.length - 1].id;
                    if (response.data.length == 0) {
                        self.EndOfImageStream = true;
                    }
                });
            },
            scrollCheck:function () {
                var self = this;
                window.onscroll =  function() {
                    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 50;
                    if (bottomOfWindow) {
                        self.getMoreImages();
                    } else {
                        setTimeout( self.scrollCheck, 1000);
                    }
                };
            },
        }
    });
}());
