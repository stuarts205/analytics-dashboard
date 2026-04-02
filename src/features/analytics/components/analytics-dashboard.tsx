"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { analytics } from "@/utils/analytics";
import ReactCountryFlag from "react-country-flag";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

interface AnalyticsDashboardProps {
  avgVisitorsPerDay: string;
  amtVisitorsToday: number;
  timeseriesPageViews: Awaited<ReturnType<typeof analytics.retrieveDays>>;
  topCountries: [string, number][];
}

const Badge = ({ percentage }: { percentage: number }) => {
  const isPositive = percentage > 0;
  const isNeutral = percentage === 0;
  const isNegative = percentage < 0;

  if (isNaN(percentage)) return null;

  const positiveClassname = "bg-white text-green-400 ring-green-400/25";
  const neutralClassname = "bg-white text-zinc-400 ring-zinc-400/25";
  const negativeClassname = "bg-white text-red-400 ring-red-400/25";

  return (
    <span
      className={`inline-flex gap-1 items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        isPositive
          ? positiveClassname
          : isNeutral
            ? neutralClassname
            : negativeClassname
      }`}
    >
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : null}
      {isNeutral ? <ArrowRight className="h-3 w-3" /> : null}
      {isNegative ? <ArrowDownRight className="h-3 w-3" /> : null}
      {percentage.toFixed(0)}%
    </span>
  );
};

export const AnalyticsDashboard = ({
  avgVisitorsPerDay,
  amtVisitorsToday,
  timeseriesPageViews,
  topCountries,
}: AnalyticsDashboardProps) => {
  console.log(timeseriesPageViews);

  const chartData = timeseriesPageViews.map((d) => ({
    date: d.date,
    views: d.events.length,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Avg. visitors/day</CardTitle>
          </CardHeader>
          <CardContent>{avgVisitorsPerDay}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <p className="flex items-center gap-2.5">
                Visitors today
                <Badge
                  percentage={amtVisitorsToday / Number(avgVisitorsPerDay) - 1}
                />
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>{amtVisitorsToday}</CardContent>
        </Card>
      </div>

      <Card className="flex flex-col sm:grid grid-cols-4 gap-6">
        <h2 className="w-full text-center sm:text-left font-semibold text-xl p-4">
          This weeks top visitors:
        </h2>
        <div className="col-span-3 flex items-center justify-between flex-wrap gap-8">
          {topCountries?.map(([countryCode, number]) => {
            return (
              <div className="flex items-center gap-3">
                <p className="hidden sm:block">{countryCode}</p>
                <ReactCountryFlag
                  className="text-5xl sm:text-3xl"
                  svg
                  countryCode={countryCode}
                />
                <p className="text-xl font-semibold">{number} visits</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Page Views</CardTitle>
        </CardHeader>
        <CardContent className="h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Bar dataKey="views" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
