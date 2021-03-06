var app = angular.module("app.cinema", []);
//var firebase=require("firebase");

// var provider = new firebase.auth.GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');



firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

    } else {
        // No user is signed in.

        //  alert('Vui lòng đăng nhập');
    }
});

var callbackMain = function () {
    setTimeout(function () {
        window.location.href = '/film/list';
    }, 2500);
}
app.controller('loginController', ['$scope', function ($scope) {

    $scope.nam = "10000";
    $scope.resetemail = '';
    // No user is signed in.
    $scope.attrhidden = '';
    $scope.anhidden = 'none';
    $scope.inhidden = '';

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $scope.anhidden = 'none';
            $scope.inhidden = '';
            callbackMain();
        } else {
            $scope.anhidden = '';
            $scope.inhidden = 'none';
            // No user is signed in.

            //  alert('Vui lòng đăng nhập');
        }
    });


    //dang nhap bang fb
    $scope.loginFacebook = function () {

        // var id = '1966928746924754';
        // var idpp = '6732424686315d9c9e72076230c02cd3';
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        provider.setCustomParameters({
            'display': 'popup'
        });

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            var databaseRef = firebase.database().ref();
            var emailacc = '';
            if (user.email != null) {
                emailacc = user.email;
            }
            var account = {
                id: user.uid,
                email: emailacc,
                name: user.displayName,
                url: user.photoURL,
                phone: '',
                address: '',
                description: '',
                type: 'facebook'
            }

            databaseRef.child('users').orderByChild("id").equalTo(user.uid).once('value', function (snapshot) {
                var userData = snapshot.val();
                if (userData) {
                    console.log("exists!");
                } else {

                    databaseRef.child('/users/' + user.uid).set(account, function (error) {
                        if (error) {

                            $.alert({
                                title: 'Thông báo',
                                content: 'Đã xảy ra lỗi, vui lòng thử lại'
                            });
                        } else {

                            window.location.href = 'film/list';
                        }
                    });

                }
            });



            console.log(account);
            console.log(user.uid);
            // console.log($scope.email);
            // console.log($scope.yourname);

            //   window.location.href = "/film/list";

        }).catch(function (error) {
            $scope.anhidden = '';
            $scope.inhidden = 'none';
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log("Lỗi đăng nhập facebook");
            console.log(error);
            $.alert({
                title: 'Thông báo',
                content: 'Đã xảy ra lỗi, vui lòng thử lại'
            });
            // ...
        });
    }


    //Dang nhap bang google
    $scope.loginGoogle = function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        provider.setCustomParameters({
            'login_hint': 'user@example.com'
        });
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            var databaseRef = firebase.database().ref();


            // User is signed in.
            var account = {
                id: user.uid,
                email: user.email,
                name: user.displayName,
                url: user.photoURL,
                phone: '',
                address: '',
                description: '',
                type: 'google'
            }
            databaseRef.child('users').orderByChild("id").equalTo(user.uid).once('value', function (snapshot) {
                var userData = snapshot.val();
                if (userData) {
                    console.log("exists!");
                } else {
                    databaseRef.child('/users/' + user.uid).set(account, function (error) {
                        if (error) {

                            $.alert({
                                title: 'Thông báo',
                                content: 'Đã xảy ra lỗi, vui lòng thử lại'
                            });
                        } else {

                            window.location.href = 'film/list';
                        }
                    });
                }
            });

            console.log(account);
            console.log(user.uid);
            console.log($scope.email);
            console.log($scope.yourname);




            // ...
        }).catch(function (error) {

            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log("Lỗi đăng nhập google");
            console.log(error);
            // ...
        });
    }

    $scope.ResetPassword = function () {
        $.confirm({
            title: 'Quên mật khẩu',
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Nhập email</label>' +
            '<input type="email" placeholder="email" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Gửi',
                    btnClass: 'btn-blue',
                    action: function () {
                        // var name = this.$content.find('.name').val();
                        // if (!name || name.search('@') != 1) {

                        //     $.alert({
                        //         title: 'Thông báo',
                        //         content: 'Email không đúng!'
                        //     });
                        //     return false;
                        // } else {

                        var auth = firebase.auth();
                        auth.sendPasswordResetEmail($scope.resetemail).then(function () {
                            // Email sent.
                            $.alert({
                                title: 'Thông báo',
                                content: 'Vui lòng kiểm tra email'
                            });
                            return true;
                        }).catch(function (error) {
                            // An error happened.
                            $.alert({
                                title: 'Thông báo',
                                content: 'Email không đúng!'
                            });
                            return false;
                        });
                        // }
                    }
                },
                'Bỏ qua': function () {
                    //close
                },
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('Gửi', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });

    }
    $scope.loginCinema = function () {


        firebase.auth().signInWithEmailAndPassword($scope.username, $scope.password)
            .then(function (firebaseUser) {
                // Success 

                // console.log("Success");
                window.location.href = "/film/list";

            })
            .catch(function (error) {
                // Error Handling
                console.log(error);
                if (error.code == "auth/user-not-found") {
                    $.alert({
                        title: 'Thông báo',
                        content: 'Tài khoản không tồn tại, vui lòng đăng kí tài khoản'
                    }); s
                }
                if (error.code == "auth/wrong-password") {
                    $.alert({
                        title: 'Thông báo',
                        content: 'Sai mật khẩu, vui lòng nhập lại mật khẩu'
                    });
                }
            });


    }



}])