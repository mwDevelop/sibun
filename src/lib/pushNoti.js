import notifee, { AndroidImportance } from '@notifee/react-native';

const displayNotification = async message => {
    const channelAnoucement = await notifee.createChannel({
        id: 'default',
        name: '시분',
        importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
        title: message.data?.title || message.notification?.title || 'none message',
        body: message.data?.body || message.notification?.title || 'none message',
        android: {
            channelId: channelAnoucement,
            smallIcon: 'ic_launcher'
        },
    });
};

export default remoteMessage => displayNotification(remoteMessage);