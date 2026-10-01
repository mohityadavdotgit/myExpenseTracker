import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FaWallet } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";

import AddBalanceModal from "./components/AddBalanceModal";
import ExpenseModal from "./components/ExpenseModal";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import ExpenseTrends from "./components/ExpenseTrends";

import "./App.css";

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [walletBalance, setWalletBalance] = useState(() => {
    const savedBalance = localStorage.getItem("walletBalance");

    return savedBalance !== null ? Number(savedBalance) : 5000;
  });

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");

    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [editingExpense, setEditingExpense] = useState(null);

  // Save wallet balance
  useEffect(() => {
    localStorage.setItem("walletBalance", JSON.stringify(walletBalance));
  }, [walletBalance]);

  // Save expenses
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // -----------------------------
  // Add Income
  // -----------------------------
  const handleAddBalance = (amount) => {
    const income = Number(amount);

    if (!income || income <= 0) {
      enqueueSnackbar("Please enter a valid income amount", {
        variant: "error",
      });
      return;
    }

    setWalletBalance((previousBalance) => previousBalance + income);

    enqueueSnackbar("Balance added successfully", {
      variant: "success",
    });

    setIsBalanceModalOpen(false);
  };

  // -----------------------------
  // Add Expense
  // -----------------------------
  const handleAddExpense = (expenseData) => {
    const price = Number(expenseData.price);

    if (!expenseData.title.trim()) {
      enqueueSnackbar("Please enter expense title", {
        variant: "error",
      });
      return false;
    }

    if (!price || price <= 0) {
      enqueueSnackbar("Please enter a valid expense amount", {
        variant: "error",
      });
      return false;
    }

    if (!expenseData.category) {
      enqueueSnackbar("Please select a category", {
        variant: "error",
      });
      return false;
    }

    if (!expenseData.date) {
      enqueueSnackbar("Please select a date", {
        variant: "error",
      });
      return false;
    }

    if (price > walletBalance) {
      enqueueSnackbar("Expense cannot exceed wallet balance", {
        variant: "error",
      });
      return false;
    }

    const newExpense = {
      id: Date.now(),
      title: expenseData.title.trim(),
      price,
      category: expenseData.category,
      date: expenseData.date,
    };

    setExpenses((previousExpenses) => [...previousExpenses, newExpense]);

    setWalletBalance((previousBalance) => previousBalance - price);

    enqueueSnackbar("Expense added successfully", {
      variant: "success",
    });

    return true;
  };

  // -----------------------------
  // Update Expense
  // -----------------------------
  const handleUpdateExpense = (updatedExpense) => {
    const newPrice = Number(updatedExpense.price);
    const oldPrice = Number(editingExpense.price);

    if (!updatedExpense.title.trim()) {
      enqueueSnackbar("Please enter expense title", {
        variant: "error",
      });
      return false;
    }

    if (!newPrice || newPrice <= 0) {
      enqueueSnackbar("Please enter a valid expense amount", {
        variant: "error",
      });
      return false;
    }

    if (!updatedExpense.category) {
      enqueueSnackbar("Please select a category", {
        variant: "error",
      });
      return false;
    }

    if (!updatedExpense.date) {
      enqueueSnackbar("Please select a date", {
        variant: "error",
      });
      return false;
    }

    const priceDifference = newPrice - oldPrice;

    if (priceDifference > walletBalance) {
      enqueueSnackbar("Insufficient wallet balance", {
        variant: "error",
      });
      return false;
    }

    setExpenses((previousExpenses) =>
      previousExpenses.map((expense) =>
        expense.id === updatedExpense.id
          ? {
              ...expense,
              title: updatedExpense.title.trim(),
              price: newPrice,
              category: updatedExpense.category,
              date: updatedExpense.date,
            }
          : expense,
      ),
    );

    setWalletBalance((previousBalance) => previousBalance - priceDifference);

    enqueueSnackbar("Expense updated successfully", {
      variant: "success",
    });

    setEditingExpense(null);

    return true;
  };

  // -----------------------------
  // Delete Expense
  // -----------------------------
  const handleDeleteExpense = (id) => {
    const expenseToDelete = expenses.find((expense) => expense.id === id);

    if (!expenseToDelete) {
      return;
    }

    setExpenses((previousExpenses) =>
      previousExpenses.filter((expense) => expense.id !== id),
    );

    setWalletBalance(
      (previousBalance) => previousBalance + Number(expenseToDelete.price),
    );

    enqueueSnackbar("Expense deleted successfully", {
      variant: "success",
    });
  };

  // -----------------------------
  // Open Edit Modal
  // -----------------------------
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  // -----------------------------
  // Close Expense Modal
  // -----------------------------
  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Expense Tracker</h1>

            <p className="subtitle">
              Manage your expenses and track your spending
            </p>
          </div>

          <div className="wallet-header">
            <MdAccountBalanceWallet />

            <div>
              <span>Wallet Balance</span>

              <strong>₹{walletBalance.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Wallet Card */}
        <section className="top-section">
          <div className="wallet-card">
            <div className="wallet-icon">
              <FaWallet />
            </div>

            <div className="wallet-info">
              <h2>Wallet Balance: ₹{walletBalance.toFixed(2)}</h2>

              <span>Available balance</span>
            </div>

            <button
              type="button"
              className="income-button"
              onClick={() => setIsBalanceModalOpen(true)}
            >
              + Add Income
            </button>
          </div>
        </section>

        {/* Charts */}
        <section className="charts-grid">
          <div className="card chart-card">
            <div className="card-heading">
              <div>
                <h2>Expense Summary</h2>

                <p>Spending by category</p>
              </div>
            </div>

            <ExpenseSummary expenses={expenses} />
          </div>

          <div className="card chart-card">
            <div className="card-heading">
              <div>
                <h2>Expense Trends</h2>

                <p>Total spending by category</p>
              </div>
            </div>

            <ExpenseTrends expenses={expenses} />
          </div>
        </section>

        {/* Expenses */}
        <section className="card expense-card">
          <div className="expense-header">
            <div>
              <h2>Expenses</h2>

              <p>
                Transactions: {expenses.length}{" "}
                {expenses.length === 1 ? "expense" : "expenses"} recorded
              </p>
            </div>

            <button
              type="button"
              className="expense-button"
              onClick={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
            >
              + Add Expense
            </button>
          </div>

          <ExpenseList
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </section>
      </main>

      {/* Add Balance Modal */}
      <AddBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        onSubmit={handleAddBalance}
      />

      {/* Add/Edit Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={closeExpenseModal}
        onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
        editingExpense={editingExpense}
      />
    </div>
  );
}

export default App;
