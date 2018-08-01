var main = new Vue({
    el: '#main',
    data: {
        scores: [],
    },
    created: function () {
        this.start();
    },
    methods: {
        start: function () {
            var fetchConfig =
                fetch("/api/scoreboard", {
                    method: "GET",
                    credentials: "include",
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }

                }).then(function (json) {

                    var data = json;
                    console.log("data", data);
                    main.scores = data;
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        
    }
})