// Generated by CoffeeScript 1.8.0
(function() {
  var module;

  module = angular.module('commons.account.directives', ['restangular']);

  module.directive('avatarSrc', function($compile) {
    var link;
    link = function(scope, element, attrs) {
      var tmpl;
      if (scope.user.mugshot && scope.user.mugshot !== "") {
        element.attr('src', scope.user.mugshot);
      } else {
        tmpl = "http://sigil.cupcake.io/" + scope.user.username + ".png";
        if (scope.size) {
          tmpl += "?w=" + scope.size;
        }
        element.attr('src', tmpl);
      }
      element.attr('width', scope.size);
      return element.attr('height', scope.size);
    };
    return {
      scope: {
        user: "=avatarSrc",
        size: "=avatarSize"
      },
      restrict: 'A',
      link: link
    };
  });

}).call(this);
