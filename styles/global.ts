import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aeacacff',
    padding: 16,
  },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1D3D47',
    },
    subtitle: {
        fontSize: 24,
        color: '#4A4A4A',
        marginTop: 8,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#3D5A80',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarInitials: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },

});
