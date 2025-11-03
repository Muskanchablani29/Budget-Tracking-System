from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Transaction, Wallet

@receiver(post_delete, sender=Transaction)
def update_wallet_on_transaction_delete(sender, instance, **kwargs):
    """Update wallet balance when transaction is deleted from admin"""
    try:
        wallet, created = Wallet.objects.get_or_create(user=instance.user)
        
        # Reverse the transaction effect on wallet
        if instance.type == 'ADD':
            # If it was an ADD transaction, subtract from wallet
            wallet.balance = max(0, wallet.balance - instance.amount)
        else:  # EXPENSE
            # If it was an EXPENSE transaction, add back to wallet
            wallet.balance += instance.amount
        
        wallet.save()
    except Exception as e:
        print(f"Error updating wallet on transaction delete: {e}")