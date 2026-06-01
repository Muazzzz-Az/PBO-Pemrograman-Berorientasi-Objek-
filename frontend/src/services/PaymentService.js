// src/services/PaymentService.js
const TRANSACTIONS_KEY = 'creartsi_transactions';

// Simpan transaksi
export const saveTransaction = (transaction) => {
  const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
  transactions.unshift(transaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  window.dispatchEvent(new CustomEvent('transactionUpdated'));
  return transaction;
};

// Update status transaksi
export const updateTransactionStatus = (transactionId, status, paymentProof = null) => {
  const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
  const index = transactions.findIndex(t => t.id === transactionId);
  if (index !== -1) {
    transactions[index] = {
      ...transactions[index],
      status: status,
      paymentProof: paymentProof || transactions[index].paymentProof,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    window.dispatchEvent(new CustomEvent('transactionUpdated'));
    return transactions[index];
  }
  return null;
};

// Get transaksi berdasarkan user
export const getUserTransactions = (userId) => {
  const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
  return transactions.filter(t => t.buyerId === userId);
};

// Get transaksi untuk artist (sebagai seller)
export const getArtistTransactions = (artistId) => {
  const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
  return transactions.filter(t => t.artistId === artistId);
};

// Get transaksi berdasarkan ID
export const getTransactionById = (id) => {
  const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
  return transactions.find(t => t.id === id);
};

// Generate kode pembayaran unik
export const generatePaymentCode = () => {
  return 'TRX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};