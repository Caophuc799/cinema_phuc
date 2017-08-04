

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

    $scope.ten = "Tài Khoản";
    // User is signed in.
    $scope.listFilm = [];
    $scope.listFilm = $firebaseArray(databaseRef.child("/films"));

    $scope.listFilm.$loaded().then(function () {
        for (var i = 0; i < $scope.listFilm.length; ++i) {
            //    console.log($scope.listFilm[i]);
            //    console.log($scope.listFilm[i].$id);
            var parts = $scope.listFilm[i].year.split('/');
            //please put attention to the month (parts[0]), Javascript counts months from 0:
            // January - 0, February - 1, etc
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var datecur = new Date();
            // console.log(mydate);
            if (mydate.getFullYear() >= datecur.getFullYear()) {
                if ((mydate.getMonth() - datecur.getMonth()) <= 1) {
                    $scope.listFilm[i].new = 'Phim Mới';
                    $scope.listFilm[i].year = '';
                }

            }
        }

    });

    $scope.imageavatar = '/images/avatar.png';
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            if (user != null) {
                user.providerData.forEach(function (profile) {
                });
                var databaseRef = firebase.database().ref();
                $scope.account = $firebaseObject(databaseRef.child('/users/' + user.uid));

                $scope.account.$loaded(function () {
                    console.log($scope.account);
                    if ($scope.account.url != '') {
                        $scope.imageavatar = $scope.account.url;
                    }
                    if ($scope.account.name == '' || $scope.account.name == ' ') {


                    } else {
                        $scope.ten = $scope.account.name
                    }
                })


            }
        } else {
            // No user is signed in.
            window.location.href = '/';
            //  alert('Vui lòng đăng nhập');
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