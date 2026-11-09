import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text } from 'react-native-svg';
import { exampleFolder, sumNumbers } from './recursionTrace';

const ink = '#123D35';
const mint = '#D5E9DB';
const gold = '#FFDB8A';
const labels = {
  factorial: 'Three call cards stacked with factorial one on top, then factorial two and three.',
  sum: 'Three glass jars holding two, four, and three gold coins.',
  folders: 'Projects branches to Art and Music. Sketches is inside Art.',
};

export default function RecursionIllustration({ kind }: { kind: keyof typeof labels }) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={labels[kind]}
      style={{ width: '100%', aspectRatio: 2, borderRadius: 22, overflow: 'hidden' }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 360 180">
        <Rect width={360} height={180} fill={ink} />
        <Circle cx={180} cy={90} r={76} fill="#20564A" />
        {kind === 'factorial' && <CallCards />}
        {kind === 'sum' && <CoinJars />}
        {kind === 'folders' && <FolderTree />}
      </Svg>
    </View>
  );
}

function CallCards() {
  return (
    <>
      {[3, 2, 1].map((n) => {
        const y = 27 + (n - 1) * 44;
        return (
          <G key={n}>
            <Rect x={100} y={y + 4} width={164} height={35} rx={9} fill="#0E302A" />
            <Rect x={96} y={y} width={164} height={35} rx={9} fill={n === 1 ? gold : mint} />
            <Circle cx={114} cy={y + 17.5} r={4} fill="#397566" />
            <Text x={178} y={y + 22} textAnchor="middle" fill={ink} fontSize={14} fontWeight="700">
              {`factorial(${n})`}
            </Text>
          </G>
        );
      })}
      <Path
        d="M68 132V49M68 49L62 57M68 49L74 57"
        fill="none"
        stroke={gold}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Text x={290} y={49} fill={gold} fontSize={12} fontWeight="700">
        TOP
      </Text>
    </>
  );
}

function CoinJars() {
  return (
    <>
      {sumNumbers.map((count, index) => (
        <G key={index} transform={`translate(${37 + index * 103} 0)`}>
          <Rect
            x={6}
            y={49}
            width={68}
            height={90}
            rx={15}
            fill="#286153"
            stroke="#96BEAE"
            strokeWidth={2}
          />
          <Rect x={12} y={36} width={56} height={17} rx={5} fill={mint} />
          {Array.from({ length: count }, (_, i) => (
            <Circle
              key={i}
              cx={27 + (i % 2) * 26}
              cy={117 - Math.floor(i / 2) * 25}
              r={10}
              fill={gold}
              stroke="#C58938"
              strokeWidth={2}
            />
          ))}
        </G>
      ))}
      {sumNumbers.map((count, index) => {
        const center = 77 + index * 103;
        return (
          <G key={center}>
            <Circle cx={center} cy={157} r={13} fill={mint} />
            <Text x={center} y={162} textAnchor="middle" fill={ink} fontSize={14} fontWeight="700">
              {String(count)}
            </Text>
          </G>
        );
      })}
    </>
  );
}

function FolderTree() {
  const [art, music] = exampleFolder.children;
  const positions = [
    { folder: exampleFolder, x: 180, y: 12 },
    { folder: art, x: 94, y: 69 },
    { folder: music, x: 266, y: 69 },
    { folder: art.children[0], x: 94, y: 126 },
  ];
  return (
    <>
      <Path
        d="M180 46V58H94V72M180 58H266V72M94 105V129"
        fill="none"
        stroke="#96BEAE"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {positions.map(({ folder, x, y }, index) => (
        <G key={folder.name} transform={`translate(${x - 48} ${y})`}>
          <Path
            d="M1 9V4Q1 1 5 1H29L38 9H91Q95 9 95 13V35Q95 39 91 39H5Q1 39 1 35Z"
            fill={index === 0 ? gold : mint}
          />
          <Text x={48} y={28} textAnchor="middle" fill={ink} fontSize={13} fontWeight="700">
            {folder.name}
          </Text>
        </G>
      ))}
    </>
  );
}
