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

  // Wallet starts with 5000 for every new page visit.
  const [walletBalance, setWalletBalance] = useState(5000);

  // Expenses are persisted in localStorage.
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Save expenses to localStorage.
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

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

  const handleAddExpense = (expenseData) => {
    const title = expenseData.title.trim();
    const price = Number(expenseData.price);
    const category = expenseData.category;
    const date = expenseData.date;

    if (!title) {
      enqueueSnackbar("Please enter an expense title", {
        variant: "error",
      });
      return;
    }

    if (!price || price <= 0) {
      enqueueSnackbar("Please enter a valid expense amount", {
        variant: "error",
      });
      return;
    }

    if (!category) {
      enqueueSnackbar("Please select a category", {
        variant: "error",
      });
      return;
    }

    if (!date) {
      enqueueSnackbar("Please select a date", {
        variant: "error",
      });
      return;
    }

    if (price > walletBalance) {
      enqueueSnackbar("Insufficient wallet balance", {
        variant: "error",
      });
      return;
    }

    const newExpense = {
      id: Date.now(),
      title,
      price,
      category,
      date,
    };

    setExpenses((previousExpenses) => [
      ...previousExpenses,
      newExpense,
    ]);

    setWalletBalance(
      (previousBalance) => previousBalance - price
    );

    enqueueSnackbar("Expense added successfully", {
      variant: "success",
    });

    setIsExpenseModalOpen(false);
  };

  const handleUpdateExpense = (expenseData) => {
    const title = expenseData.title.trim();
    const newPrice = Number(expenseData.price);
    const category = expenseData.category;
    const date = expenseData.date;

    if (!title) {
      enqueueSnackbar("Please enter an expense title", {
        variant: "error",
      });
      return;
    }

    if (!newPrice || newPrice <= 0) {
      enqueueSnackbar("Please enter a valid expense amount", {
        variant: "error",
      });
      return;
    }

    if (!category) {
      enqueueSnackbar("Please select a category", {
        variant: "error",
      });
      return;
    }

    if (!date) {
      enqueueSnackbar("Please select a date", {
        variant: "error",
      });
      return;
    }

    const oldPrice = Number(editingExpense.price);
    const difference = newPrice - oldPrice;

    if (difference > walletBalance) {
      enqueueSnackbar("Insufficient wallet balance", {
        variant: "error",
      });
      return;
    }

    setExpenses((previousExpenses) =>
      previousExpenses.map((expense) =>
        expense.id === editingExpense.id
          ? {
              ...expense,
              title,
              price: newPrice,
              category,
              date,
            }
          : expense
      )
    );

    setWalletBalance(
      (previousBalance) => previousBalance - difference
    );

    enqueueSnackbar("Expense updated successfully", {
      variant: "success",
    });

    setEditingExpense(null);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (expenseId) => {
    const expenseToDelete = expenses.find(
      (expense) => expense.id === expenseId
    );

    if (!expenseToDelete) {
      return;
    }

    setExpenses((previousExpenses) =>
      previousExpenses.filter(
        (expense) => expense.id !== expenseId
      )
    );

    setWalletBalance(
      (previousBalance) =>
        previousBalance + Number(expenseToDelete.price)
    );

    enqueueSnackbar("Expense deleted successfully", {
      variant: "success",
    });
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleExpenseSubmit = (expenseData) => {
    if (editingExpense) {
      handleUpdateExpense(expenseData);
    } else {
      handleAddExpense(expenseData);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>

        <div className="header-wallet">
          <MdAccountBalanceWallet />
          <span>Wallet Balance</span>
          <strong>₹{walletBalance.toFixed(2)}</strong>
        </div>
      </header>

      <main className="app-container">
        <section className="wallet-card">
          <div className="wallet-icon">
            <FaWallet />
          </div>

          <div className="wallet-info">
            <p>Wallet Balance</p>
            <h2>₹{walletBalance.toFixed(2)}</h2>
          </div>

          <button
            type="button"
            className="income-button"
            onClick={() => setIsBalanceModalOpen(true)}
          >
            + Add Income
          </button>
        </section>

        <section className="expense-section">
          <div className="section-header">
            <div>
              <h2>Expenses</h2>

              <p>
                Transactions: {expenses.length}{" "}
                {expenses.length === 1
                  ? "expense"
                  : "expenses"}{" "}
                recorded
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

        <section className="dashboard-section">
          <ExpenseSummary expenses={expenses} />
          <ExpenseTrends expenses={expenses} />
        </section>
      </main>

      {isBalanceModalOpen && (
        <AddBalanceModal
          onClose={() => setIsBalanceModalOpen(false)}
          onAddBalance={handleAddBalance}
        />
      )}

      {isExpenseModalOpen && (
        <ExpenseModal
          onClose={() => {
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={handleExpenseSubmit}
          editingExpense={editingExpense}
        />
      )}
    </div>
  );
}

export default App;