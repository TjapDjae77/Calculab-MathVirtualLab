class LogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print("Authorization Header:", request.headers.get('Authorization'))
        response = self.get_response(request)
        return response