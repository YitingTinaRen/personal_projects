from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.


@api_view(['GET'])
def about(request):
    return Response({
        'title': '關於我',
        'content': '這是一個使用 Django REST framework 和 React 建立的網站。'
    })


@api_view(['GET'])
def contact(request):
    return Response({
        'title': '聯絡我',
        'content': '您可以通過以下方式聯絡我：\nEmail: example@example.com\n電話：123-456-7890'
    })
