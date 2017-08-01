var app = angular.module("app.cinema", ['firebase']);

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#avatar-film')
                .attr('src', e.target.result)
               
        };

        reader.readAsDataURL(input.files[0]);
    }
}


function loadAgeSelector() {
    var end = 1900;
    var start = new Date().getFullYear();
    var options = "";
    for (var year = start; year >= end; year--) {
        options += "<option value=" + year + ">" + year + "</option>";
    }
    document.getElementById("yearselect").innerHTML = options;
}




firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
    } else {
        // No user is signed in.
        window.location.href = '/';
        //  alert('Vui lòng đăng nhập');
    }
});

app.controller('createController', ['$scope', '$log', '$firebaseArray', '$firebaseObject', function ($scope, $log, $firebaseArray, $firebaseObject) {





    $scope.optionsGenre = [{
        name: 'Phim hành động'

    }, {
        name: 'Phim cổ trang'
    }, {
        name: 'Phim kiếm hiệp'
    }, {
        name: 'Phim tình cảm'
    },
    {
        name: 'Phim khoa học'
    }, {

        name: 'Phim hoạt hình'
    }, {

        name: 'Phim chiến tranh'
    },];



    var file = null;
    var year = new Date().getFullYear();


    document.getElementById('upload-file').addEventListener('change', function (event) {
        file = event.target.files[0];
    }, false);

    document.getElementById("yearselect").addEventListener('change', function (event) {
        console.log(event.target.value);
    }, false);




    $scope.createFilm = function () {


        // Data firebase
        var databaseRef = firebase.database().ref();

        // Upload image
        // Create a root reference
        var storageRef = firebase.storage().ref();

        // Create the file metadata
        var metadata = {
            contentType: file.type
        };


        // Create a reference to 'images/mountains.jpg'
        console.log((Date.now()));
        var uploadTask = storageRef.child('images/' + (Date.now()) + '.jpg').put(file, metadata);


        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {

                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;

                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            }, function () {
                // Upload completed successfully, now we can get the download URL

                var film = {
                    name: $scope.name,
                    url: uploadTask.snapshot.downloadURL,
                    year: year,
                    content: $scope.content,
                    genre: $scope.genre.name
                }


                databaseRef.child('/films').push(film);
                alert("Tạo thành công");
            });





    }

    $scope.signoutCinema = function () {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            window.location.href = "/";
        }).catch(function (error) {
            // An error happened.
        });
    }



}])