import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ExpenseSummary({ expenses }) {
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
  ).map(([name, value]) => ({
    name,
    value,
  }));

  if (chartData.length === 0) {
    return (
      <div className="no-chart-data">
        <p>No expense data available</p>
        <span>
          Add expenses to see your summary.
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
        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={50}
            paddingAngle={3}
            label
          >
            {chartData.map(
              (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                />
              )
            )}
          </Pie>

          <Tooltip
            formatter={(value) =>
              `₹${Number(value).toFixed(2)}`
            }
          />

          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ExpenseSummary;