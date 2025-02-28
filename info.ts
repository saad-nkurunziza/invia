/**
 * Business Rules and Configuration
 * This file defines the core business logic, calculations, and role-based permissions
 * for the inventory management system.
 */

export const BUSINESS_RULES = {
  // Inventory and Stock Management
  INVENTORY: {
    STOCK_THRESHOLD: {
      MINIMUM: 10, // Minimum stock level before alerts
      MAXIMUM: 1000, // Maximum stock capacity
      REORDER_POINT: 20, // Point at which to reorder stock
    },
    VERSIONING: {
      KEEP_HISTORY: true, // Maintain version history of product changes
      MAX_VERSIONS: 10, // Maximum number of versions to keep
    },
  },

  // Financial Calculations
  PROFIT_CALCULATION: {
    METHOD: "FIFO", // First In First Out inventory valuation
    INCLUDE_INVENTORY_CHANGES: true,
    MINIMUM_STOCK_THRESHOLD: 10,
    METRICS: {
      DAILY: {
        INCLUDE_PENDING_TRANSACTIONS: false,
        CALCULATION_PERIOD: "24_HOURS",
      },
      MONTHLY: {
        INCLUDE_INVENTORY_ADJUSTMENTS: true,
        CALCULATION_BASIS: "CALENDAR_MONTH",
      },
    },
    VALUE_CALCULATION: {
      PURCHASE_VALUE: "BUYING_PRICE * QUANTITY",
      SALES_VALUE: "SELLING_PRICE * QUANTITY",
      PROFIT_MARGIN: "(SELLING_PRICE - BUYING_PRICE) / BUYING_PRICE * 100",
    },
  },

  // User Roles and Permissions
  ROLES: {
    ADMIN: {
      CAN_MANAGE_USERS: true,
      CAN_VIEW_FINANCIALS: true,
      CAN_MODIFY_SETTINGS: true,
      CAN_DELETE_RECORDS: true,
      CAN_EXPORT_DATA: true,
      CAN_MANAGE_INVENTORY: true,
      DASHBOARD_ACCESS: {
        SALES: true,
        PURCHASES: true,
        ANALYTICS: true,
        REPORTS: true,
      },
    },
    WORKER: {
      CAN_MANAGE_USERS: false,
      CAN_VIEW_FINANCIALS: false,
      CAN_MODIFY_SETTINGS: false,
      CAN_DELETE_RECORDS: false,
      CAN_EXPORT_DATA: false,
      CAN_MANAGE_INVENTORY: true,
      DASHBOARD_ACCESS: {
        SALES: true,
        PURCHASES: true,
        ANALYTICS: false,
        REPORTS: false,
      },
    },
  },

  // Analysis and Reporting
  ANALYSIS: {
    STOCK_MOVEMENT: {
      TYPES: ["IN", "OUT", "ADJUSTMENT"],
      REQUIRES_DOCUMENTATION: true,
      TRACK_USER: true,
    },
    MONTHLY_CALCULATIONS: {
      OPENING_STOCK: "FIRST_DAY_OF_MONTH",
      CLOSING_STOCK: "LAST_DAY_OF_MONTH",
      INCLUDE_PENDING: false,
    },
    COMPARISON_METRICS: {
      DAILY: {
        COMPARE_WITH: "PREVIOUS_DAY",
        INCLUDE_WEEKENDS: false,
      },
      MONTHLY: {
        COMPARE_WITH: "PREVIOUS_MONTH",
        SEASONAL_ADJUSTMENT: true,
      },
    },
  },

  // Transaction Rules
  TRANSACTIONS: {
    REQUIRE_APPROVAL: {
      PURCHASES: true,
      SALES: false,
      THRESHOLD: 10000, // Transactions above this amount need approval
    },
    LOGGING: {
      KEEP_AUDIT_TRAIL: true,
      INCLUDE_USER_INFO: true,
      TRACK_CHANGES: true,
    },
  },
};

/**
 * Reference Documentation
 *
 * File Dependencies:
 * - src/server/monthly-analysis/sales.ts: Handles monthly sales calculations
 * - src/server/services/monthly-comparison.ts: Manages period-over-period comparisons
 * - src/server/input/analysis.ts: Processes stock value integration
 * - src/server/onboarding/create.ts: Handles business and user creation
 *
 * Key Business Processes:
 * 1. Stock Movement:
 *    - IN: Purchase of new stock
 *    - OUT: Sales transactions
 *    - ADJUSTMENT: Inventory corrections
 *
 * 2. Value Calculations:
 *    - Purchase Value = Quantity * Buying Price
 *    - Sales Value = Quantity * Selling Price
 *    - Profit = Sales Value - Purchase Value
 *
 * 3. Monthly Analysis:
 *    - Opening Stock: First day of month
 *    - Closing Stock: Last day of month
 *    - Stock Movement: All transactions within month
 *
 * 4. Comparison Metrics:
 *    - Daily: Compare with previous day
 *    - Monthly: Compare with previous month
 *    - Yearly: Year-over-year comparison
 */
