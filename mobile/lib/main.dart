import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'screens/home_page.dart';

/// Handler untuk pesan background (harus top-level)
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint('Background message: ${message.messageId}');
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Init Firebase dulu
  await Firebase.initializeApp();

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
