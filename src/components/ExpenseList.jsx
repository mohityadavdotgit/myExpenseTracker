import {
  FaEdit,
  FaTrash,
  FaReceipt,
} from "react-icons/fa";

function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FaReceipt />
        </div>

        <h3>No expenses yet</h3>

        <p>
          Start tracking your spending by adding
          your first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="expense-list">

      {expenses.map((expense) => (
        <div
          className="expense-item"
          key={expense.id}
        >

          <div className="expense-item-left">

            <div className="expense-item-icon">
              <FaReceipt />
            </div>

            <div className="expense-details">

              <h3>
                {expense.title}
              </h3>

              <div className="expense-meta">

                <span className="category-badge">
                  {expense.category}
                </span>

                <span>
                  {expense.date}
                </span>

              </div>

            </div>

          </div>

          <div className="expense-item-right">

            <strong className="expense-price">
              -₹{Number(expense.price).toFixed(2)}
            </strong>

            <div className="expense-actions">

              <button
                type="button"
                className="edit-button"
                onClick={() => onEdit(expense)}
                aria-label={`Edit ${expense.title}`}
              >
                <FaEdit />
              </button>

              <button
                type="button"
                className="delete-button"
                onClick={() => {
                  const confirmed =
                    window.confirm(
                      "Are you sure you want to delete this expense?"
                    );

                  if (confirmed) {
                    onDelete(expense.id);
                  }
                }}
                aria-label={`Delete ${expense.title}`}
              >
                <FaTrash />
              </button>

            </div>

          </div>

        </div>
      ))}

    </div>
  );
}

export default ExpenseList;