var app = angular.module("app.cinema", []);


app.controller('registerController', ['$scope', function ($scope) {
    $scope.baibai = "Mai";
    $scope.password = '';
    $scope.passwordConfirm = '';


    $scope.createUser = function () {
        if ($scope.password != null) {
            if ($scope.password != $scope.passwordConfirm) {
                alert("Mật khẩu xác nhận không giống ");
            }
            else {
                firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password)
                    .then(function (firebaseUser) {
                        // Success 

                        var databaseRef = firebase.database().ref();


                        // User is signed in.
                        var acc = {
                            email: $scope.email,
                            name: $scope.yourname,
                            url: "https://firebasestorage.googleapis.com/v0/b/filmapplication-9a88c.appspot.com/o/aa.jpg?alt=media&token=d94d5fc2-25bd-4f14-9193-8a719efb2733"

                        }
                        databaseRef.child('/users/' + firebaseUser.uid).set({
                            acc
                        })
                        
                        console.log(acc);

                        alert('Tạo tài khoản thành công');
                      //  window.location.href = "/film/list";
                    }).catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if (errorCode == 'auth/weak-password') {
                            alert('The password is too weak.');
                        } else {

                            if (error.code == "auth/email-already-in-use") {
                                alert('Tài khoản đã tồn tại');
                            } else {
                                alert(errorMessage);
                            }

                        }




                    });
            }
        }
    }


}])