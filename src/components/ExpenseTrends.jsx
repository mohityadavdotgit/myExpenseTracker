import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ExpenseTrends({ expenses }) {
  const categoryTotals = expenses.reduce(
    (accumulator, expense) => {
      const category = expense.category;
      const price = Number(expense.price);

      accumulator[category] =
        (accumulator[category] || 0) + price;

      return accumulator;
    },
    {}
  );

  const chartData = Object.entries(
    categoryTotals
  ).map(([category, amount]) => ({
    category,
    amount,
  }));

  if (chartData.length === 0) {
    return (
      <div className="no-chart-data">
        <p>No expense data available</p>
        <span>
          Add expenses to see your trends.
        </span>
      </div>
    );
  }

  return (
    <div className="chart-container">

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
          />

          <YAxis />

          <Tooltip
            formatter={(value) =>
              `₹${Number(value).toFixed(2)}`
            }
          />

          <Bar
            dataKey="amount"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ExpenseTrends;