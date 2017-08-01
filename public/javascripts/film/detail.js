var app = angular.module("app.cinema", ["xeditable", 'firebase']);




firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
    } else {
        // No user is signed in.
        window.location.href = '/';
        //  alert('Vui lòng đăng nhập');
    }
});

app.controller('detailController', ['$scope', '$log', '$firebaseArray', '$firebaseObject',
    function ($scope, $log, $firebaseArray, $firebaseObject) {


        //   Get id
        var val = window.location.href.toString();
        var arr = val.split('/');
        $scope.id = arr[5];




        // $scope.genres = [{
        //     name: 'Phim hành động'

        // }, {
        //     name: 'Phim cổ trang'
        // }, {
        //     name: 'Phim kiếm hiệp'
        // }, {
        //     name: 'Phim tình cảm'
        // },
        // {
        //     name: 'Phim khoa học'
        // }, {

        //     name: 'Phim hoạt hình'
        // }, {

        //     name: 'Phim chiến tranh'
        // },];
        // $scope.showStatus = function () {
        //     var selected = $filter('filter')($scope.statuses, { value: $scope.user.status });
        //     return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
        // };

        //Get data
        var databaseRef = firebase.database().ref();

        $scope.Film = $firebaseObject(databaseRef.child('/films/' + $scope.id));
        $scope.Film.$loaded(function () {
            console.log($scope.Film);
        });



        //dang suat
        $scope.signoutCinema = function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                window.location.href = "/";
            }).catch(function (error) {
                // An error happened.
            });
        }

    }]);