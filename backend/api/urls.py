from django.urls import path
from .views import (
    TransactionListCreateAPIView,
    TransactionRetrieveUpdateDestroyView
)

urlpatterns = [
    path(
        'transactions/',
        TransactionListCreateAPIView.as_view(),
        name='transactions-list'
    ),
    path(
        'transactions/<uuid:id>/',
        TransactionRetrieveUpdateDestroyView.as_view(),
        name='transaction-detail'
    ),
]
