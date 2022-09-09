import { useQuery } from "@tanstack/react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom, IHistorical } from "../atoms";

interface ChartProps {
  coinId: string;
  symbol?: string;
}

function Chart({ coinId, symbol }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);

  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  const songilData = data ?? [];
  const usingData = songilData?.map((price) => {
    return {
      x: price.time_close,
      y: [price.open, price.high, price.low, price.close],
    };
  });

  console.log(data);

  return (
    <>
      {isLoading ? (
        "Loading Chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: usingData,
              // 외부데이터로 가져왔을때 에러가 없었다.
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            title: {
              text: `${symbol} Candle Chart`,
              align: "left",
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: { show: false },
              background: "transparent",
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              type: "datetime",
              categories: data?.map((price) => price.time_close),
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#41A848"], stops: [0, 100] },
            },
            colors: ["#BB40DB"],
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(5)}`,
              },
            },
          }}
        />
      )}
    </>
  );
}

export default Chart;
