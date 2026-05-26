from django.urls import path
from .views import register_user, category_list, product_list, product_detail, transaction_list

urlpatterns = [
    path('register/', register_user, name='register'),
    path('categories/', category_list, name='category-list'), 
    path('products/', product_list, name='product-list'),
    path('products/<int:pk>/', product_detail, name='product-detail'),
    path('transactions/', transaction_list, name='transaction-list'),
]