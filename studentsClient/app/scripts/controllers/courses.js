'use strict';

/**
 * @ngdoc function
 * @name studentsClientApp.controller:CoursesCtrl
 * @description
 * # CoursesCtrl
 * Controller of the studentsClientApp
 */
angular.module('studentsClientApp')
  .controller('CoursesCtrl', ['$scope', 'Restangular', '$uibModal', '$log', '_', function($scope, Restangular, $uibModal, $log, _) {
    Restangular.all("courses").getList().then(function(entries) {
      $scope.courses = entries;
    });
    $scope.deleteCourse = function(id) {
      Restangular.one("courses", id).remove().then(function() {
        // uklanjamo studenta sa zadatim id-om iz kolekcije
        _.remove($scope.courses, {
          id: id
        });
      }, function() {
        $log.info("something went wrong");
      });
    };

    var CourseModalCtrl = ['$scope', '$uibModalInstance', 'course', 'Restangular', '$log', '_',
        function($scope, $uibModalInstance, course, Restangular, $log, _) {
          $scope.course = course;
          if ($scope.course.id) {
            Restangular.one("courses", $scope.course.id).getList("students").then(function(entries) {
              $scope.enrollments = entries;
            });
          }

          $scope.ok = function() {
            if ($scope.course.id) {
              Restangular.all('courses').customPUT($scope.course).then(function (data) {
                var index = _.indexOf($scope.courses, _.find($scope.courses, {id: $scope.course.id}));
                $scope.courses.splice(index, 1, data);
              });
            } else {
              Restangular.all('courses').post($scope.course).then(function (data) {
                $scope.courses.push(data);
              },
                // callback za gresku sa servera
                function() {
                  $log.info('something went wrong!');
                });
            }
            $uibModalInstance.close('ok');
          };

          $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };

          $scope.deleteEnrollment = function (id) {
            Restangular.one("enrollment", id).remove().then(function() {
              _.remove($scope.enrollments, {
                id: id
              });
            }, function() {
              $log.info("something went wrong");
            });
          };

          var StudentEnrollmentModalCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
            var enrolledStudentIds = _.map($scope.enrollments,function (value) {
              return value.student.id;
            });
            Restangular.all('students').getList().then(function (data) {
              $scope.students = data;
              _.remove($scope.students, function (student) {
                return _.contains(enrolledStudentIds, student.id);
              });
            });

            $scope.startDate={};
            $scope.openStartDate = function() {
                $scope.startDate.opened = true;
              };

            $scope.endDate={};
            $scope.openEndDate = function() {
                $scope.endDate.opened = true;
              };

            $scope.ok = function() {
              $scope.enrollment.student={"id":$scope.student.id};
              Restangular.all('enrollment').post($scope.enrollment).then(function (data) {
                  $scope.enrollments.push(data);
              });
              $uibModalInstance.close('ok');
            };

            $scope.cancel = function() {
              $uibModalInstance.dismiss('cancel');
            };

          }];

          $scope.openModal = function() {
            $scope.enrollment = {"course":{"id":$scope.course.id}};
            var modalInstance = $uibModal.open({
              templateUrl: 'views/modals/studentEnrollment.html',
              controller: StudentEnrollmentModalCtrl,
              scope: $scope,
              resolve: {
                course: function() {
                  return course;
                }
              }
            });
            modalInstance.result.then(function(value) {
              $log.info('Modal finished its job at: ' + new Date() + ' with value: ' + value);
            }, function(value) {
              $log.info('Modal dismissed at: ' + new Date() + ' with value: ' + value);
            });
          };

        }
      ];

    $scope.openModal = function(course) {
      if (!course) {
        course = {
          name: ''
        };
      }
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modals/course.html',
        controller: CourseModalCtrl,
        scope: $scope,
        resolve: {
          course: function() {
            return course;
          }
        }
      });
      modalInstance.result.then(function(value) {
        $log.info('Modal finished its job at: ' + new Date() + ' with value: ' + value);
      }, function(value) {
        $log.info('Modal dismissed at: ' + new Date() + ' with value: ' + value);
      });
    };

  }]);
