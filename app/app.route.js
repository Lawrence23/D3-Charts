app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('donut', {
            url:'/donut',
            templateUrl:'app/views/donut.html'
        })
        .state('segment', {
            url: '/segment',
            templateUrl: 'app/views/segment.html'
        })
        .state('stacked', {
            url: '/stacked',
            templateUrl: 'app/views/stacked.html'
    });
});
