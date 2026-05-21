from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    UNIT_CHOICES = [
        ('KG', 'Kilogram'),
        ('G', 'Gram'),
        ('L', 'Liter'),
        ('PCS', 'Pieces'),
    ]

    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, null=True, unique=True) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    unit = models.CharField(max_length=20, default='PCS')
    min_stock_level = models.DecimalField(max_digits=10, decimal_places=2, default=5.00)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

    @property
    def is_low_stock(self):
        return self.quantity <= self.min_stock_level

class StockTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('IN', 'Stock In (Purchase)'),
        ('OUT', 'Stock Out (Used/Waste)'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=3, choices=TRANSACTION_TYPES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Transaction အသစ်ဖြစ်မှသာ Stock ကို ပြင်မည်
        if not self.pk:
            if self.transaction_type == 'IN':
                self.product.quantity += self.quantity
            else:
                self.product.quantity -= self.quantity
            self.product.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_type} - {self.product.name} ({self.quantity})"
    
class InvitationCode(models.Model):
    code = models.CharField(max_length=50, unique=True, help_text="The unique secret code required for new user registration.")
    is_active = models.BooleanField(default=True, help_text="Designates whether this invitation code is active and valid for use.")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} ({'Active' if self.is_active else 'Inactive'})"
    