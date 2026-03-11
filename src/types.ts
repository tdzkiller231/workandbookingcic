export type TaskStatus = 'Đang thực hiện' | 'Hoàn thành' | 'Trễ hạn';
export type BookingStatus = 'Chờ duyệt' | 'Đã xác nhận' | 'Từ chối' | 'Đã hủy';
export type ResourceType = 'Phòng họp' | 'Xe công tác';
export type CatalogStatus = 'Đang sử dụng' | 'Ngừng sử dụng';

export interface TaskCatalog {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  departmentId?: string;
  status: CatalogStatus;
  createdAt: string;
  createdBy: string;
}

export interface Employee {
  id: string;
  name: string;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  children?: Department[];
}

export interface TaskAssignment {
  id: string;
  catalogId: string;
  employeeId: string;
  departmentId: string;
  deadline: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  description: string;
}

export interface RoomResource {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  availableEquipment: string[];
}

export interface VehicleResource {
  id: string;
  name: string;
  vehicleType: string;
  seats: number;
  plateNumber: string;
  defaultDriver: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceType: ResourceType;
  userId: string; // Employee ID
  startTime: string;
  endTime: string;
  status: BookingStatus;
  purpose: string;
  cancelReason?: string;
  createdAt: string;
  reminded?: boolean;
  // Room-specific fields
  equipment?: string[];
  participants?: string;
  // Vehicle-specific fields
  departure?: string;
  destination?: string;
  passengerCount?: number;
  driver?: string;
}

export type BookingLogAction =
  | 'Tạo mới'
  | 'Xác nhận'
  | 'Từ chối'
  | 'Đổi thời gian'
  | 'Đổi tài nguyên'
  | 'Đổi người dùng'
  | 'Hủy lịch'
  | 'Khôi phục'
  | 'Gửi xác nhận'
  | 'Gửi nhắc lịch'
  | 'Hệ thống hủy'
  | 'Hệ thống hoàn thành'
  | 'Sửa thông tin';

export interface BookingLog {
  id: string;
  bookingId: string;
  action: BookingLogAction | string;
  performedBy: string;
  actor: 'user' | 'system';
  timestamp: string;
  details: string;
  resourceType?: ResourceType;
  resourceId?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
}

export const DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Ban Giám đốc',
    parentId: null,
    children: [
      {
        id: '2',
        name: 'Phòng Nhân sự',
        parentId: '1',
      },
      {
        id: '3',
        name: 'Phòng Kỹ thuật',
        parentId: '1',
        children: [
          { id: '4', name: 'Tổ Phát triển', parentId: '3' },
          { id: '5', name: 'Tổ Vận hành', parentId: '3' },
        ]
      },
      {
        id: '6',
        name: 'Phòng Kinh doanh',
        parentId: '1',
      }
    ]
  }
];

export const EMPLOYEES: Employee[] = [
  // Ban Giám đốc (id: 1)
  { id: 'e0', name: 'Trần Minh Quang', departmentId: '1' },

  // Phòng Nhân sự (id: 2)
  { id: 'e1', name: 'Nguyễn Thị Hương', departmentId: '2' },
  { id: 'e2', name: 'Trần Thị Bích', departmentId: '2' },
  { id: 'e11', name: 'Lê Thị Mai', departmentId: '2' },
  { id: 'e12', name: 'Phạm Quốc Hùng', departmentId: '2' },
  { id: 'e13', name: 'Vũ Thị Lan', departmentId: '2' },

  // Phòng Kỹ thuật - Tổ Phát triển (id: 4)
  { id: 'e3', name: 'Lê Văn Cường', departmentId: '4' },
  { id: 'e4', name: 'Phạm Văn Dũng', departmentId: '4' },
  { id: 'e14', name: 'Nguyễn Hữu Tài', departmentId: '4' },
  { id: 'e15', name: 'Trịnh Văn Khoa', departmentId: '4' },
  { id: 'e16', name: 'Bùi Thị Thanh', departmentId: '4' },

  // Phòng Kỹ thuật - Tổ Vận hành (id: 5)
  { id: 'e5', name: 'Hoàng Thị Oanh', departmentId: '5' },
  { id: 'e17', name: 'Đinh Văn Long', departmentId: '5' },
  { id: 'e18', name: 'Ngô Thị Hà', departmentId: '5' },
  { id: 'e19', name: 'Tô Minh Đức', departmentId: '5' },

  // Phòng Kinh doanh (id: 6)
  { id: 'e6', name: 'Đặng Văn Phúc', departmentId: '6' },
  { id: 'e20', name: 'Nguyễn Thị Thu', departmentId: '6' },
  { id: 'e21', name: 'Lý Văn Nam', departmentId: '6' },
  { id: 'e22', name: 'Trần Thị Hoa', departmentId: '6' },
  { id: 'e23', name: 'Cao Xuân Bình', departmentId: '6' },
];

export const ROOM_RESOURCES: RoomResource[] = [
  { id: 'r1', name: 'Phòng họp A1', capacity: 10, floor: 'Tầng 1', availableEquipment: ['Máy chiếu', 'Bảng trắng', 'TV màn hình lớn', 'Điều hòa'] },
  { id: 'r2', name: 'Phòng họp B2', capacity: 20, floor: 'Tầng 2', availableEquipment: ['Máy chiếu', 'Bảng trắng', 'Hệ thống âm thanh', 'Điều hòa', 'Camera họp trực tuyến'] },
  { id: 'r5', name: 'Phòng họp C3', capacity: 6, floor: 'Tầng 3', availableEquipment: ['TV màn hình lớn', 'Bảng trắng', 'Điều hòa'] },
];

export const VEHICLE_RESOURCES: VehicleResource[] = [
  { id: 'r3', name: 'Toyota Camry', vehicleType: 'Sedan', seats: 4, plateNumber: '30A-12345', defaultDriver: 'Nguyễn Văn Tài' },
  { id: 'r4', name: 'Ford Transit', vehicleType: 'Van', seats: 16, plateNumber: '30A-67890', defaultDriver: 'Trần Văn Hòa' },
  { id: 'r6', name: 'Toyota Innova', vehicleType: 'MPV', seats: 7, plateNumber: '30A-11111', defaultDriver: 'Lê Văn Minh' },
];

export const RESOURCES: Resource[] = [
  ...ROOM_RESOURCES.map(r => ({ id: r.id, name: r.name, type: 'Phòng họp' as ResourceType, description: `${r.floor}, ${r.capacity} chỗ` })),
  ...VEHICLE_RESOURCES.map(v => ({ id: v.id, name: v.name, type: 'Xe công tác' as ResourceType, description: `${v.vehicleType}, ${v.seats} chỗ, Biển số ${v.plateNumber}` })),
];
