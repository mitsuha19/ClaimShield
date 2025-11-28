import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// Ubah sesuai alamat server Node (dashboard) kamu
// Kalau dari emulator Android ke laptop: pakai 10.0.2.2
const String API_BASE_URL = 'http://10.0.2.2:3000/api';

class ClaimDetailData {
  final String claimId;
  final String serviceDate;
  final String facilityName;
  final String serviceType;
  final String poli;
  final String mainDiagnosis;
  final String additionalDiagnosis;
  final List<String> prescriptions;
  final List<String> nonPrescriptions;

  ClaimDetailData({
    required this.claimId,
    required this.serviceDate,
    required this.facilityName,
    required this.serviceType,
    required this.poli,
    required this.mainDiagnosis,
    required this.additionalDiagnosis,
    required this.prescriptions,
    required this.nonPrescriptions,
  });
}

class ClaimDetailPage extends StatelessWidget {
  final String claimId;

  const ClaimDetailPage({super.key, required this.claimId});

  @override
  Widget build(BuildContext context) {
    // Dummy data berdasarkan ID klaim (di real app, fetch dari API)
    final ClaimDetailData detail = ClaimDetailData(
      claimId: claimId,
      serviceDate: '22 Nov 2025',
      facilityName: 'Klinik Sehat Medika',
      serviceType: 'Poli Rawat Jalan',
      poli: 'Umum',
      mainDiagnosis: 'K30 - Dyspepsia (Gangguan Pencernaan)',
      additionalDiagnosis: 'R10.1 - Nyeri Perut Bagian Atas',
      prescriptions: [
        'OMEPRAZOLE 20 MG CAPS - 2x1 (Sebelum Makan)',
        'ANTASIDA DOEN TAB - 3x1 (Kunyah)',
        'DOMPERIDONE 10 MG - 3x1 (Jika Mual)',
      ],
      nonPrescriptions: ['Edukasi Pola Makan Teratur', 'Hindari Pedas/Asam'],
    );

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Rincian Klaim',
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Informasi Utama
            const Text(
              'Informasi Utama',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 12),
            _buildInfoCard('ID Claim', detail.claimId, Icons.description),
            _buildInfoCard(
              'Tanggal Pelayanan',
              detail.serviceDate,
              Icons.calendar_today,
            ),
            _buildInfoCard('Faskes', detail.facilityName, Icons.local_hospital),
            _buildInfoCard('Jenis Layanan', detail.serviceType, Icons.category),
            _buildInfoCard('Poli Layanan', detail.poli, Icons.medical_services),
            const SizedBox(height: 20),

            // Diagnosis & Tindakan
            const Text(
              'Diagnosis & Tindakan',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 12),
            _buildInfoCard(
              'Diagnosis Utama',
              detail.mainDiagnosis,
              Icons.health_and_safety,
            ),
            _buildInfoCard(
              'Diagnosis Tambahan',
              detail.additionalDiagnosis,
              Icons.info_outline,
            ),
            const SizedBox(height: 12),
            _buildExpandableSection(
              'Resep Obat',
              detail.prescriptions,
              Icons.medication,
            ),
            const SizedBox(height: 12),
            _buildExpandableSection(
              'Terapi Non Obat',
              detail.nonPrescriptions,
              Icons.local_pharmacy,
            ),
            const SizedBox(height: 24),

            // Tombol Laporkan Klaim
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  _showReportDialog(context, detail.claimId);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  'Laporkan Klaim',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ================== KIRIM LAPORAN KE BACKEND ==================

  Future<void> _submitReport(
    BuildContext context,
    String claimId,
    String reason,
  ) async {
    try {
      final uri = Uri.parse('$API_BASE_URL/claims/$claimId/report-not-me');

      final body = {
        'peserta_id': 'P-002',
        'device_token': 'MOBILE_DEMO_TOKEN',
        'device_info': 'Flutter Android - v1.0.0',
        'notes': reason,
        'requested_action': 'INVESTIGATE',
        // 'message_id': 'optional-message-id-fcm',
      };

      final resp = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Laporan klaim berhasil dikirim.'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        debugPrint('Report error: ${resp.statusCode} ${resp.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Gagal mengirim laporan (${resp.statusCode}).'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      debugPrint('Exception saat kirim report: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Terjadi kesalahan saat mengirim laporan.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showReportDialog(BuildContext context, String claimId) {
    final TextEditingController controller = TextEditingController(
      text:
          'Saya tidak melakukan pemeriksaan/pergi ke Klinik Sehat Medika pada tanggal tersebut, dan saya tidak ada pergi ke RS maupun klinik',
    );

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          title: const Text(
            'Masukkan Feedback/Alasan Pelaporan',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          content: TextField(
            controller: controller,
            maxLines: 3,
            decoration: InputDecoration(
              hintText:
                  'Saya tidak melakukan pemeriksaan/pergi ke Klinik Sehat Medika pada tanggal tersebut, dan saya tidak ada pergi ke RS maupun klinik',
              hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              contentPadding: const EdgeInsets.all(12),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(dialogContext).pop();
              },
              style: TextButton.styleFrom(
                backgroundColor: Colors.red.withOpacity(0.1),
                foregroundColor: Colors.red,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text(
                'Batal',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 8),
            ElevatedButton(
              onPressed: () async {
                final reason = controller.text.trim();
                if (reason.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Alasan pelaporan wajib diisi.'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }

                // Tutup dialog dulu
                Navigator.of(dialogContext).pop();

                // Kirim ke backend
                await _submitReport(context, claimId, reason);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text(
                'Kirim',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        );
      },
    );
  }

  // ================== UI HELPERS ==================

  Widget _buildInfoCard(String label, String value, IconData icon) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Icon(icon, color: Colors.blue, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    value,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.black87,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExpandableSection(
    String title,
    List<String> items,
    IconData icon,
  ) {
    return Card(
      elevation: 1,
      child: ExpansionTile(
        leading: Icon(icon, color: Colors.green),
        title: Text(
          title,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
        ),
        children: items
            .map(
              (item) => Padding(
                padding: const EdgeInsets.all(12),
                child: Text(
                  '• $item',
                  style: const TextStyle(fontSize: 13, color: Colors.black87),
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}
