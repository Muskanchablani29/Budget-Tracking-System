from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user and user.is_active:
        login(request, user)
        return Response({'success': True, 'message': 'Login successful'})
    return Response({'success': False, 'message': 'Invalid credentials'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def logout_view(request):
    logout(request)
    return Response({'success': True, 'message': 'Logged out'})

@api_view(['GET'])
@permission_classes([AllowAny])
@csrf_exempt
def check_auth(request):
    return Response({'authenticated': request.user.is_authenticated})