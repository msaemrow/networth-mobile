import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

export function PasswordInput(props: TextInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.wrapper}>
      <TextInput {...props} secureTextEntry={!visible} style={[styles.input, props.style]} />
      <Pressable
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        accessibilityRole="button"
        hitSlop={8}
        style={styles.toggle}
        onPress={() => setVisible((value) => !value)}
      >
        <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} color="#69756f" size={22} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  input: {
    backgroundColor: '#fff', borderColor: '#cad3ce', borderRadius: 10, borderWidth: 1,
    color: '#17352d', fontSize: 16, minHeight: 50, paddingHorizontal: 14, paddingRight: 48,
  },
  toggle: { alignItems: 'center', height: 44, justifyContent: 'center', position: 'absolute', right: 4, top: 3, width: 44 },
});
