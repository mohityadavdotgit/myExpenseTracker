import { useState } from "react";
import { FaTimes, FaWallet } from "react-icons/fa";

function AddBalanceModal({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!amount || Number(amount) <= 0) {
      return;
    }

    onSubmit(amount);

    setAmount("");
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="balance-modal-title"
      >
        <div className="modal-header">
          <div>
            <div className="modal-icon">
              <FaWallet />
            </div>

            <h2 id="balance-modal-title">
              Add Balance
            </h2>

            <p>
              Add money to your wallet
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

          <div className="form-group">
            <label htmlFor="incomeAmount">
              Income Amount
            </label>

            <input
              id="incomeAmount"
              type="number"
              placeholder="Income Amount"
              value={amount}
              min="1"
              step="0.01"
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </div>

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
              Add Balance
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddBalanceModal;