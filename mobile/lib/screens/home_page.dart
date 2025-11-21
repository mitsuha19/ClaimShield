import 'package:flutter/material.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import '../services/push_notification_service.dart';
import '../services/local_notification_service.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _pushService = PushNotificationService();

  @override
  void initState() {
    super.initState();
    _initFCM();
  }

  Future<void> _initFCM() async {
    final token = await _pushService.initialize();
    debugPrint('FCM Token (HomePage): $token');

    FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
      debugPrint('Got foreground message: ${message.messageId}');
      debugPrint('Data: ${message.data}');
      debugPrint(
        'Notif: ${message.notification?.title} - ${message.notification?.body}',
      );

      await LocalNotificationService.show(message);
    });

    // Kalau notif diklik dan app dibuka
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      debugPrint('User opened app from notification. Data: ${message.data}');
      // nanti di sini bisa navigate ke halaman tertentu
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Image.asset('assets/images/home.jpeg', fit: BoxFit.contain),
      ),
    );
  }
}
