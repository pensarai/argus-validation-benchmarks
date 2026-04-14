from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = [
        "product",
        "product_name",
        "product_sku",
        "quantity",
        "unit_price",
    ]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "status",
        "total",
        "shipping_city",
        "shipping_state",
        "created_at",
    ]
    list_filter = ["status", "created_at"]
    search_fields = ["user__email", "shipping_address"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [OrderItemInline]
