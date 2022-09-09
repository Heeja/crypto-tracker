import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";
import { isDarkAtom, IHistorical } from "../atoms";

interface ChartProps {
  coinId: string;
  symbol?: string;
}

const PrcieH2 = styled.h2`
  text-align: center;
  margin: 20px auto;
  font-size: 18px;
`;

const PrcieBlock = styled.div`
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
`;

const PriceList = styled.li`
  max-width: 60vw;
  padding: 6px;
  margin: 3px 5px;
  border-radius: 3px;
`;

const PrcieSpan = styled.span`
  margin: auto 3px;
`;

function Price({ coinId, symbol }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  console.log(data);

  const cyptoPriceList = data?.map((price) => {
    const priceDate = new Date(price.time_close);
    const viewDate = `${priceDate.getFullYear()}년 ${priceDate.getMonth()}월 ${priceDate.getDate()}일`;

    console.log(priceDate);
    return (
      <>
        <PrcieBlock>
          <PriceList>
            <PrcieSpan>{viewDate}</PrcieSpan>
            <PrcieSpan>
              {price.close} {symbol}
            </PrcieSpan>
          </PriceList>
        </PrcieBlock>
      </>
    );
  });

  return (
    <>
      {isLoading ? (
        "Loading Chart..."
      ) : (
        <>
          <PrcieH2>{symbol} Price</PrcieH2>
          <ul>{cyptoPriceList}</ul>
        </>
      )}
    </>
  );
}

export default Price;
