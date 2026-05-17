from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes # throttle_classes ပါဝင်ရမည်
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle # Throttle class ကို import လုပ်ခြင်း
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Category, Product, StockTransaction, InvitationCode
from .serializers import CategorySerializer, ProductSerializer, StockTransactionSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])
def register_user(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    secret_code = data.get('secret_code')

    # 🌟 [ဒိုင်နမစ် ပြုပြင်လိုက်သည့် အပိုင်း]
    # Database ထဲတွင် User ရိုက်လိုက်သော ကုဒ် ရှိပြီး Active ဖြစ်မဖြစ် လှမ်းစစ်ခြင်း
    code_exists = InvitationCode.objects.filter(code=secret_code, is_active=True).exists()
    
    if not code_exists:
        return Response(
            {'error': 'Invalid or Expired Secret Invitation Code!'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
    User.objects.create_user(username=username, password=password)
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
# ==========================================
# 🌟 ၂။ CATEGORY VIEW (Function-based)
# ==========================================
@api_view(['GET', 'POST'])
def category_list(request):
    # Category အားလုံးကို ဆွဲထုတ်ပြခြင်း (GET)
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
        
    # Category အသစ်ထည့်ခြင်း (POST)
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# 🌟 ၃။ PRODUCT VIEW (Function-based CRUD)
# ==========================================
@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    # Product အချက်အလက် ပြင်ဆင်ခြင်း (PUT)
    if request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Product ဖျက်ခြင်း (DELETE)
    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==========================================
# 🌟 ၄။ STOCK TRANSACTION VIEW (Function-based)
# ==========================================
@api_view(['GET', 'POST'])
def transaction_list(request):
    if request.method == 'GET':
        transactions = StockTransaction.objects.all().order_by('-timestamp')
        serializer = StockTransactionSerializer(transactions, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        serializer = StockTransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)