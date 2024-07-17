"use client";

import { CategoryCount } from "@/db/queries/orders";
import { formatLargeCurrency } from "@/lib/helpers";
import { PiChartPieSliceLight } from "react-icons/pi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmptyItemList from "../admin/EmptyItemList";

interface SalesChartProps {
  data: CategoryCount[];
}

export default function SalesChart({ data }: SalesChartProps) {
  if (!data.length)
    return (
      <EmptyItemList
        icon={<PiChartPieSliceLight />}
        message="No data can be shown right now"
      />
    );

  const chartData = data.sort((a, b) => a.category.localeCompare(b.category));

  return (
    <div className="overflow-x-auto pb-2">
      <div style={{ minWidth: data.length * 100 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" tick={<CustomAxisTick />} />
            <YAxis tickFormatter={formatLargeCurrency} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Bar
              dataKey="amount"
              barSize={30}
              fill="#fcd34d"
              label="category"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const categoryImageMap: { [key: string]: string } = {
  "Men's Fashion":
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEVUlEQVR4nO1ZW6hVRRjeJ9EsKy8JXaCifMnEkDJ6MV8qexKU2oS1adda833j2ruNHaWCfDj6IlQUhWERvgQZ9lJIhNrpoQ5FJ44gqEEkXh6UHgot0ux4OTt+m4Xjap9Zs2btYyfYPwwsZv3z/d8313/NqlR61rPJYfV6fXqSJHf5FPGtTBLrU0o9RPJ9kidJtj3LSdNmiWD8J8ylF0kesIkBGCE56CrGx25zKI7jmyacMMm5JJskv9NaP2rqWpmebeXhAHg+I+BdgzWP5FcSo9ls3tgt0lMBPE5yB8lRK/DRKIquHxgYuMoETesHPQR8YZE/kuIA+NrCkVg7TOypwQKUUisd8/g943MngD9M3dkkSWY7OmSm1RFjJJcZUWsccVYECyC52QE8ppS63/i9mdZrrVc58J60en+n1Ml0IXnKEWdzsAAAPziAf5HhN9PskEVsu0PANqv9mSiKbjVxvnfEORBEnuQtZpidPWO2Ubv+t2q1Oq0Dngg9YfsqpZ4171a7Rlq4FBaglHratZcD+D1JktsMgV2Z98s6CHg44zNUrVan1Ov1WSQP55wbTxUWAGBr3oEE4HPxjaLoDmshS/07HQS8Zb0/IW0qlUofyU884mwtLMCjVy7rHZIvWAGPZU/YDN6KbBu6y9FC5CVf8QQWsr/KSWrOhG+td/dZ5Bdm1w7JxZmzxVlkuy7S+8oX2N55SN4N4C9TtyHFA7De1O3v7++/Rua9vXPRo2itY28BAD4qAm56aKURsdHU7bXwZJs8Fcfx/FB8ktt8+fcB+DkgwHHp2VardbWcHwDOydbZaDRuBnCB5HNGYDMAuy2cvDJXpdSCkAD2bkHyQZLD5lnsY3mO4/heAH+G4mut78kV0CHDLFLGADySkjXT5Y1Wq3WDFJIHS2C3fbJdEfBpySCHa7XaDAtvnhGyvSRuW7g5ycvJmD3uA8vbNi4A3QXMtnzJCUdX7y/uRiCzaGemU0kSty4JaAN4YFwBAF7qViD5gjOYP3YRs03yZdcI7O62gC6Tb0viON78n5bzYTFZBJyWs+ZfAjrk9ePN7RABp+Vz06cd/GIs7TR9BjwaDgcIkA+S2yWoZ7thD5EbOgkYymkkSdqmwBFYS/J1z3ab0oTQUYay5K/1aDSYZpUBArwLgPUAvszxG7UPS5n/j3mAr71SAkiuy/MTzvYIvJrXQFLhEgL2ySWWr4A4jud7+L1mH2AjOc5HjF+IgLE4jucopRb5Cqj8EytP8J6L5OUmjeT5HOctJQQIqQ/kAqCIAJJbcnzPX7wFNGnuiwC+cezBy8sIKFJwScDycd5fEK7CWbhnd6O5WutnSH5m7UqjjUbjuistoFarzbA4nDG74Jr0Ni/XzMjIXeYr1loJFfCh+T/gLUBMEjet9RNpB5a2EAEy5PIzpOginhArsYhHAPz0vxXAgDUwIdYTwN4IlDO5efP9mZ3eHvj6J5d+gs8qSbNnPasUsL8BFnUcHQplOsEAAAAASUVORK5CYII=",
  "Women's Fashion":
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAACKElEQVR4nO2Wu2sUURTGB0HxhVgEBJF0vtDWJ1gHC1GEhRgWBnbu991hZcUlWGlY0pjOGDHEKmhhsIrBf2MjWlgoaWzyDyS+0ETl0zM6LGbJ3BmtPHDgznn9zpm7985G0X/ZQEieAvDIOXeu1yebfIqJqpI4jre3Wq09JO+S/AbgWafT2ZL5tZZNPsUoVjmlwSRvee+vkHRWXPq02WzulmqdszvFArhZCuqcO0DyHcnH3vuTOYD0NsmJvA3ACQBzJN+THCwz7UMr+qper+8CsJ4DfTTNoOuKUaw9zwZBkyQ5SnJNRZxzQ9bIUs/UeV2ytzRkz8o9EjLtAyswn7PN9wH/igOwYFPPFAYDeGkFR3Pg8T7g8VzcqNlehEx82bp+TXKrNXMewKdeqGzyKaZWq20j+YbkV5KXCoMlJKfyU6dpepjkgHPuGMkzUlsPyGc5N6yZyShUaj+7XyS50mg09pNctqKrehOmq9bcssWsAOgqNyojzrlDAD7oLAN4stEey5edYe/9wagKATCjPdMkfcBd29fpqCoh2enza+7VscrAAO5vFgzgXpXg2QLgsKvyT0LyeQFwN6pC4jjem93Zm9Q15ZQGe+8vFoBmeqE0GMBkAPjOP91f/tbFstCdAL4EgD+32+0dwWAAZwOgP9Q5d7rMxCOhYADDZcDXQ8EkrwWD0zQ9rkuf5NsCQMVOKzeqQpIk2Wd/5K7qQ6BjZkdtTDb5FFMJ7G/Kd3jV5ArqQ1dnAAAAAElFTkSuQmCC",
  Watches:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAACeklEQVR4nL2Wu2sVURDGTxAtfPwDFoovUMFKQUstNGLURtYqKe7u+X7n7i3UwsJSUERQLLRIxNJnocm/YKVgpYXplCiYpIi1pTLes2Rdbh67d+MHA2dn5uy3e3b2m3FunQA2t5FTG5JeAMdXilvMclzbAGZCCCeBg865kVJoxHwxNrORxHfSNN1R+G1tvo0gHgGO2E0l3QSSQRZjM5ZbOZFmCCEcAD5ImpD0eA2bsFzbMzQxMAa8LK57vd524Kyk1Mx7P2q+Ii7pVQjh3NDEkq5KupVl2X6rWkkLwGvgQTRbLwLPgX2WC1wZmhh45L2fAr7Rx99/VdJ1M1snSbJFUpD0PYQwaXvaIP4k6Quwq+yXdBG4UPalabob+Crp41CkWf94l+K/uyrSNN2ZJMmmLMsOSfqZ5/neYdWKtfK89yfsmI3croEu8KwRadoXhsWq/gLH7JuWSI8Cc0Ze+OI3XxgfH99Wm9h7P2oVW/VLuivpnb3dINJS3mfgF3CqFjHggXvADe/9+UrM8MPeqkpqubbHHg74DTypRRxCyID7g4hj/HK3271U9RfEwPtGxN77UUlvXEMAs3bU1jxqbTQZjCpVu7lbcVlhNioug8mgKZKrCUk9SU9dU9DX3iUThfXu6XQ6h01AvPd7GhMXkmkyaHLo/pdkGkzwo/Bbk+gW4lFtEkBu6iVpUtJD11ZbzPN8r8lgVLPpUluctiK0b2rHC9xuqy2OlQcBq1TgDNAxCyGcLldva4NAiKMPMCVpdjWznNZGH7c87M1779+Wjvgfi7H51oa9AvGm11Yab2Ns3rUNlokHDvQbRixpzqbKVeI2dc61TgxsbSOnwB8ln7JoGOGr8AAAAABJRU5ErkJggg==",
  Jewelry:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAADj0lEQVR4nM2WWYhcVRCGbzQaSYKKQVxBcQluIKIP7gi++OTeD0pDM33P/52eOzZub1HsBxGN5snlRVBQUKMoREWURDQuyIAaIa4RFHE0xogmKu5o5E/OlZM2M9PdzoA/HOiue6rq1Kk6f1VR/F9RluVBIYTTh1nW+U9Ox8bGDgY+AHYMsyS9OzExsWwkp61W60DgnWRsrJZXVbUUmAReTWvSsvq79yadt4ADhnJaVdVSSW8Am2wkxniS5d1ud5GktcDbNuolaQOwzt+8x3tT1B9Jer3ZbC4ZyGmj0dgXeAHYCFwNbO/1ens1Go29gcclfVyW5SF96fhQ0pper7ewKIoFwDag4QNKerHVau03o1NgH+BZGwcOk3SLI0zG7gem2u32Uf16IYQjgc+Ah7033crNPpSk9yU974Cmi9QRPSbp89q4pOck3QqsBLaWZXnidIeOMR4PbJF0t3UkPZPkRwCfAk+mG9kNPuWDwJfAsbUM+AZY7+vudDqnzXhdu27sDEnfA6/5ELV8fHz8mGT7AdvNFVbZSQjh5FpWluVxqUh+Bs6fzWkW+QXAL9bN0xJCWO7DAPfUTlek8t+cnsDOlfJs+be5fJAl6buku6nv2+YkX+E8ng387qokg6Trgb8k3cmQsI6kPyVd2ydfA/xmn3XUXUk/1u+1hqtR0r2DXnOWuvuAp3NZCGG58y/pmt02S3rIj77b7e6fGbgI+GkY7jXjOQjgwj62e0/So/9SMMOYYyWtzsQLElffMES0N9pJXr1+37Y9LYult7jduallkiqTg9/5bE69R9Inzmfm9Drgh5k4oHZ0sQsghHBeUlycKvvS2RyHEC5zRdeRhRDOlPSrpCtm061PeZekr9rt9uHp/ypJLw+gt17SHf5tPpf0BXD7QE6zK1trZ6Y5E4GkP2KMp06n0+l0Tkl7jq71gZf2RJMzIjvxSv+X9FSivD0iUe4T6bff/pSbRDEKQspRjPFK06Z/5y2xrzWaJs+tayTGeM5ITmsk9tlZlZLelHRT0Qe3QA8E2auoirkA6R0CE+4yeW9NPXxKUkzTyCPFXKHZbC5JzOM8b4kxXpU59pSy1cSTppbFc+bYAE7wlUv62gNeJp9Msm1upcV8IMZ4iTuWW5sLDzgrtTnLLi/mE+waGnakMWl1GhZuK+YbvV5voaRX3MPTWjcIjxdzgaqqDvU04cFwZJIYFZ4i/pkkRsDf/7iE4wZsh+MAAAAASUVORK5CYII=",
  Sunglasses:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAACqUlEQVR4nO1VO2gUURR9UeIXFX/YiBaihYKFIIKkFdHEv4OFgbAz75xHWAezNvEXF8FC0tipkEKwEwsNqJWFH1DxA+IHiSB2wYhojESNGleu3gmPdbM7m8QUkguX2Z33zpz77uc8YyasCmtubp5rrV1MstaMFyGApyQL4gA+k+wEsPafEsdxPJXkUZLWObcNwCEArwAMAsiZ8TSStSRPSwastXvHldwYU0PyAslekkvG/OvOueUAQgD7Se4Jw3BpshZF0TyS3QCuSyBjQkhyHcn7XlN9TH475zZ4++p1fd9oOWsAHNPmeUBySy6Xm56cEMAmkjOKguwg2S/ZGRFjHMezdVQGSeaDIJicBheG4SwArwHcSYsZMmvtCgDPSfZZa3dUGzTJOg34YDWkDdqdXc65lWaEBuAUyYEoilanGYlWjfQKyTlmFNbU1DSN5DMAj4MgmFKunpdI/gRwMp/PTzJjYCTXkPxG8sRfi9baVQBe6hh81TQnIyMRn5Galfl4nXSy9IRot3qPanqHzDWA7zKSQyAAuwB80pns1+cAyePe/8TPAVhPMiMiooRnda2b5HkAR0i26eVRKPIXv0eRZIukVl+2iuZqJ/c65zZL1CXAxS74A0lp9KqU9L4ptR9Au5zWaTpv6+nbvUCG83uZTGYhyQWCU3mUQxwm+bYCtk+kNqnPXamDdvSXFCd84tX2IYCb3sxWwj7ya3xRwF4QZcEArnrEnSnICh72sk/stN2XOed2p/hAi0ccV0NMMjtE3NjYOFM78po2WLmI3/miIpqcoq4FxfbI/uI53kjyR4ru3V5CAxoq1Rd/1utLigCArQDeDwOUzg/KCMjORHRK+IeKl0w2m52vAnBDLgiSt+Q6jKJoUVmgMUZHrE27vEufbfK+EnbC/j/7BSKFrWwxYFOsAAAAAElFTkSuQmCC",
};

const CustomAxisTick = ({ x, y, payload }: any) => {
  const imageUrl = categoryImageMap[payload.value];
  return (
    <g transform={`translate(${x - 15},${y})`}>
      <image
        className="text-[#666]"
        href={imageUrl}
        x={0}
        y={0}
        width={30}
        height={30}
        fill="#666"
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  );
};
