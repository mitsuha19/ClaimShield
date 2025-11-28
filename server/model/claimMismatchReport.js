// models/ClaimMismatchReport.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ClaimMismatchReport = sequelize.define(
  "ClaimMismatchReport",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Relasi ke claims.id (boleh null kalau belum ketemu di DB)
    claim_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Kode klaim di sistem (KLAIM-xxxxx) / BC
    claim_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Peserta yang melaporkan "bukan saya"
    peserta_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Jenis laporan, sekarang fokus NOT_ME (bisa diperluas)
    report_type: {
      type: DataTypes.ENUM("NOT_ME", "OTHER"),
      allowNull: false,
      defaultValue: "NOT_ME",
    },

    // Info notifikasi (opsional)
    message_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // FCM token device yang melapor
    device_token: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },

    // Informasi device (os, appVersion, model, dll)
    device_info: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // Teks laporan dari user
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Aksi yang diminta user (opsional)
    requested_action: {
      type: DataTypes.ENUM("JUST_REPORT", "BLOCK_CARD", "INVESTIGATE"),
      allowNull: false,
      defaultValue: "JUST_REPORT",
    },

    // Status penanganan laporan
    status: {
      type: DataTypes.ENUM("open", "in_review", "resolved", "invalid"),
      allowNull: false,
      defaultValue: "open",
    },

    handled_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    handled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "claim_mismatch_reports",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ClaimMismatchReport;
