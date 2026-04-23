from rest_framework import generics
from .models import Transaction
from .serializers import TransactionSerializer
from django.http import JsonResponse


class TransactionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    lookup_field = 'id'

  

def api_root(request):
    return JsonResponse({"message": "API Transactions", "endpoints": ["/api/transactions/"]})
