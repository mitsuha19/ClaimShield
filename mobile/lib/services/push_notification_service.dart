import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

class PushNotificationService {
  PushNotificationService._internal();

  static final PushNotificationService _instance =
      PushNotificationService._internal();

  factory PushNotificationService() => _instance;

  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  String? _token;
  String? get token => _token;

  Future<String?> initialize() async {
    final settings = await _messaging.requestPermission();

    debugPrint('Notification permission: ${settings.authorizationStatus}');

    _token = await _messaging.getToken();
    debugPrint('FCM Token: $_token');

    return _token;
  }
}
