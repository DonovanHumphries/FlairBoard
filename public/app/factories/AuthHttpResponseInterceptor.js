var AuthHttpResponseInterceptor = function($q, $location) {
    return {
        response: function (response) {
            if (response.status === 401) {
            }
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $location.path('/account/login').search('returnUrl', $location.path());
            }
            return $q.reject(rejection);
        }
    }
}

AuthHttpResponseInterceptor.$inject = ['$q', '$location'];