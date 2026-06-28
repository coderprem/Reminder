import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  InteractionManager,
} from 'react-native';
import { Colors } from '../theme/colors';
import { windowHeight } from '../utils/device';
import { mh, mw } from '../utils/dimensions';
import { Typography } from '../theme/typography';
import {AppText} from '../components/AppText';

type AlertButton = {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AppAlertParams = {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
};

type AlertState = AppAlertParams & {
  visible: boolean;
};

let showAlert: ((params: AppAlertParams) => void) | null = null;

/**
 * Public API
 */
export const appAlert = (params: AppAlertParams) => {
  showAlert?.(params);
};

export const AppAlertProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<AlertState>({
    visible: false,
  });

  /**
   * Register global handler
   */
  useEffect(() => {
    showAlert = (params: AppAlertParams) => {
      setState({
        visible: true,
        ...params,
      });
    };

    return () => {
      showAlert = null;
    };
  }, []);

  /**
   * Hide alert
   */
  const hide = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  /**
   * Handle button press
   */
  const handlePress = useCallback((button: AlertButton) => {
    hide();

    InteractionManager.runAfterInteractions(() => {
      button.onPress?.();
    });
  }, [hide]);

  /**
   * Enforce max 3 buttons (native behavior)
   */
  const buttons = useMemo(() => {
    const btns =
      state.buttons && state.buttons.length > 0
        ? state.buttons
        : [{ text: 'OK' }];

    return btns.slice(0, 3);
  }, [state.buttons]);

  /**
   * Render buttons (memoized)
   */
  const renderButtons = useMemo(() => {
    if (buttons.length === 1) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.singleButton}
          onPress={() => handlePress(buttons[0])}
        >
          <AppText style={styles.buttonText}>{buttons[0].text}</AppText>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.buttonRow}>
        {buttons.map((btn, index) => {
          let textStyle = styles.buttonText;

          if (btn.style === 'destructive') {
            textStyle = [styles.buttonText];
          }

          if (btn.style === 'cancel') {
            textStyle = [styles.buttonText, styles.cancelText];
          }

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={styles.button}
              onPress={() => handlePress(btn)}
            >
              <AppText style={textStyle}>{btn.text}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [buttons, handlePress]);

  return (
    <>
      {children}

      <Modal
        transparent
        visible={state.visible}
        animationType="fade"
        onRequestClose={hide}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            {!!state.title && (
              <AppText numberOfLines={2} style={styles.title}>
                {state.title}
              </AppText>
            )}

            {!!state.message && (
              <ScrollView
                style={styles.messageContainer}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <AppText style={styles.message}>{state.message}</AppText>
              </ScrollView>
            )}

            {renderButtons}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.blackOpacity50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '82%',
    maxHeight: windowHeight * 0.7,
    backgroundColor: Colors.grey800,
    borderRadius: mw(14),
    padding: mw(20),
  },

  title: {
    ...Typography.bold_16,
    color: Colors.white,
    marginBottom: mh(10),
  },

  messageContainer: {
    maxHeight: mh(250),
    marginBottom: mh(20),
  },

  message: {
    ...Typography.regular_15,
    color: Colors.grey200,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  button: {
    marginLeft: mw(16),
    paddingVertical: mh(8),
  },

  singleButton: {
    alignSelf: 'flex-end',
    paddingVertical: mh(8),
  },

  buttonText: {
    color: Colors.lightPink,
    ...Typography.bold_14,
  },

  destructiveText: {
    color: Colors.errorColor,
    ...Typography.bold_14,
  },

  cancelText: {
    ...Typography.bold_14,
  },
});