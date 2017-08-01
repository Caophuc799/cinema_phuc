

var app = angular.module("app.cinema", ["firebase"]);


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
    } else {
        // No user is signed in.
        window.location.href = '/';
        //  alert('Vui lòng đăng nhập');
    }
});

app.controller('listFilmController', ['$scope', '$log', "$firebaseArray", "$firebaseObject", function ($scope, $log, $firebaseArray, $firebaseObject) {
    var databaseRef = firebase.database().ref();


    // User is signed in.
    $scope.listFilm = [];
    $scope.listFilm = $firebaseArray(databaseRef.child("/films"));

    $scope.listFilm.$loaded().then(function () {
        for (var i = 0; i < $scope.listFilm.length; ++i) {
        //    console.log($scope.listFilm[i]);
        //    console.log($scope.listFilm[i].$id);

        }
    });

    $scope.signoutCinema = function () {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            window.location.href = "/";
        }).catch(function (error) {
            // An error happened.
        });
    }
}]) 