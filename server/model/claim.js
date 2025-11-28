const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Claim = sequelize.define(
  "Claim",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    claim_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    peserta_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fktp_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    jenis_layanan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    poli: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dokter_penanggung_jawab: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tanggal_pelayanan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sep_document_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    diagnosa_utama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diagnosa_tambahan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resume_keluhan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    terapi_obat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    biaya: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("pending", "validate", "approve", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },

    blockchain_tx_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "claims",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Claim;
