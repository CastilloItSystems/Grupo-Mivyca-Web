// Tipos globales para el sistema del Grupo Mivyca

export type CompanyId = "almivyca" | "transmivyca" | "camabar";

export interface Company {
  id: CompanyId;
  name: string;
  displayName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyAccess: CompanyAccess[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanyAccess {
  companyId: CompanyId;
  role: UserRole;
  permissions: Permission[];
}

export type UserRole = "admin" | "manager" | "employee" | "viewer";

export interface Permission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
}

export interface AuthUser {
  userId: string;
  email: string;
  companyId: CompanyId;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
  companyId: CompanyId;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  companyId: CompanyId;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setAuthForTesting: (user: User, token: string) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyId: CompanyId;
}

// Respuestas de la API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Configuración de la aplicación
export interface AppConfig {
  apiUrl: string;
  environment: "development" | "production" | "test";
  companies: Record<CompanyId, Company>;
}

// Navegación
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavigationItem[];
  requiredPermissions?: Permission[];
}

// Estados de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Formularios
export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T = any> extends LoadingState {
  data: T;
  errors: FormError[];
  isDirty: boolean;
  isValid: boolean;
}

// ===== ALMIVYCA TYPES =====

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  categoryId: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  unit: string;
  location?: string;
  supplier?: string;
  supplierId?: string;
  barcode?: string;
  tags: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  type: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference?: string;
  cost?: number;
  userId: string;
  user?: User;
  notes?: string;
  createdAt: string;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  product?: Product;
  type: "LOW_STOCK" | "OUT_OF_STOCK" | "HIGH_STOCK" | "EXPIRED";
  level: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
  readAt?: string;
  dismissedAt?: string;
}

export interface InventoryReport {
  id: string;
  type: "STOCK_LEVELS" | "MOVEMENTS" | "LOW_STOCK" | "VALUATION";
  title: string;
  generatedAt: string;
  generatedBy: string;
  parameters: Record<string, any>;
  data: any;
  summary: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  totalQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    totalValue: number;
  }>;
  recentMovements: StockMovement[];
  alerts: InventoryAlert[];
}

// Tipos para creación y actualización
export interface CreateProductData {
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  unit: string;
  location?: string;
  supplierId?: string;
  barcode?: string;
  tags?: string[];
  images?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  isActive?: boolean;
}

export interface StockMovementData {
  productId: string;
  type: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER";
  quantity: number;
  reason: string;
  reference?: string;
  cost?: number;
  notes?: string;
}

// Filtros
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
  lowStock?: boolean;
  outOfStock?: boolean;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "name" | "sku" | "quantity" | "unitPrice" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface StockMovementFilters {
  productId?: string;
  type?: StockMovement["type"];
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "quantity";
  sortOrder?: "asc" | "desc";
}

// ===== TRANSMIVYCA TYPES =====

export interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: "TRUCK" | "VAN" | "CAR" | "MOTORCYCLE";
  capacity: number;
  fuelType: "GASOLINE" | "DIESEL" | "ELECTRIC" | "HYBRID";
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE" | "RETIRED";
  mileage: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  driverId?: string;
  driver?: Driver;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseType: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  currentVehicleId?: string;
  currentVehicle?: Vehicle;
  totalTrips: number;
  totalDistance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: string;
  name: string;
  description?: string;
  origin: {
    address: string;
    coordinates: [number, number];
  };
  destination: {
    address: string;
    coordinates: [number, number];
  };
  waypoints: Array<{
    address: string;
    coordinates: [number, number];
    estimatedArrival?: string;
  }>;
  distance: number;
  estimatedDuration: number;
  driverId?: string;
  driver?: Driver;
  vehicleId?: string;
  vehicle?: Vehicle;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  scheduledStartTime: string;
  actualStartTime?: string;
  completedTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  type: "PREVENTIVE" | "CORRECTIVE" | "EMERGENCY";
  service: string;
  description: string;
  cost: number;
  mileage: number;
  serviceDate: string;
  nextServiceDate?: string;
  providerId?: string;
  provider?: string;
  invoiceNumber?: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== CAMABAR TYPES =====

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  categoryId: string;
  price: number;
  cost: number;
  preparationTime: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  image?: string;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  table?: Table;
  type: "DINE_IN" | "TAKEOUT" | "DELIVERY";
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "SERVED"
    | "PAID"
    | "CANCELLED";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  paymentMethod?: "CASH" | "CARD" | "TRANSFER";
  waiter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  unitPrice: number;
  total: number;
  modifications?: string[];
  notes?: string;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  location: "INDOOR" | "OUTDOOR" | "TERRACE" | "BAR";
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING";
  currentOrderId?: string;
  currentOrder?: Order;
  isActive: boolean;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  partySize: number;
  tableId?: string;
  table?: Table;
  status: "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  specialRequests?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesReport {
  id: string;
  date: string;
  type: "DAILY" | "WEEKLY" | "MONTHLY";
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  paymentMethods: Record<string, number>;
  topItems: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  hourlyBreakdown: Array<{
    hour: number;
    sales: number;
    orders: number;
  }>;
}
