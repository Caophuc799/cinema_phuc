

var app = angular.module("app.cinema", ["firebase"]);


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
    } else {
        // No user is signed in.
        window.location.href = '/';
        //  alert('Vui lòng đăng nhập');
    }
});


function trimSpace(str) {
    return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, "");
}

var Getyearfromstring = function (str) {
    var parts = str.split('/');
    return parts[2];
}
// Nếu này da1 lớn hoặc bằng hơn da2 thì trả về 1 ngược lại trả về 0
var CompareStringDate = function (da1, da2) {


    var parts1 = da1.split('/');
    var myda1 = new Date(parts1[2], parts1[1] - 1, parts1[0]);
    var parts2 = da2.split('/');
    var myda2 = new Date(parts2[2], parts2[1] - 1, parts2[0]);
    if (myda1.getFullYear() > myda2.getFullYear()) {

        return 1;

    }
    if (myda1.getFullYear() == myda2.getFullYear()) {
        if ((myda1.getMonth() > myda2.getMonth())) {

            return 1;

        };
        if ((myda1.getMonth() == myda2.getMonth())) {
            if (myda1.getDay() >= myda2.getDay()) {

                return 1;

            }
        };

    }

    return 0;
}
// sort ngayf

var sortByDate = function (marr) {
    var arr = marr;
    //  console.log(arr);
    for (var i = 0; i < arr.length; ++i) {
        for (var j = arr.length - 1; j >= i; j--) {
            if (CompareStringDate(arr[i].year, arr[j].year) == 0) {

                var tam = arr[i];
                arr[i] = arr[j];
                arr[j] = tam;


            }
        }
    }
    // console.log(arr);
    return arr;
}

