import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'screens/home_page.dart';
// Import halaman detail untuk navigasi
import 'screens/claim_detail_page.dart';

import 'services/local_notification_service.dart';
import 'services/push_notification_service.dart';

// 1. GLOBAL KEY (Agar bisa navigasi tanpa context)
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

/// Handler untuk pesan background (HARUS top-level)
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint('Background message ID: ${message.messageId}');
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Init Firebase dulu
  await Firebase.initializeApp();

  // Init local notification plugin + channel
  await LocalNotificationService.initialize();

  // (Opsional) Init push notification service
  await PushNotificationService().initialize();

  // Daftarkan handler background
  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

  runApp(const MyApp());
}

// 2. UBAH JADI STATEFUL WIDGET
class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();
    // 3. Setup Listener Interaksi Notifikasi
    setupInteractedMessage();
  }

  Future<void> setupInteractedMessage() async {
    RemoteMessage? initialMessage = await FirebaseMessaging.instance
        .getInitialMessage();
    if (initialMessage != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _handleMessage(initialMessage);
      });
    }

    // B. KONDISI BACKGROUND (Aplikasi di Minimize)
    // Listener saat notifikasi ditekan dari system tray
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessage);

    // C. KONDISI FOREGROUND (Aplikasi Sedang Dibuka)
    // Munculkan notifikasi pop-up (Local Notification)
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      LocalNotificationService.show(message);
    });
  }

  void _handleMessage(RemoteMessage message) {
    if (message.data['claimId'] != null) {
      // Delay navigasi sampai frame pertama selesai (Navigator ready)
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (navigatorKey.currentState != null) {
          navigatorKey.currentState!.push(
            MaterialPageRoute(
              builder: (_) => ClaimDetailPage(claimId: message.data['claimId']),
            ),
          );
        } else {
          debugPrint('Navigator still null - retrying...');
          // Optional: Retry sekali lagi setelah 500ms
          Future.delayed(const Duration(milliseconds: 500), () {
            navigatorKey.currentState?.push(
              MaterialPageRoute(
                builder: (_) =>
                    ClaimDetailPage(claimId: message.data['claimId']),
              ),
            );
          });
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      // 4. PASANG KEY DI SINI
      navigatorKey: navigatorKey,
      home: const HomePage(),
    );
  }
}
