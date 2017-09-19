var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function ($http, $rootScope) {
  $rootScope.authenticated = false;
  $rootScope.current_user = "";

  $rootScope.signout = function () {
    $http.get('/auth/signout');

    $rootScope.authenticated = false;
    $rootScope.current_user = "";
  };
});

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    .when('/signup', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

// app.factory('postService', function ($http) {
//   // var factory = {};
//   // factory.getAll = function () {
//   //   return $http.get('/api/posts');
//   // }
//   // return factory;
// });

app.factory('postService', function ($resource) {
  return $resource('/api/posts/:id');
});

app.controller('mainController', function ($scope, $rootScope, postService) {
  $scope.posts = postService.query();
  // $scope.posts = [];
  $scope.newPost = { create_by: '', text: '', created_at: '' };

  // postService.getAll().success(function (data) {
  //   $scope.posts = data;
  // });
  // $scope.newPost = "";

  $scope.post = function () {
    // postService.save({ created_by: $rootScope.current_user, text: $scope.newPost, created_at: Date.now()},
    //   function() {
    // $scope.posts = postService.query();
    // $scope.newPost = "";
    $scope.newPost.created_at = Date.now();
    $scope.posts.push($scope.newPost);
    $scope.newPost = { created_by: '', text: '', created_at: '' };
  };
});

// $scope.delete = function (post) {
//   postService.delete({ id: post._id });
//   $scope.posts = postService.query();
// };
// });



app.controller('authController', function ($scope, $rootScope, $http, $location) {
  $scope.user = { username: '', password: '' };
  $scope.error_message = '';

  // postService.getAll().success(function (data) {
  //   $scope.posts = data;
  // });

  $scope.login = function () {
    $http.post('/auth/login', $scope.user).success(function (data) {
      if (data.state == 'success') {
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;

        $location.path('/');
      } else {
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function () {
    $http.post('/auth/signup', $scope.user).success(function (data) {
      if (data.state == 'success') {
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;

        $location.path('/');
      } else {
        $scope.error_message = data.message;
      }
    });
  };
});