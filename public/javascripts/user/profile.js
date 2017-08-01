var app = angular.module("app.cinema", ['firebase']);



firebase.auth().onAuthStateChanged(function (user) {
    if (user) {


    } else {
        // No user is signed in.
        window.location.href = '/';
        //  alert('Vui lòng đăng nhập');
    }
});

var checkimg = false;
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            checkimg = true;
            console.log(checkimg);
            $('#img-profile')
                .attr('src', e.target.result)
                .width(300)
                .height(300);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

app.controller('profileController', ['$scope', '$log', '$firebaseArray', '$firebaseObject',
    function ($scope, $log, $firebaseArray, $firebaseObject) {


        $scope.mai = "mai";


        var file = null;
        document.getElementById('upload-file').addEventListener('change', function (event) {
            file = event.target.files[0];
        }, false);


        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {

                if (user != null) {
                    user.providerData.forEach(function (profile) {


                    });
                    var databaseRef = firebase.database().ref();
                    $scope.account = $firebaseObject(databaseRef.child('/users/' + user.uid));

                    $scope.account.$loaded(function () {
                        console.log($scope.account.$id);

                    })

                }
            } else {
                // No user is signed in.
                window.location.href = '/';
                //  alert('Vui lòng đăng nhập');
            }
        });

        $scope.savechange = function () {
            var storageRef = firebase.storage().ref();
            var databaseRef = firebase.database().ref();
            // Create the file metadata
            console.log(checkimg);





            if (checkimg == false) {
                var ac = {
                    email: $scope.account.email,
                    name: $scope.account.name,
                    url: $scope.account.url
                }

                databaseRef.child('users').child($scope.account.$id).update(ac);

                alert("Cập nhật thành công");
            } else {


                if (file != null) {
                    var metadata = {
                        contentType: file.type
                    };
                }
                // Create a reference to 'images/mountains.jpg'
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
                        var ab = {
                            email: $scope.account.email,
                            name: $scope.account.name,
                            url: uploadTask.snapshot.downloadURL
                        }

                        databaseRef.child('users').child($scope.account.$id).update(ab);

                        alert("Cập nhật thành công 2");
                    });



            }
        }



        //  console.log(user);

        $scope.signoutCinema = function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                window.location.href = "/";
            }).catch(function (error) {
                // An error happened.
            });
        }

    }]);