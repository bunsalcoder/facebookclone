new Vue({
    el: '#app',
    data: {
        // BASE URL
        URL: 'http://localhost:5000/post',

        // filter search
        usernameSearch: '',

        // these are for login/logout and get the username.
        isLogin: false,
        userName: '',
        userLogged: '',

        // this is to check the nightmode.
        countNightBackground: 0,

        // these are the list tht store all the information of the post.
        postList: [],
        time: '',
        day: '',
        month: '',
        content: '',
        img: '',

        // these are variables for editing
        isUpdating: true,
        getId: 0,

        // images upload
        file: null,
    },
    methods: {

        // userLogin function is used to stored the username and keep the value of isLogin.
        userLogin(){
            if (this.userName !== ''){
                this.isLogin = true;
                localStorage.setItem('isLogin', this.isLogin);
                localStorage.setItem('userName', this.userName);
                this.userName = '';
                this.userLogged = localStorage.getItem('userName');
            }else{
                window.alert('សូមមេត្តាបញ្ចួលឈ្មោះរបស់លោកអ្នកជាមុនសិន🙏')
            }
        },

        // userLogout function is used to go back to userLogin when the user click on it and the localStorage will be cleared.
        userLogout(){
            this.isLogin = false;
            localStorage.setItem('isLogin', this.isLogin);
        },

        // nightMode function is used to change the background to dark.
        nightMode(){
            this.countNightBackground++;
            console.log(this.countNightBackground);
        },

        // toPost function is used to add texts, images, date, description to the post.
        toPost(){
            // Date and time
            let today = new Date();
            this.month = today.getMonth();
            this.day = today.getDay() + ' ' + today.getDay();
            this.time = today.getHours + ':' + today.getMinutes;
            
            // User information
            let author_name = localStorage.getItem('userName');
            let content = this.content;
            let img = this.img;
            let date = this.day + ',' + this.month + ' At ' + ',' + this.time;
            let userInfomation = {
                "img": img,
                "date": date,
                "author_name": author_name,
                "content": content
            };

            window.axios.post(this.URL, userInfomation)
                .then(response => {
                    this.postList = response.data;
                    location.reload();
                })
                .catch(error => {
                    window.alert('សូមអភ័យទោស🙏 ​លោកអ្នកមិនអាចបង្កើតទិន្នន័យបានទេ')
                });
            this.content = '';
            this.isUpdating = true;
        },

        // deletePost function is used to delete the post that you have created
        deletePost(post){
            let id = post.id;
            this.isUpdating = true;
            window.axios.delete(this.URL + '/' + id)
                .then(response => {
                    let sureToDelete = window.confirm('តើលោកអ្នកចង់លុបផុសនេះមែនទេ?');
                    if (sureToDelete){
                        this.postList = response.data;
                        location.reload();
                    };
                })
                .catch(error => {
                    window.alert('សូមអភ័យទោស🙏 លោកអ្នកមិនអាចលុបផុសនេះបានទេ');
                });
        },

        // edit post
        editPost(post){
            this.isUpdating = false;
            this.getId = post.id;
            this.content = post.content;
        },

        // updatePost function is used to update the post when user click on edit button, there will be an updating table pop up
        updatePost(){
            // Date and time
            let today = new Date();
            this.month = today.getMonth();
            this.day = today.getDay();
            this.time = today.getHours + ':' + today.getMinutes;

            // User information
            let author_name = this.userLogged;
            let content = this.content;
            let date = this.day + ',' + this.month + ',' + this.time;
            let newUserInfomation = {
                "img": this.file.name, 
                "date": date, 
                "author_name": author_name, 
                "content": content
            };

            let id = this.getId;

            window.axios.put(this.URL + '/' + id, newUserInfomation)
                .then(response => {
                    this.postList = response.data;
                    location.reload();
                })
                .catch(error => {
                    window.alert('សូមអភ័យទោស🙏 ​លោកអ្នកមិនកែប្រែទិន្នន័យបានទេ')
                });
            this.content = '';
        },

        // getImage is used to upload image
        getImage(){
            this.file = this.$refs.file.files[0];
            this.img = this.file.name;
            const formData = new FormData();
            formData.append('file', this.file);

            axios.post(this.URL + '/image', formData)
                .then(response => {
                    this.postList = response.data;
                })
                .catch(error => {
                    console.error('{error: cannot upload image}');
                });
        } 
    },
    computed: {
        // filteredList function is used to search for each user's post
        filteredList() {
            return this.postList.filter(post => {
                return post.author_name.match(this.usernameSearch);
            });
        }   
    },
    mounted: function() {
        this.isLogin = localStorage.getItem('isLogin');
        this.$nextTick(function (){
            window.axios.get(this.URL)
                .then(response => {
                    this.postList = response.data;
                    this.userLogged = localStorage.getItem('userName');
                })
                .catch(error => {
                    console.error('{error 404: no data founded}')
                });
        });
    }
});

