import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import type { Edge, EdgeMode, EdgeRecord } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const defaultEdges: Record<Edge, EdgeMode> = {
  top: 'additive',
  left: 'additive',
  bottom: 'additive',
  right: 'additive',
};

export type Edges = readonly Edge[] | Readonly<EdgeRecord>;

export interface AppSafeAreaViewProps extends ViewProps {
  children?: React.ReactNode;
  mode?: 'padding' | 'margin';
  edges?: Edges;
}

const AppSafeAreaView = React.forwardRef<View, AppSafeAreaViewProps>(
  ({ edges, mode = 'padding', style, children, ...props }, ref) => {
    const insets = useSafeAreaInsets();

    const nativeEdges = useMemo(() => {
      if (edges == null) {
        return defaultEdges;
      }

      const edgesObj = Array.isArray(edges)
        ? edges.reduce<EdgeRecord>((acc, edge: Edge) => {
            acc[edge] = 'additive';
            return acc;
          }, {})
        : (edges as EdgeRecord);

      // Make sure that we always pass all edges
      const requiredEdges: Record<Edge, EdgeMode> = {
        top: edgesObj.top ?? 'off',
        right: edgesObj.right ?? 'off',
        bottom: edgesObj.bottom ?? 'off',
        left: edgesObj.left ?? 'off',
      };

      return requiredEdges;
    }, [edges]);

    const safeAreaStyle = useMemo(() => {
      const styleObj: {
        paddingTop?: number;
        paddingRight?: number;
        paddingBottom?: number;
        paddingLeft?: number;
        marginTop?: number;
        marginRight?: number;
        marginBottom?: number;
        marginLeft?: number;
      } = {};

      const applyInset = (edge: Edge, insetValue: number, edgeMode: EdgeMode) => {
        if (edgeMode === 'off') {
          return;
        }

        const value = edgeMode === 'maximum' ? Math.max(insetValue, 0) : insetValue;

        if (mode === 'padding') {
          switch (edge) {
            case 'top':
              styleObj.paddingTop = value;
              break;
            case 'right':
              styleObj.paddingRight = value;
              break;
            case 'bottom':
              styleObj.paddingBottom = value;
              break;
            case 'left':
              styleObj.paddingLeft = value;
              break;
          }
        } else {
          switch (edge) {
            case 'top':
              styleObj.marginTop = value;
              break;
            case 'right':
              styleObj.marginRight = value;
              break;
            case 'bottom':
              styleObj.marginBottom = value;
              break;
            case 'left':
              styleObj.marginLeft = value;
              break;
          }
        }
      };

      applyInset('top', insets.top, nativeEdges.top);
      applyInset('right', insets.right, nativeEdges.right);
      applyInset('bottom', insets.bottom, nativeEdges.bottom);
      applyInset('left', insets.left, nativeEdges.left);

      return styleObj;
    }, [insets, nativeEdges, mode]);

    return (
      <View ref={ref} style={[safeAreaStyle, style]} {...props}>
        {children}
      </View>
    );
  },
);

export default AppSafeAreaView;
