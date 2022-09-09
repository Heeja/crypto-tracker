import {
  Routes,
  Route,
  useParams,
  useLocation,
  useMatch,
  Link,
  NavLink,
} from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

import { Helmet } from "react-helmet";

import Price from "./Price";
import Chart from "./Chart";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const PrtNavLink = styled(NavLink)`
  color: #ffdda6;
  background-color: #8c8cff;
  border-radius: 5px;
  padding: 6px;
  position: absolute;
  right: 30px !important;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 580px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const ColorBox = styled.div`
  background-color: #40693a;
  border-radius: 12px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fffea6;
`;

const BoxItem = styled.div`
  background-color: #40693a;
  border-radius: 12px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  jusify-content: center;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.div`
  margin: 20px auto;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin 25px; 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: #40693a;
  border-radius: 12px;
  padding: 10px 20px;
  color: ${(props) => (props.isActive ? "#FFFEA6" : "white")};
  a {
    display: block;
  }
`;

interface RouteParams {
  coinId: string;
}
interface RouteState {
  state: string;
}

interface InfoTag {
  id: string;
  name: string;
  coin_counter: number;
  ico_counter: number;
}

interface InfoTeam {
  id: string;
  name: string;
  position: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  tags: InfoTag[];
  team: InfoTeam[];
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  links: object;
  links_extended: object;
  whitepaper: object;
  first_data_at: string;
  last_data_at: string;
}
interface PriceData {
  beta_value: number;
  circulating_supply: number;
  first_data_at: string;
  id: string;
  last_updated: string;
  max_supply: number;
  name: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
  rank: number;
  symbol: string;
  total_supply: number;
}

interface ICoinProps {}

function Coin() {
  const { coinId } = useParams() as unknown as RouteParams;
  const priceMatch = useMatch(`/:coinId/price`);
  const chartMatch = useMatch(`/:coinId/chart`);

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 2000,
    }
  );

  // const [loading, setLoading] = useState(true);
  // const [price, setPrice] = useState<PriceData>();
  // const [info, setInfo] = useState<InfoData>();
  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //     ).json();
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //     ).json();
  //     setInfo(infoData);
  //     setPrice(priceData);
  //     setLoading(false);
  //   })();
  // }, [coinId]);

  const loading = infoLoading || tickersLoading;

  const setDartAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDartAtom((prev) => !prev);
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <Container>
      <Helmet>
        <title>코인</title>
        {/* <title>{state ? state : loading ? "Loading..." : infoData?.name}</title> */}
      </Helmet>
      <Header>
        <Title>Coin</Title>
        <button onClick={toggleDarkAtom}>
          {isDark ? "Dark Mode" : "Light Mode"}
        </button>
        <PrtNavLink to="/"> Home </PrtNavLink>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <ColorBox>
            <BoxItem>
              <span>rank:</span>
              <span>{infoData?.rank}</span>
            </BoxItem>
            <BoxItem>
              <span>symbol:</span>
              <span>{infoData?.symbol}</span>
            </BoxItem>
            <BoxItem>
              <span>open source:</span>
              <span>{tickersData?.quotes.USD.price.toFixed(5)}</span>
            </BoxItem>
          </ColorBox>
          <Description>
            <p>{infoData?.description}</p>
          </Description>
          <ColorBox>
            <BoxItem>
              <span>total:</span>
              <span>{tickersData?.total_supply}</span>
            </BoxItem>
            <BoxItem>
              <span>max-supply:</span>
              <span>{tickersData?.max_supply}</span>
            </BoxItem>
          </ColorBox>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to="chart">Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to="price">Price</Link>
            </Tab>
          </Tabs>

          <Routes>
            <Route
              path="price"
              element={<Price coinId={coinId} symbol={infoData?.symbol} />}
            />
            <Route
              path="chart"
              element={<Chart coinId={coinId} symbol={infoData?.symbol} />}
            />
            <Route path="coins" />
          </Routes>
        </>
      )}
    </Container>
  );
}

export default Coin;
