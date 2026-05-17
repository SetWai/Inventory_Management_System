from django.urls import path
from .views import register_user, category_list, product_list, product_detail, transaction_list

urlpatterns = [
    # Register API
    path('register/', register_user, name='register'),
    
    # Categories API
    path('categories/', category_list, name='category-list'),
    
    # Products API (စာရင်းကြည့်ရန် နှင့် အသစ်ထည့်ရန်)
    path('products/', product_list, name='product-list'),
    
    # Product Detail API (ပြင်ရန် နှင့် ဖျက်ရန်အတွက် id/pk ပါရပါမည်)
    path('products/<int:pk>/', product_detail, name='product-detail'),
    
    # Transactions API
    path('transactions/', transaction_list, name='transaction-list'),
]