app.controller('listFilmController', ['$scope', '$log', "$firebaseArray", "$firebaseObject", function ($scope, $log, $firebaseArray, $firebaseObject) {
    var databaseRef = firebase.database().ref();



    $scope.ten = "TÀI KHOẢN";
    $scope.timesOption = [{
        name: 'Tất cả'

    }, {
        name: 'Mới nhất'
    }, {
        name: '2016'
    }, {
        name: '2015'
    },
    {
        name: '2014'
    },
    {
        name: '2013'
    }, {
        name: 'Trước 2013'
    }];
    // User is signed in.
    $scope.optionsGenre = [{
        name: 'Tất cả'
    },
    {
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

    $scope.genre = {};
    $scope.imageavatar = '/images/avatar.png';
    $scope.searchgenre = {};
    $scope.searchgenre.name = 'Tất cả';
    $scope.searchtime = {};
    $scope.searchtime.name = 'Tất cả';
    $scope.searchname = '';
    $scope.listFilm = [];
    $scope.inhidden = '';
    $scope.ahidden = 'none'
    $scope.listFilmDefault = [];
    $scope.listFilm = $firebaseArray(databaseRef.child("/films"));

    $scope.listFilm.$loaded().then(function () {
        $scope.inhidden = 'none';
        $scope.ahidden = '';
        // console.log($scope.listFilm);    
        $scope.listFilm = sortByDate($scope.listFilm);
        // console.log('////////////////////');

        // console.log(tam);
        $scope.listFilmDefault = $scope.listFilm;
        for (var i = 0; i < $scope.listFilm.length; ++i) {
            var parts = $scope.listFilm[i].year.split('/');
            $scope.listFilm[i].new = $scope.listFilm[i].year
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var datecur = new Date();
            // console.log(mydate);


            if (mydate.getFullYear() - datecur.getFullYear() >= 0) {
                if ((datecur.getMonth() - mydate.getMonth()) <= 1) {
                    $scope.listFilm[i].new = 'Phim Mới';

                }

            }
        }

    });


    $scope.searchFilm = function () {
        // console.log($('select[name=selector]').val());
      
        if ($scope.searchname != null && $scope.searchname != '') {
            $scope.listFilm = [];

            for (var i = 0; i < $scope.listFilmDefault.length; ++i) {
                if (trimSpace($scope.listFilmDefault[i].name.toUpperCase()).includes(trimSpace($scope.searchname.toUpperCase()))) {
                    $scope.listFilm.push($scope.listFilmDefault[i]);
                    // console.log('dc');

                }
            }

        }

        if ($scope.searchname == null || $scope.searchname == '') {

            if ($scope.searchgenre.name == 'Tất cả') {
                // console.log($scope.searchname);
                // if (trimSpace($scope.searchname) == '' || $scope.searchname == null) {
                $scope.listFilm = [];
                for (var i = 0; i < $scope.listFilmDefault.length; ++i) {
                    // if (trimSpace($scope.listFilmDefault[i].name.toUpperCase()) == trimSpace($scope.searchname.toUpperCase())) {
                    if ($scope.searchtime.name == 'Tất cả') {
                        $scope.listFilm.push($scope.listFilmDefault[i]);
                    } else
                        if ($scope.searchtime.name == 'Mới nhất') {
                            if (Getyearfromstring($scope.listFilmDefault[i].year) >= 2017) {

                                $scope.listFilm.push($scope.listFilmDefault[i]);
                            }
                        }
                        else if ($scope.searchtime.name == 'Trước 2013') {
                            if (Getyearfromstring($scope.listFilmDefault[i].year) < 2013) {

                                $scope.listFilm.push($scope.listFilmDefault[i]);
                            }
                        } else

                            if (Getyearfromstring($scope.listFilmDefault[i].year) == $scope.searchtime.name) {

                                $scope.listFilm.push($scope.listFilmDefault[i]);
                            }

                    // }
                }

            } else {
                databaseRef.child('films').orderByChild("genre").equalTo($scope.searchgenre.name).once('value', function (snapshot) {
                    var userData = snapshot.val();
                    $scope.listFilm = [];
                    if (userData) {
                        // console.log(userData);

                        var arr = $.map(userData, function (el) {
                            return el;
                        });

                        // if (trimSpace($scope.searchname) != '' || $scope.searchname == null) {


                        for (var i = 0; i < arr.length; ++i) {

                            // if (trimSpace(arr[i].name.toUpperCase()) == trimSpace($scope.searchname.toUpperCase())) {
                            if ($scope.searchtime.name == 'Tất cả') {
                                $scope.listFilm.push(arr[i]);
                            } else
                                if ($scope.searchtime.name == 'Mới nhất') {
                                    if (Getyearfromstring(arr[i].year) >= 2017) {

                                        $scope.listFilm.push(arr[i]);
                                    }
                                }
                                else if ($scope.searchtime.name == 'Trước 2013') {
                                    if (Getyearfromstring(arr[i].year) < 2013) {

                                        $scope.listFilm.push(arr[i]);
                                    }
                                } else

                                    if (Getyearfromstring(arr[i].year) == $scope.searchtime.name) {

                                        $scope.listFilm.push(arr[i]);
                                    }


                        }

                    } else {


                    }
                });
            }
        }
        if ($scope.listFilm.length == 0) {
            $.alert({
                title: 'Thông báo',
                content: 'Không có phim nào'
            });
            $scope.listFilm = $scope.listFilmDefault;
        } else {
            $scope.listFilm = sortByDate($scope.listFilm);
            for (var i = 0; i < $scope.listFilm.length; ++i) {
                var parts = $scope.listFilm[i].year.split('/');
                $scope.listFilm[i].new = $scope.listFilm[i].year
                var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
                var datecur = new Date();
                // console.log(mydate);


                if (mydate.getFullYear() - datecur.getFullYear() >= 0) {
                    if ((datecur.getMonth() - mydate.getMonth()) <= 1) {
                        $scope.listFilm[i].new = 'Phim Mới';

                    }

                }
            }
            if ($scope.searchgenre.name != 'Tất cả' || $scope.searchtime.name != 'Tất cả' || $scope.searchname != '') {
                $.alert({
                    title: 'Thông báo',
                    content: 'Đã tìm xong'
                });
                
            }

        }


    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            if (user != null) {
                user.providerData.forEach(function (profile) {
                });
                var databaseRef = firebase.database().ref();
                $scope.account = $firebaseObject(databaseRef.child('/users/' + user.uid));

                $scope.account.$loaded(function () {
                    console.log($scope.account);
                    if ($scope.account.url != '' && $scope.account.url != null) {
                        $scope.imageavatar = $scope.account.url;
                    }
                    if ($scope.account.name == '' || $scope.account.name == null) {


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

        $.confirm({
            title: 'Thông báo',
            content: 'Bạn có muốn đăng xuất?',
            buttons: {
                'Bỏ qua': function () {
                    // here the key 'something' will be used as the text.
                    // $.alert('You clicked on something.');
                    $('#exampleModalLonglogin').modal('hide');
                },
                'Đăng xuất': {
                    action: function () {
                        firebase.auth().signOut().then(function () {
                            // Sign-out successful.
                            window.location.href = "/";
                        }).catch(function (error) {
                            // An error happened.
                        });
                    }
                }
            }
        });

    }
}]) 