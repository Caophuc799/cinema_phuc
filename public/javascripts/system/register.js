var app = angular.module("app.cinema", []);


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        setTimeout(function () {
            window.location.href = '/film/list';
        }, 1000);
        //  window.location.href = '/film/list';
    } else {
        // No user is signed in.

        //  alert('Vui lòng đăng nhập');
    }
});

app.controller('registerController', ['$scope', function ($scope) {
    $scope.baibai = "Mai";
    $scope.password = '';
    $scope.passwordConfirm = '';



    
    $scope.createUser = function () {
        if ($scope.password != null) {
            if ($scope.password != $scope.passwordConfirm) {
                $.alert({
                    title: 'Thông báo',
                    content: 'Mật khẩu xác nhận không đúng'
                });
            }
            else {
                firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password)
                    .then(function (firebaseUser) {
                        // Success 

                        var databaseRef = firebase.database().ref();


                        // User is signed in.
                        var account = {
                            id: firebaseUser.uid,
                            email: $scope.email,
                            name: $scope.yourname,
                            url: '',
                            phone: '',
                            address: '',
                            description: '',
                            type:'user'
                        }


                        databaseRef.child("/users/" + firebaseUser.uid).set(account, function (error) {
                            if (error) {
                                $.alert({
                                    title: 'Thông báo',
                                    content: 'Đã xảy ra lỗi, vui lòng thử lại!'
                                });
                            } else {
                                window.location.href = 'film/list';
                            }
                        });


                        console.log(firebaseUser.uid);
                        console.log($scope.email);
                        console.log($scope.yourname);
                        $.alert({
                            title: 'Thành công',
                            content: 'Tạo tài khoản thành công'
                        });

                    }).catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if (errorCode == 'auth/weak-password') {
                            $.alert({
                                title: 'Thông báo',
                                content: 'Mật khẩu quá yếu'
                            });
                        } else {

                            if (error.code == "auth/email-already-in-use") {
                                 $.alert({
                                title: 'Thông báo',
                                content: 'Tài khoản đã tồn tại'
                            });
                            } else {
                                alert(errorMessage);
                            }

                        }




                    });
            }
        }
    }


}])