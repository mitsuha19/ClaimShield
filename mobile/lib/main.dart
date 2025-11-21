import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'screens/home_page.dart';
import 'services/local_notification_service.dart';
import 'services/push_notification_service.dart';

/// Handler untuk pesan background (HARUS top-level)
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp();
  debugPrint('Background message: ${message.messageId}');
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Init Firebase dulu
  await Firebase.initializeApp();

  // Init local notification plugin + channel
  await LocalNotificationService.initialize();

  // (Opsional, tapi enak kalau token langsung ke-generate)
  await PushNotificationService().initialize();

  // Daftarkan handler background
  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}
