import { useEffect, useState } from "react";
import { FaTimes, FaReceipt } from "react-icons/fa";

const initialForm = {
  title: "",
  price: "",
  category: "",
  date: "",
};

function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  editingExpense,
}) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title,
        price: editingExpense.price,
        category: editingExpense.category,
        date: editingExpense.date,
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingExpense, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = editingExpense
      ? {
          ...formData,
          id: editingExpense.id,
        }
      : formData;

    const success = onSubmit(data);

    if (success) {
      setFormData(initialForm);

      if (!editingExpense) {
        onClose();
      }
    }
  };

  const handleClose = () => {
    setFormData(initialForm);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal expense-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
      >
        <div className="modal-header">

          <div>
            <div className="modal-icon">
              <FaReceipt />
            </div>

            <h2 id="expense-modal-title">
              {editingExpense
                ? "Edit Expense"
                : "Add Expense"}
            </h2>

            <p>
              {editingExpense
                ? "Update your expense details"
                : "Enter your expense details"}
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={handleClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="expenseTitle">
              Expense Title
            </label>

            <input
              id="expenseTitle"
              type="text"
              name="title"
              placeholder="Enter expense title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="expensePrice">
              Amount
            </label>

            <input
              id="expensePrice"
              type="number"
              name="price"
              placeholder="Enter amount"
              min="1"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="expenseCategory">
              Category
            </label>

            <select
              id="expenseCategory"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">
                Select category
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Travel">
                Travel
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Bills">
                Bills
              </option>

              <option value="Health">
                Health
              </option>

              <option value="Education">
                Education
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="expenseDate">
              Date
            </label>

            <input
              id="expenseDate"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="modal-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
            >
              {editingExpense
                ? "Update Expense"
                : "Add Expense"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default ExpenseModal;