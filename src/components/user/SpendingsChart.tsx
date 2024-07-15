"use client";

import { CategoryCount } from "@/db/queries/orders";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import EmptyItemList from "../admin/EmptyItemList";
import { PiChartPieSliceLight } from "react-icons/pi";

interface SpendingsChartProps {
  data: CategoryCount[];
}

interface CategoryWithColor {
  category: string;
  amount: number;
  color: string;
}

const initialCategoryData: CategoryWithColor[] = [
  {
    category: "Women's Fashion",
    amount: 0,
    color: "#ef4444",
  },
  {
    category: "Sunglasses",
    amount: 0,
    color: "#eab308",
  },
  {
    category: "Watches",
    amount: 0,
    color: "#22c55e",
  },
  {
    category: "Men's Fashion",
    amount: 0,
    color: "#3b82f6",
  },
  {
    category: "Jewelry",
    amount: 0,
    color: "#a855f7",
  },
];

function mapCategoriesWithColors(
  initialData: CategoryWithColor[],
  realData: CategoryCount[]
): CategoryWithColor[] {
  const categoryColorMap: { [key: string]: string } = initialData.reduce(
    (acc, category) => {
      acc[category.category] = category.color;
      return acc;
    },
    {} as { [key: string]: string }
  );

  return realData
    .map((item) => ({
      category: item.category,
      amount: item.amount,
      color: categoryColorMap[item.category] || "#000000",
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

export default function SpendingsChart({ data }: SpendingsChartProps) {
  if (!data.length)
    return (
      <EmptyItemList
        icon={<PiChartPieSliceLight />}
        message="No data can be shown right now"
      />
    );

  const chartData = mapCategoriesWithColors(initialCategoryData, data);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          nameKey="category"
          dataKey="amount"
          innerRadius={80}
          outerRadius={110}
          cx="50%"
          cy="45%"
          paddingAngle={3}
        >
          {chartData.map((entry) => (
            <Cell
              fill={entry.color}
              stroke={entry.color}
              key={entry.category}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          align="left"
          // @ts-ignore
          width="100%"
          layout="horizontal"
          iconSize={15}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
