import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

// ---------------------------------------------------------------------------
// Beach
// ---------------------------------------------------------------------------
export class Beach extends Model {
    public id!: number;
    public name!: string;
    public location!: string;
    // Stored as a JSON string so it works with both SQLite and PostgreSQL.
    // Shape: '{"type":"Point","coordinates":[lon,lat]}'
    public coordinates!: string | null;
    public description!: string;

    /** Convenience getter — returns the parsed GeoJSON object or null. */
    get coordinatesJson(): { type: string; coordinates: [number, number] } | null {
        if (!this.coordinates) return null;
        try {
            return typeof this.coordinates === 'string'
                ? JSON.parse(this.coordinates)
                : this.coordinates;
        } catch {
            return null;
        }
    }
}

Beach.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        // TEXT column — stores GeoJSON as a serialised string
        coordinates: { type: DataTypes.TEXT, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
    },
    { sequelize, tableName: 'beaches', timestamps: true }
);

// ---------------------------------------------------------------------------
// WeatherData
// ---------------------------------------------------------------------------
export class WeatherData extends Model { }
WeatherData.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        beach_id: { type: DataTypes.INTEGER, allowNull: false },
        temperature: { type: DataTypes.FLOAT, allowNull: false },
        wind_speed: { type: DataTypes.FLOAT, allowNull: false },
        uv_index: { type: DataTypes.FLOAT, allowNull: false },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'weather_data', timestamps: false }
);

// ---------------------------------------------------------------------------
// TideData
// ---------------------------------------------------------------------------
export class TideData extends Model { }
TideData.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        beach_id: { type: DataTypes.INTEGER, allowNull: false },
        tide_level: { type: DataTypes.FLOAT, allowNull: false },
        wave_height: { type: DataTypes.FLOAT, allowNull: false },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'tide_data', timestamps: false }
);

// ---------------------------------------------------------------------------
// SafetyData
// ---------------------------------------------------------------------------
export class SafetyData extends Model { }
SafetyData.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        beach_id: { type: DataTypes.INTEGER, allowNull: false },
        rip_current_risk: { type: DataTypes.STRING, allowNull: false }, // Low | Moderate | High
        lifeguard_available: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, tableName: 'safety_data', timestamps: true }
);

// ---------------------------------------------------------------------------
// CrowdData
// ---------------------------------------------------------------------------
export class CrowdData extends Model { }
CrowdData.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        beach_id: { type: DataTypes.INTEGER, allowNull: false },
        crowd_level: { type: DataTypes.STRING, allowNull: false }, // Low | Medium | High
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'crowd_data', timestamps: false }
);

// ---------------------------------------------------------------------------
// SuitabilityScore
// ---------------------------------------------------------------------------
export class SuitabilityScore extends Model { }
SuitabilityScore.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        beach_id: { type: DataTypes.INTEGER, allowNull: false },
        activity: { type: DataTypes.STRING, allowNull: false },
        score: { type: DataTypes.FLOAT, allowNull: false },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'suitability_scores', timestamps: false }
);

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------
export class Alert extends Model { }
Alert.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        beach_id: { type: DataTypes.INTEGER, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false }, // 'danger' | 'warning' | 'info'
        message: { type: DataTypes.STRING, allowNull: false },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'alerts', timestamps: false }
);

// ---------------------------------------------------------------------------
// User — preferences stored as JSON text (works on both SQLite & Postgres)
// ---------------------------------------------------------------------------
export class User extends Model {
    public id!: number;
    public preferences!: string | null;

    get preferencesJson(): Record<string, any> {
        if (!this.preferences) return {};
        try {
            return typeof this.preferences === 'string'
                ? JSON.parse(this.preferences)
                : this.preferences;
        } catch {
            return {};
        }
    }
}
User.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        // TEXT instead of JSONB so it runs on SQLite; serialise/parse manually.
        preferences: { type: DataTypes.TEXT, allowNull: true },
    },
    { sequelize, tableName: 'users', timestamps: true }
);

// ---------------------------------------------------------------------------
// Associations
// ---------------------------------------------------------------------------
Beach.hasMany(WeatherData, { foreignKey: 'beach_id', as: 'weather' });
WeatherData.belongsTo(Beach, { foreignKey: 'beach_id' });

Beach.hasMany(TideData, { foreignKey: 'beach_id', as: 'tides' });
TideData.belongsTo(Beach, { foreignKey: 'beach_id' });

Beach.hasOne(SafetyData, { foreignKey: 'beach_id', as: 'safety' });
SafetyData.belongsTo(Beach, { foreignKey: 'beach_id' });

Beach.hasMany(CrowdData, { foreignKey: 'beach_id', as: 'crowds' });
CrowdData.belongsTo(Beach, { foreignKey: 'beach_id' });

Beach.hasMany(SuitabilityScore, { foreignKey: 'beach_id', as: 'suitability_scores' });
SuitabilityScore.belongsTo(Beach, { foreignKey: 'beach_id' });

Beach.hasMany(Alert, { foreignKey: 'beach_id', as: 'alerts' });
Alert.belongsTo(Beach, { foreignKey: 'beach_id' });
