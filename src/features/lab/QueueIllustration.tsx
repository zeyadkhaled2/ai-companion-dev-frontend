import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text } from 'react-native-svg';

export default function QueueIllustration() {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="A printer beside three numbered papers. Paper one is closest to the printer, followed by two and three."
      style={{
        width: '100%',
        aspectRatio: 2,
        borderRadius: 22,
        overflow: 'hidden',
        marginBottom: 18,
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 360 180">
        <Rect width={360} height={180} fill="#123D35" />
        <Circle cx={65} cy={85} r={56} fill="#20564A" />
        <Path d="M18 137H341" stroke="#417064" strokeWidth={2} strokeDasharray="5 7" />
        <Rect x={41} y={41} width={45} height={38} rx={5} fill="#F8F4DE" />
        <Path d="M50 52H76M50 60H70" stroke="#8DA79C" strokeWidth={3} strokeLinecap="round" />
        <Rect x={24} y={70} width={79} height={49} rx={12} fill="#B7DACA" />
        <Rect x={37} y={98} width={53} height={8} rx={4} fill="#143E36" />
        <Circle cx={87} cy={84} r={4} fill="#1A6655" />
        <Path d="M42 104H85V131H42Z" fill="#F8F4DE" />
        <Path d="M50 113H77M50 121H72" stroke="#8DA79C" strokeWidth={3} strokeLinecap="round" />
        {[128, 207, 286].map((x, index) => (
          <G key={x} transform={`translate(${x} 0)`}>
            <Rect x={3} y={66} width={52} height={60} rx={8} fill="#0E302A" />
            <Rect y={61} width={52} height={60} rx={8} fill={index === 0 ? '#FFDB8A' : '#D5E9DB'} />
            <Path d="M11 78H41M11 85H36" stroke="#527269" strokeWidth={3} strokeLinecap="round" />
            <Circle cx={26} cy={102} r={10} fill="#164D41" />
            <Text x={26} y={106} textAnchor="middle" fill="#FFFFFF" fontSize={12} fontWeight="700">
              {index + 1}
            </Text>
          </G>
        ))}
        <Path
          d="M120 93H108M108 93L113 88M108 93L113 98M201 93H186M186 93L191 88M186 93L191 98M280 93H265M265 93L270 88M265 93L270 98"
          fill="none"
          stroke="#FFDB8A"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Text x={154} y={155} textAnchor="middle" fill="#FFDB8A" fontSize={11} fontWeight="700">
          FIRST
        </Text>
        <Text x={312} y={155} textAnchor="middle" fill="#D5E9DB" fontSize={11} fontWeight="700">
          LAST
        </Text>
      </Svg>
    </View>
  );
}
