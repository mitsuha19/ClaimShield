import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

// Import main untuk akses navigatorKey
import '../main.dart';
// Import halaman detail (sesuaikan path folder Anda)
import '../screens/claim_detail_page.dart';

class LocalNotificationService {
  LocalNotificationService._();

  static final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  static const AndroidNotificationChannel _androidChannel =
      AndroidNotificationChannel(
        'high_importance_channel', // id harus sama dengan backend
        'High Importance Notifications', // name
        description: 'Channel untuk notifikasi penting ClaimShield',
        importance: Importance.high,
      );

  static Future<void> initialize() async {
    // Android init
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const initSettings = InitializationSettings(android: androidInit);

    await _plugin.initialize(
      initSettings,
      // TAMBAHAN PENTING: Menangani klik notifikasi saat aplikasi TERBUKA (Foreground)
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        if (response.payload != null) {
          try {
            final data = jsonDecode(response.payload!);
            if (data['claimId'] != null) {
              // Delay untuk pastikan Navigator ready
              WidgetsBinding.instance.addPostFrameCallback((_) {
                navigatorKey.currentState?.push(
                  MaterialPageRoute(
                    builder: (context) =>
                        ClaimDetailPage(claimId: data['claimId']),
                  ),
                );
              });
            }
          } catch (e) {
            debugPrint('Error parsing payload: $e');
          }
        }
      },
    );

    // Buat channel untuk Android
    final androidImpl = _plugin
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();

    await androidImpl?.createNotificationChannel(_androidChannel);
  }

  static Future<void> show(RemoteMessage message) async {
    final notification = message.notification;
    if (notification == null) return;

    final androidDetails = AndroidNotificationDetails(
      _androidChannel.id,
      _androidChannel.name,
      channelDescription: _androidChannel.description,
      importance: Importance.high,
      priority: Priority.high,
    );

    final details = NotificationDetails(android: androidDetails);

    await _plugin.show(
      notification.hashCode,
      notification.title,
      notification.body,
      details,
      // PENTING: Masukkan data asli ke payload agar bisa dibaca saat diklik
      payload: jsonEncode(message.data),
    );
  }
}
