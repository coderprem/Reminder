import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import AppButtonGroup from './AppButtonGroup';
import { Colors } from '../theme/colors';
import { IS_TABLET } from '../utils/device';
import { cw } from '../utils/dimensions';
import { ButtonItem } from './AppButtonGroup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackdropPressBehavior } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

type Props = {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  buttons?: ButtonItem[];
  pressBehavior?: BackdropPressBehavior;
};

const AppBottomDrawer = ({
  visible,
  onClose = () => {},
  children,
  buttons = [],
  pressBehavior = 'close',
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.25}
        pressBehavior={pressBehavior}
      />
    ),
    []
  );

  if (IS_TABLET) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.content}>{children}</View>

                {buttons.length > 0 && (
                  <AppButtonGroup buttons={buttons} />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    visible && (
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={pressBehavior !== 'none'}
        onClose={onClose}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={[styles.sheetContent, { paddingBottom: insets.bottom  }]}>
  
          <View style={styles.centerContent}>
            {children}
          </View>

          {buttons?.length > 0 && (
            <View style={styles.buttonContainer}>
              <AppButtonGroup buttons={buttons} />
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    )
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.blackOpacity60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: Colors.grey800,
    borderRadius: cw(12),
    padding: cw(16),
    alignItems: 'center'
  },
  content: {
    marginBottom: cw(16),
  },
  sheetBackground: {
    backgroundColor: Colors.grey800,
    borderRadius: cw(12),
  },
  sheetContent: {
    padding: cw(16),
  },
  buttonContainer: {
    marginTop: cw(16),
  },
  centerContent: {
    alignItems: 'center',
  },
  handle: {
  width: cw(35),
  height: cw(3),
  backgroundColor: Colors.white,
  borderRadius: cw(2),
},
});

export default AppBottomDrawer;
