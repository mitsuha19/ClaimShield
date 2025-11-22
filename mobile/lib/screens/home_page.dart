import 'package:flutter/material.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import '../services/push_notification_service.dart';
import '../services/local_notification_service.dart';
import 'notification_page.dart';

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

  void _showQRDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Close button (X)
                Align(
                  alignment: Alignment.topRight,
                  child: IconButton(
                    icon: const Icon(Icons.close, color: Colors.grey),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                // QR Code Image
                Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Image.asset(
                    'assets/images/qr_code.png',
                    fit: BoxFit.contain,
                  ),
                ),
                const SizedBox(height: 16),
                // Code Text
                Text(
                  'ASDP-as201XoYS7',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 20),
                // Salin Button
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Kode disalin ke clipboard'),
                      ),
                    );
                    Navigator.of(context).pop();
                  },
                  icon: const Icon(Icons.copy, size: 18),
                  label: const Text('Salin'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                // Download Barcode Button
                OutlinedButton.icon(
                  onPressed: () {
                    // TODO: Implement download barcode functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Barcode diunduh')),
                    );
                    Navigator.of(context).pop();
                  },
                  icon: const Icon(Icons.download, size: 18),
                  label: const Text('Download barcode'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.blue,
                    side: const BorderSide(color: Colors.blue),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background image
          Image.asset('assets/images/home.jpeg', fit: BoxFit.cover),
          Positioned(
            top: 34,
            right: 34,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // QR icon
                IconButton(
                  onPressed: () {
                    _showQRDialog(context);
                  },
                  icon: Image.asset(
                    'assets/images/qr.png',
                    width: 26,
                    height: 26,
                  ),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.black.withOpacity(0.5),
                    shape: const CircleBorder(),
                  ),
                ),
                const SizedBox(width: 8), // Small gap between icons
                // Notification icon (bell)
                IconButton(
                  onPressed: () {
                    // Navigate to notifications screen
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const NotificationPage(),
                      ),
                    );
                  },
                  icon: const Icon(
                    Icons.notifications,
                    size: 32,
                    color: Colors.white,
                  ),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.black.withOpacity(0.5),
                    shape: const CircleBorder(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
