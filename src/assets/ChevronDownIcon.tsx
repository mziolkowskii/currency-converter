import { theme } from '@styles/theme';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from './types';

export const ChevronDownIcon = ({ size = 24, color = theme.colors.primary, ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <G clipPath="url(#clip0_288_37604)">
      <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </G>
    <Defs>
      <ClipPath id="clip0_288_37604">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
