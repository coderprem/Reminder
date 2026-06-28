import React from 'react';
import { useWindowDimensions, StyleProp, TextStyle } from 'react-native';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';

type Props = {
  html: string;
  baseStyle?: StyleProp<TextStyle>;
  tagsStyles?: Record<string, MixedStyleDeclaration>;
};

const AppHtml: React.FC<Props> = ({ html, baseStyle, tagsStyles }) => {
  const { width } = useWindowDimensions();
  const cleanHtml = html.replace(/<script.*?>.*?<\/script>/gi, '');

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: cleanHtml }}
      baseStyle={baseStyle as MixedStyleDeclaration}
      tagsStyles={tagsStyles}
    />
  );
};

export default AppHtml;