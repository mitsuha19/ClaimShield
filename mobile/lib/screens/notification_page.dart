import 'package:flutter/material.dart';
import 'claim_detail_page.dart'; // Import halaman detail klaim

// Dummy data untuk list notifikasi (bisa diganti dengan data real dari API atau state management)
class NotificationData {
  final String title;
  final String subtitle;
  final String date;
  final String id;
  final String timeAgo;

  NotificationData({
    required this.title,
    required this.subtitle,
    required this.date,
    required this.id,
    required this.timeAgo,
  });
}

class NotificationPage extends StatelessWidget {
  const NotificationPage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<NotificationData> notifications = [
      NotificationData(
        title: 'ClaimShield – Klaim Anda Diterima',
        subtitle: 'Klaim di Klinik Sehat Medika',
        date: 'Pada 18 Nov 2025 telah DITERIMA.',
        id: 'CLM-2025-11-18-000234',
        timeAgo: '4d',
      ),
      NotificationData(
        title: 'ClaimShield – Klaim Anda Diterima',
        subtitle: 'Klaim di Klinik Sehat Medika',
        date: 'Pada 10 Jan 2025 telah DITERIMA.',
        id: 'CLM-2025-11-18-000235',
        timeAgo: '316d',
      ),
      // Tambahkan lebih banyak item jika diperlukan
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Notifikasi',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.close, color: Colors.black87),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          final notif = notifications[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          notif.title,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.blue,
                          ),
                        ),
                      ),
                      Text(
                        notif.timeAgo,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    notif.subtitle,
                    style: const TextStyle(fontSize: 14, color: Colors.black87),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    notif.date,
                    style: const TextStyle(fontSize: 14, color: Colors.black87),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'ID Klaim: ${notif.id}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Align(
                    alignment: Alignment.centerRight,
                    child: ElevatedButton(
                      onPressed: () {
                        // Navigate to claim detail page with notification data
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => ClaimDetailPage(
                              claimId: notif.id,
                              // Bisa pass data lain jika diperlukan
                            ),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 8,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                      child: const Text('Lihat Detail'),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
