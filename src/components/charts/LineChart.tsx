import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";

interface ChartPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: ChartPoint[];
  hideValues?: boolean;
  accessibilityLabel: string;
}

const HEIGHT = 190;
const PADDING = { top: 18, right: 14, bottom: 30, left: 58 };
const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function LineChart({
  data,
  hideValues = false,
  accessibilityLabel,
}: LineChartProps) {
  const [width, setWidth] = useState(320);
  const chart = useMemo(() => {
    const values = data.map(({ value }) => value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const spread = rawMax - rawMin || Math.max(Math.abs(rawMax) * 0.1, 1);
    const min = rawMin - spread * 0.08;
    const max = rawMax + spread * 0.08;
    const innerWidth = Math.max(width - PADDING.left - PADDING.right, 1);
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const points = data.map(({ value }, index) => ({
      x:
        data.length === 1
          ? PADDING.left + innerWidth / 2
          : PADDING.left + (index / (data.length - 1)) * innerWidth,
      y: PADDING.top + ((max - value) / (max - min)) * innerHeight,
    }));
    return { min, max, innerHeight, points };
  }, [data, width]);

  const visibleLabels = new Set(
    data.length <= 4
      ? data.map((_, index) => index)
      : [0, Math.floor((data.length - 1) / 2), data.length - 1],
  );

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={styles.container}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <Svg width={width} height={HEIGHT}>
        {[0, 0.5, 1].map((position) => {
          const y = PADDING.top + position * chart.innerHeight;
          return (
            <Line
              key={position}
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={y}
              y2={y}
              stroke="#dfe5e1"
              strokeWidth={1}
            />
          );
        })}
        {!hideValues ? (
          <>
            <SvgText x={PADDING.left - 7} y={PADDING.top + 4} textAnchor="end" fontSize={10} fill="#69756f">
              {compactCurrency.format(chart.max)}
            </SvgText>
            <SvgText x={PADDING.left - 7} y={HEIGHT - PADDING.bottom + 4} textAnchor="end" fontSize={10} fill="#69756f">
              {compactCurrency.format(chart.min)}
            </SvgText>
          </>
        ) : null}
        <Polyline
          points={chart.points.map(({ x, y }) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="#28735b"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
        {chart.points.map(({ x, y }, index) => (
          <Circle key={`${data[index].label}-${index}`} cx={x} cy={y} r={4} fill="#f7f8f4" stroke="#28735b" strokeWidth={2.5} />
        ))}
        {chart.points.map(({ x }, index) =>
          visibleLabels.has(index) ? (
            <SvgText key={data[index].label} x={x} y={HEIGHT - 8} textAnchor="middle" fontSize={10} fill="#69756f">
              {data[index].label}
            </SvgText>
          ) : null,
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({ container: { marginHorizontal: -6, overflow: "hidden" } });
