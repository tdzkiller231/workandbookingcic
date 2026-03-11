import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  UserPlus, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Filter,
  BarChart3,
  Users,
  Car,
  History,
  CalendarDays,
  Check,
  X,
  Edit2,
  Trash2,
  Info,
  Building2,
  Bell,
  Settings,
  Target,
  Shield,
  CreditCard,
  ChevronLeft,
  ChevronDown,
  Pencil,
  Minus,
  CheckSquare,
  Eye,
  FileText,
  Printer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { format, isAfter, parseISO, addMinutes, isBefore, isWithinInterval } from 'date-fns';
import { cn } from './lib/utils';
import { 
  TaskCatalog, 
  CatalogStatus,
  TaskAssignment, 
  TaskStatus, 
  EMPLOYEES, 
  DEPARTMENTS,
  Department,
  Booking,
  BookingLog,
  BookingLogAction,
  BookingStatus,
  ResourceType,
  RESOURCES,
  ROOM_RESOURCES,
  VEHICLE_RESOURCES,
  RoomResource,
  VehicleResource,
} from './types';
import { OrgTree } from './components/OrgTree';

// --- Mock Data Initialization ---
const INITIAL_CATALOG: TaskCatalog[] = [
  { id: 'c1',  code: 'CV001', name: 'Lập báo cáo tuần',            description: 'Tổng hợp kết quả làm việc trong tuần',                    category: 'Hành chính', departmentId: undefined, status: 'Đang sử dụng',   createdAt: '2026-01-05T08:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c2',  code: 'CV002', name: 'Kiểm tra hệ thống',            description: 'Kiểm tra định kỳ server và database',                     category: 'Kỹ thuật',   departmentId: '3',       status: 'Đang sử dụng',   createdAt: '2026-01-06T09:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c3',  code: 'CV003', name: 'Gặp gỡ khách hàng',            description: 'Tư vấn giải pháp cho đối tác mới',                        category: 'Kinh doanh', departmentId: '6',       status: 'Đang sử dụng',   createdAt: '2026-01-08T10:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c4',  code: 'CV004', name: 'Tuyển dụng nhân sự',           description: 'Đăng tin, sàng lọc hồ sơ và phỏng vấn ứng viên',          category: 'Nhân sự',    departmentId: '2',       status: 'Đang sử dụng',   createdAt: '2026-01-10T08:30:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c5',  code: 'CV005', name: 'Lập báo cáo tháng',            description: 'Tổng hợp kết quả kinh doanh, tài chính theo tháng',        category: 'Tài chính',  departmentId: undefined, status: 'Đang sử dụng',   createdAt: '2026-01-10T09:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c6',  code: 'CV006', name: 'Triển khai tính năng mới',     description: 'Phát triển và release tính năng theo sprint',              category: 'Kỹ thuật',   departmentId: '4',       status: 'Đang sử dụng',   createdAt: '2026-01-12T10:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c7',  code: 'CV007', name: 'Vận hành hạ tầng',             description: 'Giám sát và đảm bảo uptime hệ thống 24/7',                 category: 'Kỹ thuật',   departmentId: '5',       status: 'Đang sử dụng',   createdAt: '2026-01-13T08:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c8',  code: 'CV008', name: 'Đào tạo nội bộ',               description: 'Tổ chức các buổi training kỹ năng cho nhân viên',          category: 'Nhân sự',    departmentId: '2',       status: 'Đang sử dụng',   createdAt: '2026-01-15T09:30:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c9',  code: 'CV009', name: 'Chăm sóc khách hàng cũ',       description: 'Liên hệ, cập nhật và duy trì quan hệ khách hàng hiện có',  category: 'Kinh doanh', departmentId: '6',       status: 'Đang sử dụng',   createdAt: '2026-01-18T08:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c10', code: 'CV010', name: 'Đối soát hóa đơn',             description: 'Kiểm tra và đối soát chứng từ, hóa đơn tháng',             category: 'Tài chính',  departmentId: undefined, status: 'Đang sử dụng',   createdAt: '2026-01-20T10:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c11', code: 'CV011', name: 'Họp giao ban tuần',             description: 'Tổ chức họp review tiến độ các phòng ban mỗi thứ Hai',     category: 'Hành chính', departmentId: undefined, status: 'Đang sử dụng',   createdAt: '2026-01-22T08:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c12', code: 'CV012', name: 'Soạn thảo hợp đồng',           description: 'Chuẩn bị và soạn thảo hợp đồng lao động, dịch vụ',        category: 'Hành chính', departmentId: '2',       status: 'Đang sử dụng',   createdAt: '2026-01-25T09:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c13', code: 'CV013', name: 'Backup dữ liệu',               description: 'Thực hiện backup định kỳ toàn bộ dữ liệu hệ thống',        category: 'Kỹ thuật',   departmentId: '5',       status: 'Đang sử dụng',   createdAt: '2026-01-28T08:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c14', code: 'CV014', name: 'Khảo sát thị trường',          description: 'Thu thập và phân tích dữ liệu thị trường cạnh tranh',      category: 'Kinh doanh', departmentId: '6',       status: 'Đang sử dụng',   createdAt: '2026-02-01T09:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c15', code: 'CV015', name: 'Đánh giá hiệu suất nhân viên', description: 'Tổ chức đánh giá KPI định kỳ hàng quý',                   category: 'Nhân sự',    departmentId: '2',       status: 'Ngừng sử dụng',  createdAt: '2026-02-05T08:30:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
  { id: 'c16', code: 'CV016', name: 'Cập nhật tài liệu kỹ thuật',   description: 'Cập nhật và duy trì tài liệu hệ thống, API docs',          category: 'Kỹ thuật',   departmentId: '4',       status: 'Ngừng sử dụng',  createdAt: '2026-02-10T10:00:00.000Z', createdBy: 'Nguyễn Đức Trọng' },
];

const CATEGORIES = ['Hành chính', 'Kỹ thuật', 'Kinh doanh', 'Nhân sự', 'Tài chính'];

const INITIAL_BOOKINGS: Booking[] = [
  // --- Phòng họp ---
  {
    id: 'b1', resourceId: 'r1', resourceType: 'Phòng họp', userId: 'e1',
    startTime: '2026-03-11T08:00:00.000Z', endTime: '2026-03-11T09:30:00.000Z',
    status: 'Đã xác nhận', purpose: 'Họp giao ban tuần phòng Nhân sự',
    participants: 'Toàn bộ phòng Nhân sự (5 người)',
    equipment: ['Máy chiếu', 'Bảng trắng'],
    createdAt: '2026-03-10T07:00:00.000Z',
  },
  {
    id: 'b2', resourceId: 'r2', resourceType: 'Phòng họp', userId: 'e0',
    startTime: '2026-03-11T09:00:00.000Z', endTime: '2026-03-11T11:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Họp Ban Giám đốc triển khai chiến lược Q2',
    participants: 'Ban Giám đốc + Trưởng các phòng ban (8 người)',
    equipment: ['Máy chiếu', 'Hệ thống âm thanh', 'Camera họp trực tuyến'],
    createdAt: '2026-03-09T08:00:00.000Z',
  },
  {
    id: 'b3', resourceId: 'r5', resourceType: 'Phòng họp', userId: 'e3',
    startTime: '2026-03-11T14:00:00.000Z', endTime: '2026-03-11T15:30:00.000Z',
    status: 'Đã xác nhận', purpose: 'Review sprint 12 tổ Phát triển',
    participants: 'Tổ Phát triển (5 người)',
    equipment: ['TV màn hình lớn', 'Bảng trắng'],
    createdAt: '2026-03-10T09:00:00.000Z',
  },
  {
    id: 'b4', resourceId: 'r1', resourceType: 'Phòng họp', userId: 'e6',
    startTime: '2026-03-12T08:30:00.000Z', endTime: '2026-03-12T10:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Họp kế hoạch Sales tháng 3',
    participants: 'Phòng Kinh doanh (5 người)',
    equipment: ['Máy chiếu', 'Bảng trắng'],
    createdAt: '2026-03-10T10:00:00.000Z',
  },
  {
    id: 'b5', resourceId: 'r2', resourceType: 'Phòng họp', userId: 'e5',
    startTime: '2026-03-12T14:00:00.000Z', endTime: '2026-03-12T16:30:00.000Z',
    status: 'Đã xác nhận', purpose: 'Đào tạo nội bộ kỹ năng DevOps',
    participants: 'Tổ Vận hành + Tổ Phát triển (10 người)',
    equipment: ['Máy chiếu', 'Hệ thống âm thanh', 'Bảng trắng'],
    createdAt: '2026-03-08T09:00:00.000Z',
  },
  {
    id: 'b6', resourceId: 'r5', resourceType: 'Phòng họp', userId: 'e1',
    startTime: '2026-03-13T09:00:00.000Z', endTime: '2026-03-13T10:00:00.000Z',
    status: 'Chờ duyệt', purpose: 'Phỏng vấn ứng viên vị trí HR Specialist',
    participants: '2 người (HR + ứng viên)',
    equipment: ['TV màn hình lớn'],
    createdAt: '2026-03-11T06:00:00.000Z',
  },
  {
    id: 'b7', resourceId: 'r2', resourceType: 'Phòng họp', userId: 'e20',
    startTime: '2026-03-14T08:00:00.000Z', endTime: '2026-03-14T12:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Họp tổng kết dự án Khách hàng ABC',
    participants: 'Phòng Kinh doanh + đại diện khách hàng (15 người)',
    equipment: ['Máy chiếu', 'Hệ thống âm thanh', 'Camera họp trực tuyến', 'Điều hòa'],
    createdAt: '2026-03-09T14:00:00.000Z',
  },
  {
    id: 'b8', resourceId: 'r1', resourceType: 'Phòng họp', userId: 'e4',
    startTime: '2026-03-10T10:00:00.000Z', endTime: '2026-03-10T11:30:00.000Z',
    status: 'Đã hủy', purpose: 'Demo sản phẩm nội bộ Sprint 11',
    participants: 'Tổ Phát triển',
    equipment: ['Máy chiếu'],
    cancelReason: 'Demo bị hoãn sang tuần sau',
    createdAt: '2026-03-07T08:00:00.000Z',
  },
  {
    id: 'b9', resourceId: 'r5', resourceType: 'Phòng họp', userId: 'e11',
    startTime: '2026-03-15T14:00:00.000Z', endTime: '2026-03-15T15:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Họp 1:1 review KPI quý 1',
    participants: '2 người',
    equipment: [],
    createdAt: '2026-03-10T14:00:00.000Z',
  },
  {
    id: 'b10', resourceId: 'r2', resourceType: 'Phòng họp', userId: 'e3',
    startTime: '2026-03-17T09:00:00.000Z', endTime: '2026-03-17T11:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Kick-off dự án hệ thống CRM mới',
    participants: 'Tổ Phát triển + Phòng Kinh doanh (12 người)',
    equipment: ['Máy chiếu', 'Bảng trắng', 'Hệ thống âm thanh'],
    createdAt: '2026-03-10T11:00:00.000Z',
  },

  // --- Xe công tác ---
  {
    id: 'b11', resourceId: 'r3', resourceType: 'Xe công tác', userId: 'e6',
    startTime: '2026-03-11T07:30:00.000Z', endTime: '2026-03-11T12:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Gặp khách hàng Công ty TNHH Minh Phúc – ký hợp đồng Q2',
    departure: 'Văn phòng HN – 15 Lý Thường Kiệt', destination: 'Cầu Giấy, Hà Nội',
    passengerCount: 3, driver: 'Nguyễn Văn Tài',
    createdAt: '2026-03-10T06:00:00.000Z',
  },
  {
    id: 'b12', resourceId: 'r4', resourceType: 'Xe công tác', userId: 'e0',
    startTime: '2026-03-12T06:00:00.000Z', endTime: '2026-03-12T18:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Đưa đoàn Ban Giám đốc đi tham quan nhà máy đối tác tại Bắc Ninh',
    departure: 'Văn phòng HN', destination: 'KCN Tiên Du, Bắc Ninh',
    passengerCount: 12, driver: 'Trần Văn Hòa',
    createdAt: '2026-03-08T10:00:00.000Z',
  },
  {
    id: 'b13', resourceId: 'r6', resourceType: 'Xe công tác', userId: 'e21',
    startTime: '2026-03-13T08:00:00.000Z', endTime: '2026-03-13T17:00:00.000Z',
    status: 'Chờ duyệt', purpose: 'Khảo sát thị trường khu vực Hải Phòng',
    departure: 'Văn phòng HN', destination: 'TP. Hải Phòng',
    passengerCount: 4, driver: 'Lê Văn Minh',
    createdAt: '2026-03-11T07:00:00.000Z',
  },
  {
    id: 'b14', resourceId: 'r3', resourceType: 'Xe công tác', userId: 'e20',
    startTime: '2026-03-14T13:00:00.000Z', endTime: '2026-03-14T17:30:00.000Z',
    status: 'Chờ duyệt', purpose: 'Demo sản phẩm cho khách hàng tiềm năng tại Đống Đa',
    departure: 'Văn phòng HN', destination: 'Đống Đa, Hà Nội',
    passengerCount: 2, driver: 'Nguyễn Văn Tài',
    createdAt: '2026-03-11T08:00:00.000Z',
  },
  {
    id: 'b15', resourceId: 'r4', resourceType: 'Xe công tác', userId: 'e5',
    startTime: '2026-03-10T07:00:00.000Z', endTime: '2026-03-10T19:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Bảo trì hệ thống server tại datacenter Hà Nam',
    departure: 'Văn phòng HN', destination: 'KCN Đồng Văn, Hà Nam',
    passengerCount: 6, driver: 'Trần Văn Hòa',
    createdAt: '2026-03-06T09:00:00.000Z',
  },
  {
    id: 'b16', resourceId: 'r6', resourceType: 'Xe công tác', userId: 'e6',
    startTime: '2026-03-09T08:00:00.000Z', endTime: '2026-03-09T14:00:00.000Z',
    status: 'Đã xác nhận', purpose: 'Thăm và chăm sóc khách hàng cũ khu vực Long Biên',
    departure: 'Văn phòng HN', destination: 'Long Biên, Hà Nội',
    passengerCount: 3, driver: 'Lê Văn Minh',
    createdAt: '2026-03-07T11:00:00.000Z',
  },
  {
    id: 'b17', resourceId: 'r3', resourceType: 'Xe công tác', userId: 'e3',
    startTime: '2026-03-16T09:00:00.000Z', endTime: '2026-03-16T11:30:00.000Z',
    status: 'Chờ duyệt', purpose: 'Họp kỹ thuật với đối tác tích hợp API tại Hoàng Mai',
    departure: 'Văn phòng HN', destination: 'Hoàng Mai, Hà Nội',
    passengerCount: 2, driver: 'Nguyễn Văn Tài',
    createdAt: '2026-03-11T09:00:00.000Z',
  },
  {
    id: 'b18', resourceId: 'r4', resourceType: 'Xe công tác', userId: 'e0',
    startTime: '2026-03-08T06:30:00.000Z', endTime: '2026-03-08T20:00:00.000Z',
    status: 'Từ chối', purpose: 'Đi Quảng Ninh họp hội nghị ngành',
    departure: 'Văn phòng HN', destination: 'TP. Hạ Long, Quảng Ninh',
    passengerCount: 10, driver: 'Trần Văn Hòa',
    cancelReason: 'Sử dụng máy bay thay thế, tiết kiệm chi phí hơn',
    createdAt: '2026-03-05T10:00:00.000Z',
  },
];

const INITIAL_BOOKING_LOGS: BookingLog[] = [
  // b1 - Phòng A1
  { id: 'bl1',  bookingId: 'b1',  action: 'Tạo mới',      performedBy: 'Nguyễn Thị Hương', actor: 'user',   timestamp: '2026-03-10T07:00:00.000Z', details: 'Đặt Phòng họp A1, 08:00–09:30 ngày 11/03',              resourceType: 'Phòng họp',    resourceId: 'r1' },
  { id: 'bl2',  bookingId: 'b1',  action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-10T07:00:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r1' },
  // b2 - Phòng B2
  { id: 'bl3',  bookingId: 'b2',  action: 'Tạo mới',      performedBy: 'Trần Minh Quang',  actor: 'user',   timestamp: '2026-03-09T08:00:00.000Z', details: 'Đặt Phòng họp B2 họp chiến lược Q2',                   resourceType: 'Phòng họp',    resourceId: 'r2' },
  { id: 'bl4',  bookingId: 'b2',  action: 'Đổi thời gian',performedBy: 'Trần Minh Quang',  actor: 'user',   timestamp: '2026-03-09T10:15:00.000Z', details: 'Đổi giờ bắt đầu sau khi xác nhận lịch với các trưởng phòng', resourceType: 'Phòng họp', resourceId: 'r2', oldValue: '08:00–10:00 ngày 11/03', newValue: '09:00–11:00 ngày 11/03' },
  { id: 'bl5',  bookingId: 'b2',  action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-09T10:15:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r2' },
  // b3 - Phòng C3
  { id: 'bl6',  bookingId: 'b3',  action: 'Tạo mới',      performedBy: 'Lê Văn Cường',     actor: 'user',   timestamp: '2026-03-10T09:00:00.000Z', details: 'Đặt Phòng họp C3, review sprint 12',                   resourceType: 'Phòng họp',    resourceId: 'r5' },
  { id: 'bl7',  bookingId: 'b3',  action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-10T09:00:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r5' },
  // b4 - Phòng A1 Sales
  { id: 'bl8',  bookingId: 'b4',  action: 'Tạo mới',      performedBy: 'Đặng Văn Phúc',    actor: 'user',   timestamp: '2026-03-10T10:00:00.000Z', details: 'Đặt Phòng họp A1, họp kế hoạch Sales tháng 3',         resourceType: 'Phòng họp',    resourceId: 'r1' },
  { id: 'bl9',  bookingId: 'b4',  action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-10T10:00:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r1' },
  // b5 - Đào tạo DevOps
  { id: 'bl10', bookingId: 'b5',  action: 'Tạo mới',      performedBy: 'Hoàng Thị Oanh',   actor: 'user',   timestamp: '2026-03-08T09:00:00.000Z', details: 'Đặt Phòng họp B2, đào tạo DevOps nội bộ',              resourceType: 'Phòng họp',    resourceId: 'r2' },
  { id: 'bl11', bookingId: 'b5',  action: 'Sửa thông tin', performedBy: 'Hoàng Thị Oanh',  actor: 'user',   timestamp: '2026-03-09T08:30:00.000Z', details: 'Cập nhật danh sách người tham gia',                    resourceType: 'Phòng họp',    resourceId: 'r2', oldValue: 'Tổ Vận hành (5 người)', newValue: 'Tổ Vận hành + Tổ Phát triển (10 người)' },
  { id: 'bl12', bookingId: 'b5',  action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-09T08:30:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r2' },
  // b6 - Phỏng vấn (Chờ duyệt)
  { id: 'bl13', bookingId: 'b6',  action: 'Tạo mới',      performedBy: 'Nguyễn Thị Hương', actor: 'user',   timestamp: '2026-03-11T06:00:00.000Z', details: 'Đặt Phòng họp C3, phỏng vấn ứng viên HR Specialist',   resourceType: 'Phòng họp',    resourceId: 'r5' },
  // b7 - Họp tổng kết dự án
  { id: 'bl14', bookingId: 'b7',  action: 'Tạo mới',      performedBy: 'Nguyễn Thị Thu',   actor: 'user',   timestamp: '2026-03-09T14:00:00.000Z', details: 'Đặt Phòng họp B2, họp tổng kết dự án khách hàng ABC',  resourceType: 'Phòng họp',    resourceId: 'r2' },
  { id: 'bl15', bookingId: 'b7',  action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-09T14:00:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r2' },
  // b8 - Demo Sprint 11 (Đã hủy)
  { id: 'bl16', bookingId: 'b8',  action: 'Tạo mới',      performedBy: 'Phạm Văn Dũng',    actor: 'user',   timestamp: '2026-03-07T08:00:00.000Z', details: 'Đặt Phòng họp A1, demo sản phẩm nội bộ Sprint 11',     resourceType: 'Phòng họp',    resourceId: 'r1' },
  { id: 'bl17', bookingId: 'b8',  action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-07T08:00:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r1' },
  { id: 'bl18', bookingId: 'b8',  action: 'Hủy lịch',     performedBy: 'Phạm Văn Dũng',    actor: 'user',   timestamp: '2026-03-09T09:00:00.000Z', details: 'Hủy lịch đặt phòng',                                  resourceType: 'Phòng họp',    resourceId: 'r1', reason: 'Demo bị hoãn sang tuần sau' },
  // b9 - 1:1 KPI
  { id: 'bl19', bookingId: 'b9',  action: 'Tạo mới',      performedBy: 'Lê Thị Mai',       actor: 'user',   timestamp: '2026-03-10T14:00:00.000Z', details: 'Đặt Phòng họp C3, review KPI quý 1',                   resourceType: 'Phòng họp',    resourceId: 'r5' },
  { id: 'bl20', bookingId: 'b9',  action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-10T14:00:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r5' },
  // b10 - Kick-off CRM
  { id: 'bl21', bookingId: 'b10', action: 'Tạo mới',      performedBy: 'Lê Văn Cường',     actor: 'user',   timestamp: '2026-03-10T11:00:00.000Z', details: 'Đặt Phòng họp B2, kick-off dự án CRM mới',             resourceType: 'Phòng họp',    resourceId: 'r2' },
  { id: 'bl22', bookingId: 'b10', action: 'Xác nhận',     performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-10T11:00:30.000Z', details: 'Hệ thống tự động xác nhận đặt phòng họp',              resourceType: 'Phòng họp',    resourceId: 'r2' },
  // b11 - Toyota Camry
  { id: 'bl23', bookingId: 'b11', action: 'Tạo mới',      performedBy: 'Đặng Văn Phúc',    actor: 'user',   timestamp: '2026-03-10T06:00:00.000Z', details: 'Đặt Toyota Camry, ký hợp đồng Q2 với Minh Phúc',       resourceType: 'Xe công tác',   resourceId: 'r3' },
  { id: 'bl24', bookingId: 'b11', action: 'Xác nhận',     performedBy: 'Nguyễn Đức Trọng', actor: 'user',   timestamp: '2026-03-10T08:00:00.000Z', details: 'Phê duyệt yêu cầu đặt xe công tác',                    resourceType: 'Xe công tác',   resourceId: 'r3' },
  { id: 'bl25', bookingId: 'b11', action: 'Gửi xác nhận', performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-10T08:00:30.000Z', details: 'Hệ thống gửi email xác nhận tới người đặt',            resourceType: 'Xe công tác',   resourceId: 'r3' },
  // b12 - Ford Transit Bắc Ninh
  { id: 'bl26', bookingId: 'b12', action: 'Tạo mới',      performedBy: 'Trần Minh Quang',  actor: 'user',   timestamp: '2026-03-08T10:00:00.000Z', details: 'Đặt Ford Transit đi tham quan nhà máy đối tác Bắc Ninh',resourceType: 'Xe công tác',   resourceId: 'r4' },
  { id: 'bl27', bookingId: 'b12', action: 'Xác nhận',     performedBy: 'Nguyễn Đức Trọng', actor: 'user',   timestamp: '2026-03-08T11:00:00.000Z', details: 'Phê duyệt yêu cầu đặt xe công tác',                    resourceType: 'Xe công tác',   resourceId: 'r4' },
  { id: 'bl28', bookingId: 'b12', action: 'Gửi xác nhận', performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-08T11:00:30.000Z', details: 'Hệ thống gửi email xác nhận tới người đặt',            resourceType: 'Xe công tác',   resourceId: 'r4' },
  // b13 - Toyota Innova Hải Phòng (Chờ duyệt)
  { id: 'bl29', bookingId: 'b13', action: 'Tạo mới',      performedBy: 'Lý Văn Nam',       actor: 'user',   timestamp: '2026-03-11T07:00:00.000Z', details: 'Đặt Toyota Innova đi khảo sát thị trường Hải Phòng',   resourceType: 'Xe công tác',   resourceId: 'r6' },
  // b14 - Toyota Camry Demo (Chờ duyệt)
  { id: 'bl30', bookingId: 'b14', action: 'Tạo mới',      performedBy: 'Nguyễn Thị Thu',   actor: 'user',   timestamp: '2026-03-11T08:00:00.000Z', details: 'Đặt Toyota Camry demo sản phẩm tại Đống Đa',           resourceType: 'Xe công tác',   resourceId: 'r3' },
  // b15 - Ford Transit Hà Nam
  { id: 'bl31', bookingId: 'b15', action: 'Tạo mới',      performedBy: 'Hoàng Thị Oanh',   actor: 'user',   timestamp: '2026-03-06T09:00:00.000Z', details: 'Đặt Ford Transit bảo trì server tại Hà Nam',           resourceType: 'Xe công tác',   resourceId: 'r4' },
  { id: 'bl32', bookingId: 'b15', action: 'Xác nhận',     performedBy: 'Nguyễn Đức Trọng', actor: 'user',   timestamp: '2026-03-06T10:30:00.000Z', details: 'Phê duyệt yêu cầu đặt xe công tác',                    resourceType: 'Xe công tác',   resourceId: 'r4' },
  { id: 'bl33', bookingId: 'b15', action: 'Gửi xác nhận', performedBy: 'Hệ thống',         actor: 'system', timestamp: '2026-03-06T10:30:30.000Z', details: 'Hệ thống gửi email xác nhận tới người đặt',            resourceType: 'Xe công tác',   resourceId: 'r4' },
  // b16 - Toyota Innova Long Biên
  { id: 'bl34', bookingId: 'b16', action: 'Tạo mới',      performedBy: 'Đặng Văn Phúc',    actor: 'user',   timestamp: '2026-03-07T11:00:00.000Z', details: 'Đặt Toyota Innova thăm khách hàng khu vực Long Biên',  resourceType: 'Xe công tác',   resourceId: 'r6' },
  { id: 'bl35', bookingId: 'b16', action: 'Xác nhận',     performedBy: 'Nguyễn Đức Trọng', actor: 'user',   timestamp: '2026-03-07T13:00:00.000Z', details: 'Phê duyệt yêu cầu đặt xe công tác',                    resourceType: 'Xe công tác',   resourceId: 'r6' },
  // b17 - Toyota Camry Hoàng Mai (Chờ duyệt)
  { id: 'bl36', bookingId: 'b17', action: 'Tạo mới',      performedBy: 'Lê Văn Cường',     actor: 'user',   timestamp: '2026-03-11T09:00:00.000Z', details: 'Đặt Toyota Camry họp kỹ thuật tại Hoàng Mai',          resourceType: 'Xe công tác',   resourceId: 'r3' },
  // b18 - Ford Transit Quảng Ninh (Từ chối)
  { id: 'bl37', bookingId: 'b18', action: 'Tạo mới',      performedBy: 'Trần Minh Quang',  actor: 'user',   timestamp: '2026-03-05T10:00:00.000Z', details: 'Đặt Ford Transit đi hội nghị ngành tại Quảng Ninh',    resourceType: 'Xe công tác',   resourceId: 'r4' },
  { id: 'bl38', bookingId: 'b18', action: 'Từ chối',      performedBy: 'Nguyễn Đức Trọng', actor: 'user',   timestamp: '2026-03-06T09:00:00.000Z', details: 'Từ chối yêu cầu đặt xe',                              resourceType: 'Xe công tác',   resourceId: 'r4', reason: 'Sử dụng máy bay thay thế, tiết kiệm chi phí hơn' },
];

const INITIAL_ASSIGNMENTS: TaskAssignment[] = [
  { id: 'a1', catalogId: 'c1', employeeId: 'e1', departmentId: '2', deadline: '2026-03-15', status: 'Đang thực hiện', createdAt: '2026-03-01T08:00:00.000Z' },
  { id: 'a2', catalogId: 'c1', employeeId: 'e2', departmentId: '2', deadline: '2026-03-15', status: 'Hoàn thành', createdAt: '2026-03-01T08:30:00.000Z', completedAt: '2026-03-10T10:00:00.000Z' },
  { id: 'a3', catalogId: 'c2', employeeId: 'e3', departmentId: '4', deadline: '2026-03-08', status: 'Trễ hạn', createdAt: '2026-02-25T09:00:00.000Z' },
  { id: 'a4', catalogId: 'c2', employeeId: 'e4', departmentId: '4', deadline: '2026-03-20', status: 'Đang thực hiện', createdAt: '2026-03-05T07:30:00.000Z' },
  { id: 'a5', catalogId: 'c3', employeeId: 'e6', departmentId: '6', deadline: '2026-03-18', status: 'Đang thực hiện', createdAt: '2026-03-06T09:00:00.000Z' },
  { id: 'a6', catalogId: 'c1', employeeId: 'e5', departmentId: '5', deadline: '2026-03-05', status: 'Trễ hạn', createdAt: '2026-02-20T08:00:00.000Z' },
  { id: 'a7', catalogId: 'c3', employeeId: 'e1', departmentId: '2', deadline: '2026-03-25', status: 'Đang thực hiện', createdAt: '2026-03-08T11:00:00.000Z' },
  { id: 'a8', catalogId: 'c2', employeeId: 'e5', departmentId: '5', deadline: '2026-03-12', status: 'Hoàn thành', createdAt: '2026-03-02T08:00:00.000Z', completedAt: '2026-03-09T16:00:00.000Z' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'assignments' | 'dashboard' | 'room_bookings' | 'vehicle_bookings' | 'booking_approval' | 'booking_logs'>('dashboard');
  const [approvalSubTab, setApprovalSubTab] = useState<'Phòng họp' | 'Xe công tác'>('Phòng họp');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<'Tất cả' | 'Chờ duyệt' | 'Đã xác nhận' | 'Từ chối'>('Tất cả');
  const [dashboardSubTab, setDashboardSubTab] = useState<'overview' | 'reports'>('overview');
  const [catalog, setCatalog] = useState<TaskCatalog[]>(() => {
    const version = localStorage.getItem('task_catalog_version');
    const saved = localStorage.getItem('task_catalog');
    if (version === '2' && saved) {
      const parsed: any[] = JSON.parse(saved);
      return parsed.map((c, i) => ({
        code: c.code ?? `CV${String(i + 1).padStart(3, '0')}`,
        status: c.status ?? 'Đang sử dụng',
        createdAt: c.createdAt ?? new Date().toISOString(),
        createdBy: c.createdBy ?? 'Nguyễn Đức Trọng',
        departmentId: c.departmentId ?? undefined,
        ...c,
      })) as TaskCatalog[];
    }
    // Reset to latest seed data
    localStorage.setItem('task_catalog_version', '2');
    return INITIAL_CATALOG;
  });
  const [assignments, setAssignments] = useState<TaskAssignment[]>(() => {
    const saved = localStorage.getItem('task_assignments');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.length > 0 ? parsed : INITIAL_ASSIGNMENTS;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const version = localStorage.getItem('task_bookings_version');
    const saved = localStorage.getItem('task_bookings');
    if (version === '1' && saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('task_bookings_version', '1');
    return INITIAL_BOOKINGS;
  });
  const [bookingLogs, setBookingLogs] = useState<BookingLog[]>(() => {
    const version = localStorage.getItem('task_booking_logs_version');
    const saved = localStorage.getItem('task_booking_logs');
    if (version === '1' && saved) return JSON.parse(saved);
    localStorage.setItem('task_booking_logs_version', '1');
    return INITIAL_BOOKING_LOGS;
  });

  const [viewingBookingDetail, setViewingBookingDetail] = useState<Booking | null>(null);
  const [logSearch, setLogSearch] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('');
  const [logActionFilter, setLogActionFilter] = useState('');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  const [isAddingCatalog, setIsAddingCatalog] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<TaskCatalog | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilterCategory, setCatalogFilterCategory] = useState('');
  const [catalogFilterStatus, setCatalogFilterStatus] = useState('');
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [isAddingRoomBooking, setIsAddingRoomBooking] = useState(false);
  const [isAddingVehicleBooking, setIsAddingVehicleBooking] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('task_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('task_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('task_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('task_booking_logs', JSON.stringify(bookingLogs));
  }, [bookingLogs]);

  // Reminder check
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const reminderTime = addMinutes(now, 30); // Remind 30 mins before

      bookings.forEach(b => {
        if (b.status === 'Đã xác nhận' && !b.reminded) {
          const start = parseISO(b.startTime);
          if (isBefore(start, reminderTime) && isAfter(start, now)) {
            const resource = RESOURCES.find(r => r.id === b.resourceId);
            alert(`NHẮC LỊCH: Bạn có lịch sử dụng ${resource?.name} vào lúc ${format(start, 'HH:mm')}`);
            setBookings(prev => prev.map(item => item.id === b.id ? { ...item, reminded: true } : item));
            addBookingLog(b.id, 'Gửi nhắc lịch', 'Đã gửi thông báo nhắc lịch tự động trước 30 phút',
              { actor: 'system', resourceType: b.resourceType, resourceId: b.resourceId }
            );
          }
        }
      });
    }, 30000); // Check every 30 seconds
    return () => clearInterval(timer);
  }, [bookings]);

  // Auto-update "Overdue" status
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setAssignments(prev => prev.map(task => {
        if (task.status === 'Đang thực hiện' && isAfter(now, parseISO(task.deadline))) {
          return { ...task, status: 'Trễ hạn' };
        }
        return task;
      }));
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  const handleAddCatalog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingCatalog) {
      // Edit mode
      const updated: TaskCatalog = {
        ...editingCatalog,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        departmentId: (formData.get('departmentId') as string) || undefined,
        status: formData.get('status') as CatalogStatus,
      };
      setCatalog(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditingCatalog(null);
    } else {
      // Add mode
      const nextCode = `CV${String(catalog.length + 1).padStart(3, '0')}`;
      const newTask: TaskCatalog = {
        id: crypto.randomUUID(),
        code: nextCode,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        departmentId: (formData.get('departmentId') as string) || undefined,
        status: (formData.get('status') as CatalogStatus) || 'Đang sử dụng',
        createdAt: new Date().toISOString(),
        createdBy: 'Nguyễn Đức Trọng',
      };
      setCatalog(prev => [...prev, newTask]);
      setIsAddingCatalog(false);
    }
  };

  const handleToggleCatalogStatus = (id: string) => {
    setCatalog(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === 'Đang sử dụng' ? 'Ngừng sử dụng' : 'Đang sử dụng' } : c
    ));
  };

  const handleAddAssignment = (e: React.FormEvent<HTMLFormElement>, deptId: string, empId: string, catalogId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const deadline = formData.get('deadline') as string;
    
    const newAssignment: TaskAssignment = {
      id: crypto.randomUUID(),
      catalogId,
      employeeId: empId,
      departmentId: deptId,
      deadline,
      status: 'Đang thực hiện',
      createdAt: new Date().toISOString(),
    };
    
    setAssignments([...assignments, newAssignment]);
    setIsAddingAssignment(false);
  };

  const updateStatus = (id: string, newStatus: TaskStatus) => {
    setAssignments(prev => prev.map(task => 
      task.id === id ? { 
        ...task, 
        status: newStatus,
        completedAt: newStatus === 'Hoàn thành' ? new Date().toISOString() : undefined
      } : task
    ));
  };

  // --- Booking Helpers ---
  const addBookingLog = (
    bookingId: string,
    action: string,
    details: string,
    opts?: {
      oldValue?: string; newValue?: string; reason?: string;
      actor?: 'user' | 'system'; resourceType?: ResourceType; resourceId?: string;
    }
  ) => {
    const newLog: BookingLog = {
      id: crypto.randomUUID(),
      bookingId,
      action,
      performedBy: opts?.actor === 'system' ? 'Hệ thống' : 'Nguyễn Đức Trọng',
      actor: opts?.actor ?? 'user',
      timestamp: new Date().toISOString(),
      details,
      resourceType: opts?.resourceType,
      resourceId: opts?.resourceId,
      oldValue: opts?.oldValue,
      newValue: opts?.newValue,
      reason: opts?.reason,
    };
    setBookingLogs(prev => [newLog, ...prev]);
  };

  const checkConflict = (resourceId: string, startTime: string, endTime: string, excludeId?: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);

    return bookings.some(b => {
      if (b.id === excludeId) return false;
      if (b.resourceId !== resourceId) return false;
      if (b.status === 'Từ chối' || b.status === 'Đã hủy') return false;

      const bStart = parseISO(b.startTime);
      const bEnd = parseISO(b.endTime);

      // Overlap logic: (StartA < EndB) and (EndA > StartB)
      return isBefore(start, bEnd) && isAfter(end, bStart);
    });
  };

  const handleBookingSubmit = (data: Partial<Booking>) => {
    const isEdit = !!editingBooking;
    const bookingId = isEdit ? editingBooking!.id : crypto.randomUUID();
    
    const newBooking: Booking = {
      id: bookingId,
      resourceId: data.resourceId!,
      resourceType: data.resourceType!,
      userId: data.userId!,
      startTime: data.startTime!,
      endTime: data.endTime!,
      status: data.resourceType === 'Phòng họp' ? 'Đã xác nhận' : 'Chờ duyệt',
      purpose: data.purpose!,
      createdAt: isEdit ? editingBooking!.createdAt : new Date().toISOString(),
      // Room-specific
      equipment: data.equipment,
      participants: data.participants,
      // Vehicle-specific
      departure: data.departure,
      destination: data.destination,
      passengerCount: data.passengerCount,
      driver: data.driver,
    };

    if (isEdit) {
      setBookings(prev => prev.map(b => b.id === bookingId ? newBooking : b));
      const old = editingBooking!;
      if (old.startTime !== data.startTime || old.endTime !== data.endTime) {
        addBookingLog(bookingId, 'Đổi thời gian', 'Thay đổi thời gian đặt chỗ', {
          oldValue: `${format(parseISO(old.startTime), 'HH:mm dd/MM/yyyy')} – ${format(parseISO(old.endTime), 'HH:mm')}`,
          newValue: `${format(parseISO(data.startTime!), 'HH:mm dd/MM/yyyy')} – ${format(parseISO(data.endTime!), 'HH:mm')}`,
          resourceType: data.resourceType, resourceId: data.resourceId,
        });
      }
      if (old.resourceId !== data.resourceId) {
        const oldRes = [...ROOM_RESOURCES, ...VEHICLE_RESOURCES].find(r => r.id === old.resourceId)?.name || old.resourceId;
        const newRes = [...ROOM_RESOURCES, ...VEHICLE_RESOURCES].find(r => r.id === data.resourceId)?.name || data.resourceId;
        addBookingLog(bookingId, 'Đổi tài nguyên', 'Thay đổi phòng / xe', {
          oldValue: oldRes, newValue: newRes,
          resourceType: data.resourceType, resourceId: data.resourceId,
        });
      }
      if (old.purpose !== data.purpose) {
        addBookingLog(bookingId, 'Sửa thông tin', 'Cập nhật mục đích', {
          oldValue: old.purpose, newValue: data.purpose,
          resourceType: data.resourceType, resourceId: data.resourceId,
        });
      }
      if (old.startTime === data.startTime && old.endTime === data.endTime && old.resourceId === data.resourceId && old.purpose === data.purpose) {
        addBookingLog(bookingId, 'Sửa thông tin', 'Cập nhật thông tin đặt chỗ',
          { resourceType: data.resourceType, resourceId: data.resourceId }
        );
      }
    } else {
      setBookings(prev => [...prev, newBooking]);
      addBookingLog(bookingId, 'Tạo mới', `Tạo yêu cầu đặt chỗ: ${newBooking.purpose}`,
        { resourceType: data.resourceType, resourceId: data.resourceId }
      );
      if (data.resourceType === 'Phòng họp') {
        addBookingLog(bookingId, 'Xác nhận', 'Hệ thống tự động xác nhận đặt phòng họp',
          { actor: 'system', resourceType: data.resourceType, resourceId: data.resourceId }
        );
      }
    }

    setIsAddingRoomBooking(false);
    setIsAddingVehicleBooking(false);
    setEditingBooking(null);
  };

  const handleApproveBooking = (id: string, approve: boolean) => {
    const bk = bookings.find(b => b.id === id);
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, status: approve ? 'Đã xác nhận' : 'Từ chối' } : b
    ));
    addBookingLog(id,
      approve ? 'Xác nhận' : 'Từ chối',
      approve ? 'Phê duyệt yêu cầu đặt chỗ' : 'Từ chối yêu cầu đặt chỗ',
      { resourceType: bk?.resourceType, resourceId: bk?.resourceId }
    );
    if (approve) {
      addBookingLog(id, 'Gửi xác nhận', 'Hệ thống gửi email xác nhận tới người đặt',
        { actor: 'system', resourceType: bk?.resourceType, resourceId: bk?.resourceId }
      );
    }
  };

  const handleCancelBooking = (id: string, reason: string) => {
    const bk = bookings.find(b => b.id === id);
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'Đã hủy', cancelReason: reason } : b
    ));
    addBookingLog(id, 'Hủy lịch', 'Hủy lịch đặt chỗ',
      { reason, resourceType: bk?.resourceType, resourceId: bk?.resourceId }
    );
  };

  // --- Report Print ---
  const handlePrintReport = (type: 'task_dept' | 'task_detail' | 'room_stats' | 'vehicle_stats' | 'booking_all') => {
    const today = format(new Date(), 'dd/MM/yyyy');
    const baseStyles = `
      <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Times New Roman',serif; }
        body { padding:20mm 20mm 20mm 25mm; font-size:13px; color:#000; }
        .org-block { text-align:center; margin-bottom:6px; }
        .org-name { font-weight:bold; font-size:13px; text-transform:uppercase; }
        .divider { border-top:1.5px solid #000; width:40%; margin:6px auto; }
        .report-title { text-align:center; margin:20px 0 4px; font-size:15px; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px; }
        .report-period { text-align:center; font-size:12px; font-style:italic; margin-bottom:16px; }
        table { width:100%; border-collapse:collapse; margin:12px 0; font-size:12px; }
        th, td { border:1px solid #444; padding:6px 8px; }
        th { background:#d0d0d0; font-weight:bold; text-align:center; }
        td.c { text-align:center; }
        tr.total td { font-weight:bold; background:#e8e8e8; }
        .note { font-size:11px; font-style:italic; margin-top:8px; }
        .sig { margin-top:48px; display:flex; justify-content:space-between; }
        .sig-box { text-align:center; min-width:180px; font-size:12px; }
        .sig-box p { font-weight:bold; }
        .sig-line { margin-top:56px; font-weight:bold; text-decoration:underline; }
        @media print { body { padding:10mm 15mm; } }
      </style>`;

    const docHeader = `<div class="org-block">
      <div class="org-name">Công ty TNHH ABC Tech</div>
      <div style="font-size:11px">15 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội &nbsp;|&nbsp; Tel: (024) 3838-XXXX</div>
      <div class="divider"></div>
    </div>`;

    const sig = `<div class="sig">
      <div class="sig-box">
        <p>Người lập báo cáo</p>
        <p style="font-style:italic;font-size:11px;font-weight:normal">(Ký, ghi rõ họ tên)</p>
        <div class="sig-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </div>
      <div class="sig-box">
        <p>Hà Nội, ngày ${today}</p>
        <p>Giám đốc</p>
        <p style="font-style:italic;font-size:11px;font-weight:normal">(Ký, đóng dấu)</p>
        <div class="sig-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </div>
    </div>`;

    let content = '';
    if (type === 'task_dept') {
      const allDepts = (() => {
        const map: Record<string, { name: string; total: number; inProgress: number; completed: number; overdue: number }> = {};
        const flatten = (d: { id: string; name: string; children?: typeof DEPARTMENTS }): void => {
          map[d.id] = { name: d.name, total: 0, completed: 0, inProgress: 0, overdue: 0 };
          d.children?.forEach(c => flatten(c as any));
        };
        DEPARTMENTS.forEach(d => flatten(d as any));
        assignments.forEach(a => {
          if (map[a.departmentId]) {
            map[a.departmentId].total++;
            if (a.status === 'Hoàn thành') map[a.departmentId].completed++;
            else if (a.status === 'Đang thực hiện') map[a.departmentId].inProgress++;
            else map[a.departmentId].overdue++;
          }
        });
        return Object.values(map).filter(d => d.total > 0);
      })();
      const total = { total: 0, inProgress: 0, completed: 0, overdue: 0 };
      allDepts.forEach(d => { total.total += d.total; total.inProgress += d.inProgress; total.completed += d.completed; total.overdue += d.overdue; });
      const rows = allDepts.map((d, i) => {
        const rate = d.total > 0 ? Math.round(d.completed / d.total * 100) : 0;
        return `<tr><td class="c">${i+1}</td><td>${d.name}</td><td class="c">${d.total}</td><td class="c">${d.inProgress}</td><td class="c">${d.completed}</td><td class="c">${d.overdue}</td><td class="c">${rate}%</td></tr>`;
      }).join('');
      const totalRate = total.total > 0 ? Math.round(total.completed / total.total * 100) : 0;
      content = `<p class="report-title">Báo cáo tổng hợp tình hình thực hiện công việc</p>
        <p class="report-period">Tường kỳ: Tháng 03/2026 &nbsp;—&nbsp; Ngày lập: ${today}</p>
        <table><thead><tr>
          <th rowspan="2" style="width:38px">STT</th><th rowspan="2">Phòng ban</th>
          <th rowspan="2" style="width:62px">Tổng số CV</th>
          <th colspan="3">Được phân theo trạng thái</th>
          <th rowspan="2" style="width:80px">Tỷ lệ HT (%)</th>
        </tr><tr>
          <th style="width:90px">Đang thực hiện</th>
          <th style="width:85px">Hoàn thành</th>
          <th style="width:70px">Trễ hạn</th>
        </tr></thead><tbody>${rows}
        <tr class="total"><td class="c"></td><td>Cộng</td><td class="c">${total.total}</td><td class="c">${total.inProgress}</td><td class="c">${total.completed}</td><td class="c">${total.overdue}</td><td class="c">${totalRate}%</td></tr>
        </tbody></table>
        <p class="note">* Ghi chú: CV = Công việc. Số liệu thống kê tính đến ngày ${today}.</p>`;
    } else if (type === 'task_detail') {
      const rows = assignments.map((a, i) => {
        const emp = EMPLOYEES.find(e => e.id === a.employeeId);
        const dept = flatDepts.find(d => d.id === a.departmentId);
        const task = catalog.find(c => c.id === a.catalogId);
        const statusColor = a.status === 'Hoàn thành' ? 'color:#16a34a' : a.status === 'Trễ hạn' ? 'color:#dc2626' : '';
        return `<tr><td class="c">${i+1}</td><td>${emp?.name||'N/A'}</td><td>${dept?.name||'N/A'}</td><td>${task?.name||'N/A'}</td><td>${task?.category||''}</td><td class="c">${a.deadline}</td><td class="c" style="${statusColor}">${a.status}</td></tr>`;
      }).join('');
      content = `<p class="report-title">Báo cáo chi tiết giao việc toàn công ty</p>
        <p class="report-period">Tính đến ngày ${today}</p>
        <table><thead><tr>
          <th style="width:38px">STT</th><th>Nhân viên</th><th>Phòng ban</th><th>Đầu việc</th><th>Nhóm việc</th><th style="width:90px">Hạn HT</th><th style="width:100px">Trạng thái</th>
        </tr></thead><tbody>${rows}</tbody></table>
        <p class="note">* Tổng số: ${assignments.length} nhiệm vụ giao. Số liệu tính đến ngày ${today}.</p>`;
    } else if (type === 'room_stats') {
      const roomRows = ROOM_RESOURCES.map((r, i) => {
        const bk = bookings.filter(b => b.resourceId === r.id);
        const confirmed = bk.filter(b => b.status === 'Đã xác nhận').length;
        const pending   = bk.filter(b => b.status === 'Chờ duyệt').length;
        const cancelled = bk.filter(b => b.status === 'Đã hủy').length;
        const rejected  = bk.filter(b => b.status === 'Từ chối').length;
        const hours = bk.filter(b => b.status === 'Đã xác nhận').reduce((s, b) => {
          const diff = (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 36e5;
          return s + diff;
        }, 0);
        return `<tr><td class="c">${i+1}</td><td>${r.name}</td><td class="c">${r.floor}</td><td class="c">${r.capacity}</td><td class="c">${bk.length}</td><td class="c">${confirmed}</td><td class="c">${pending}</td><td class="c">${cancelled}</td><td class="c">${rejected}</td><td class="c">${hours.toFixed(1)}</td></tr>`;
      });
      const totBk       = bookings.filter(b => b.resourceType === 'Phòng họp').length;
      const totConfirm  = bookings.filter(b => b.resourceType === 'Phòng họp' && b.status === 'Đã xác nhận').length;
      const totHours    = bookings.filter(b => b.resourceType === 'Phòng họp' && b.status === 'Đã xác nhận').reduce((s, b) => s + (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 36e5, 0);
      content = `<p class="report-title">Báo cáo thống kê sử dụng phòng họp</p>
        <p class="report-period">Tháng 03/2026 &nbsp;—&nbsp; Ngày lập: ${today}</p>
        <table><thead><tr>
          <th style="width:38px">STT</th><th>Phòng họp</th><th style="width:55px">Tầng</th><th style="width:60px">Sức chứa</th>
          <th style="width:60px">Tổng lượt đặt</th><th style="width:65px">Đã xác nhận</th><th style="width:65px">Chờ duyệt</th>
          <th style="width:55px">Đã hủy</th><th style="width:55px">Từ chối</th><th style="width:65px">Tổng giờ SD</th>
        </tr></thead><tbody>${roomRows.join('')}
        <tr class="total"><td class="c"></td><td>Cộng</td><td></td><td></td><td class="c">${totBk}</td><td class="c">${totConfirm}</td><td class="c"></td><td class="c"></td><td class="c"></td><td class="c">${totHours.toFixed(1)}</td></tr>
        </tbody></table>
        <p class="note">* SD = Sử dụng. Số giờ tính theo các lịch đã xác nhận. Tính đến ngày ${today}.</p>`;
    } else if (type === 'vehicle_stats') {
      const vehs = VEHICLE_RESOURCES.map((v, i) => {
        const bk = bookings.filter(b => b.resourceId === v.id);
        const confirmed = bk.filter(b => b.status === 'Đã xác nhận').length;
        const pending   = bk.filter(b => b.status === 'Chờ duyệt').length;
        const cancelled = bk.filter(b => b.status === 'Đã hủy' || b.status === 'Từ chối').length;
        return `<tr><td class="c">${i+1}</td><td>${v.name}</td><td class="c">${v.vehicleType}</td><td class="c">${v.plateNumber}</td><td class="c">${v.seats}</td><td class="c">${bk.length}</td><td class="c">${confirmed}</td><td class="c">${pending}</td><td class="c">${cancelled}</td></tr>`;
      });
      const totBk      = bookings.filter(b => b.resourceType === 'Xe công tác').length;
      const totConfirm = bookings.filter(b => b.resourceType === 'Xe công tác' && b.status === 'Đã xác nhận').length;
      content = `<p class="report-title">Báo cáo thống kê sử dụng xe công tác</p>
        <p class="report-period">Tháng 03/2026 &nbsp;—&nbsp; Ngày lập: ${today}</p>
        <table><thead><tr>
          <th style="width:38px">STT</th><th>Phương tiện</th><th style="width:65px">Loại xe</th>
          <th style="width:95px">Biển số</th><th style="width:55px">Số chỗ</th>
          <th style="width:65px">Tổng lượt đặt</th><th style="width:70px">Đã xác nhận</th>
          <th style="width:65px">Chờ duyệt</th><th style="width:70px">Hủy / Từ chối</th>
        </tr></thead><tbody>${vehs.join('')}
        <tr class="total"><td class="c"></td><td>Cộng</td><td></td><td></td><td class="c"></td><td class="c">${totBk}</td><td class="c">${totConfirm}</td><td class="c"></td><td class="c"></td></tr>
        </tbody></table>
        <p class="note">* Số liệu thống kê tính đến ngày ${today}.</p>`;
    } else if (type === 'booking_all') {
      const rows = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((b, i) => {
        const emp  = EMPLOYEES.find(e => e.id === b.userId);
        const dept = flatDepts.find(d => d.id === emp?.departmentId);
        const res  = b.resourceType === 'Phòng họp'
          ? ROOM_RESOURCES.find(r => r.id === b.resourceId)?.name
          : VEHICLE_RESOURCES.find(v => v.id === b.resourceId)?.name;
        const statusColor = b.status === 'Đã xác nhận' ? 'color:#16a34a' : b.status === 'Từ chối' || b.status === 'Đã hủy' ? 'color:#dc2626' : b.status === 'Chờ duyệt' ? 'color:#d97706' : '';
        return `<tr><td class="c">${i+1}</td><td class="c">${b.resourceType}</td><td>${res||'N/A'}</td><td>${emp?.name||'N/A'}</td><td>${dept?.name||''}</td><td class="c" style="font-size:11px">${format(new Date(b.startTime),'dd/MM HH:mm')}</td><td class="c" style="font-size:11px">${format(new Date(b.endTime),'dd/MM HH:mm')}</td><td style="font-size:11px">${b.purpose}</td><td class="c" style="${statusColor};font-size:11px">${b.status}</td></tr>`;
      }).join('');
      content = `<p class="report-title">Báo cáo tổng hợp đặt chỗ</p>
        <p class="report-period">Tháng 03/2026 &nbsp;—&nbsp; Ngày lập: ${today}</p>
        <table><thead><tr>
          <th style="width:34px">STT</th><th style="width:75px">Loại TN</th><th>Tài nguyên</th><th>Người đặt</th><th>Phòng ban</th>
          <th style="width:70px">Bắt đầu</th><th style="width:70px">Kết thúc</th><th>Mục đích</th><th style="width:75px">Trạng thái</th>
        </tr></thead><tbody>${rows}</tbody></table>
        <p class="note">* Tổng: ${bookings.length} đặt chỗ. Phòng họp: ${bookings.filter(b=>b.resourceType==='Đã xác nhận').length}. Số liệu tính đến ngày ${today}.</p>`;
    }

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Báo cáo</title>${baseStyles}</head><body>${docHeader}${content}${sig}</body></html>`;
    const win = window.open('', '_blank', 'width=1000,height=800');
    win?.document.write(html);
    win?.document.close();
    win?.focus();
    setTimeout(() => win?.print(), 500);
  };

  // --- Dashboard Data ---
  const stats = useMemo(() => {
    const counts = {
      'Đang thực hiện': 0,
      'Hoàn thành': 0,
      'Trễ hạn': 0,
    };
    assignments.forEach(a => counts[a.status]++);
    return counts;
  }, [assignments]);

  const chartData = [
    { name: 'Đang thực hiện', value: stats['Đang thực hiện'], color: '#3b82f6' },
    { name: 'Hoàn thành', value: stats['Hoàn thành'], color: '#10b981' },
    { name: 'Trễ hạn', value: stats['Trễ hạn'], color: '#ef4444' },
  ];

  const deptStats = useMemo(() => {
    const map: Record<string, any> = {};
    DEPARTMENTS.forEach(function flatten(d: Department) {
      map[d.id] = { name: d.name, total: 0, completed: 0, inProgress: 0, overdue: 0 };
      d.children?.forEach(flatten);
    });

    assignments.forEach(a => {
      if (map[a.departmentId]) {
        map[a.departmentId].total++;
        if (a.status === 'Hoàn thành') map[a.departmentId].completed++;
        else if (a.status === 'Đang thực hiện') map[a.departmentId].inProgress++;
        else map[a.departmentId].overdue++;
      }
    });

    return Object.values(map).filter(d => d.total > 0);
  }, [assignments]);

  // Flatten departments list for dropdowns
  const flatDepts = useMemo(() => {
    const result: { id: string; name: string }[] = [];
    function flatten(d: Department) {
      result.push({ id: d.id, name: d.name });
      d.children?.forEach(flatten);
    }
    DEPARTMENTS.forEach(flatten);
    return result;
  }, []);

  // Filtered catalog
  const filteredCatalog = useMemo(() => {
    return catalog.filter(c => {
      const matchSearch = !catalogSearch || c.name.toLowerCase().includes(catalogSearch.toLowerCase()) || c.code.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchCategory = !catalogFilterCategory || c.category === catalogFilterCategory;
      const matchStatus = !catalogFilterStatus || c.status === catalogFilterStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [catalog, catalogSearch, catalogFilterCategory, catalogFilterStatus]);

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [groupTask, setGroupTask] = useState(true);
  const [groupBooking, setGroupBooking] = useState(true);

  const isTaskActive = activeTab === 'catalog' || activeTab === 'assignments';
  const isBookingActive = activeTab === 'room_bookings' || activeTab === 'vehicle_bookings' || activeTab === 'booking_approval' || activeTab === 'booking_logs';

  return (
    <div className="flex h-screen bg-white font-sans text-[#1D1D1F] overflow-hidden">
      {/* HiStaff-style Dark Sidebar */}
      <aside className={`${sidebarExpanded ? 'w-56' : 'w-[62px]'} bg-[#1a1a2e] flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-14 border-b border-white/10">
          {sidebarExpanded ? (
            <div className="flex items-center px-4">
              <span className="text-white font-bold text-lg">Hi</span>
              <span className="text-white font-bold text-lg">Staff</span>
              <span className="text-[#f97316] font-bold text-lg ml-0.5">✓</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-white font-bold text-sm">Hi</span>
              <span className="text-[#f97316] font-bold text-sm">✓</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col py-3 gap-0.5 overflow-y-auto">
          {/* Dashboard */}
          <SideNavItem
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Tổng quan"
            expanded={sidebarExpanded}
          />

          {/* Group: Quản lý công việc */}
          <SideNavGroup
            label="Quản lý công việc"
            icon={<ListTodo size={20} />}
            expanded={sidebarExpanded}
            open={groupTask}
            onToggle={() => setGroupTask(!groupTask)}
            active={isTaskActive}
          >
            <SideNavItem
              active={activeTab === 'catalog'}
              onClick={() => setActiveTab('catalog')}
              icon={<ListTodo size={18} />}
              label="Danh mục công việc"
              expanded={sidebarExpanded}
              sub
            />
            <SideNavItem
              active={activeTab === 'assignments'}
              onClick={() => setActiveTab('assignments')}
              icon={<UserPlus size={18} />}
              label="Giao việc"
              expanded={sidebarExpanded}
              sub
            />
          </SideNavGroup>

          {/* Group: Quản lý đặt chỗ */}
          <SideNavGroup
            label="Quản lý đặt chỗ"
            icon={<CalendarDays size={20} />}
            expanded={sidebarExpanded}
            open={groupBooking}
            onToggle={() => setGroupBooking(!groupBooking)}
            active={isBookingActive}
          >
            <SideNavItem
              active={activeTab === 'room_bookings'}
              onClick={() => setActiveTab('room_bookings')}
              icon={<Building2 size={18} />}
              label="Đặt phòng họp"
              expanded={sidebarExpanded}
              sub
            />
            <SideNavItem
              active={activeTab === 'vehicle_bookings'}
              onClick={() => setActiveTab('vehicle_bookings')}
              icon={<Car size={18} />}
              label="Đặt xe công tác"
              expanded={sidebarExpanded}
              sub
            />
            <SideNavItem
              active={activeTab === 'booking_approval'}
              onClick={() => setActiveTab('booking_approval')}
              icon={<CheckSquare size={18} />}
              label="Phê duyệt"
              expanded={sidebarExpanded}
              sub
            />
            <SideNavItem
              active={activeTab === 'booking_logs'}
              onClick={() => setActiveTab('booking_logs')}
              icon={<History size={18} />}
              label="Nhật ký đặt chỗ"
              expanded={sidebarExpanded}
              sub
            />
          </SideNavGroup>
        </nav>

        {/* Expand toggle */}
        <div className="border-t border-white/10 py-3 flex justify-center">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="text-white/40 hover:text-white/80 transition-colors p-2"
          >
            {sidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </aside>

      {/* Right side: topbar + content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HiStaff-style Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
          {/* Left: Logo text */}
          <div className="flex items-center gap-1">
            <span className="text-[#1a1a2e] font-bold text-xl tracking-tight">Hi</span>
            <span className="text-[#1a1a2e] font-bold text-xl tracking-tight">Staff</span>
            <span className="text-[#f97316] font-bold text-xl">✓</span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <div className="relative">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <Bell size={18} className="text-gray-600" />
              </button>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">0</span>
            </div>

            {/* Vietnam flag */}
            <div className="w-7 h-5 flex items-center justify-center overflow-hidden rounded-sm border border-gray-200">
              <div className="w-full h-full relative bg-red-600 flex items-center justify-center">
                <span className="text-yellow-400 text-[10px]">★</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200" />

            {/* User */}
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                <span>NĐT</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-800">Nguyễn Đức Trọng</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-gray-50">
        <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h2>
                  <p className="text-black/40 mt-1">Theo dõi tiến độ và hiệu suất làm việc</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{format(new Date(), 'EEEE, d MMMM yyyy')}</p>
                </div>
              </header>

              {/* Sub-tabs */}
              <div className="flex border-b border-black/8">
                {([{ id: 'overview', label: 'Tổng quan' }, { id: 'reports', label: 'Mẫu báo cáo' }] as const).map(t => (
                  <button key={t.id} onClick={() => setDashboardSubTab(t.id)}
                    className={cn(
                      'relative px-5 py-3 text-sm font-medium transition-colors',
                      dashboardSubTab === t.id ? 'text-[#1a1a2e]' : 'text-black/40 hover:text-black/60'
                    )}>
                    {t.label}
                    {dashboardSubTab === t.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-t" />}
                  </button>
                ))}
              </div>

              {/* Overview sub-tab */}
              {dashboardSubTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Đang thực hiện" value={stats['Đang thực hiện']} icon={<Clock className="text-blue-500" />} trend="+2% so với tuần trước" />
                    <StatCard label="Hoàn thành" value={stats['Hoàn thành']} icon={<CheckCircle2 className="text-emerald-500" />} trend="+15% so với tuần trước" />
                    <StatCard label="Trễ hạn" value={stats['Trễ hạn']} icon={<AlertCircle className="text-red-500" />} trend="-5% so với tuần trước" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 size={20} className="text-black/60" /> Phân bổ trạng thái
                      </h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                              {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Users size={20} className="text-black/60" /> Tổng hợp theo phòng ban
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-black/40 border-bottom border-black/5">
                              <th className="pb-3 font-medium">Phòng ban</th>
                              <th className="pb-3 font-medium text-center">Tổng</th>
                              <th className="pb-3 font-medium text-center">Xong</th>
                              <th className="pb-3 font-medium text-center">Trễ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5">
                            {deptStats.map((d, i) => (
                              <tr key={i}>
                                <td className="py-3 font-medium">{d.name}</td>
                                <td className="py-3 text-center">{d.total}</td>
                                <td className="py-3 text-center text-emerald-600">{d.completed}</td>
                                <td className="py-3 text-center text-red-600">{d.overdue}</td>
                              </tr>
                            ))}
                            {deptStats.length === 0 && (
                              <tr><td colSpan={4} className="py-8 text-center text-black/20 italic">Chưa có dữ liệu giao việc</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reports sub-tab */}
              {dashboardSubTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-black/40" />
                    <div>
                      <p className="font-semibold">Mẫu báo cáo chuẩn</p>
                      <p className="text-xs text-black/40">Nhấp “In báo cáo” để xem trước và xuất ra máy in / PDF. Dữ liệu tính theo số liệu hiện tại.</p>
                    </div>
                  </div>

                  {/* Task reports */}
                  <div>
                    <h3 className="text-xs font-bold text-black/30 uppercase tracking-widest mb-3">Quản lý công việc</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ReportCard
                        code="BC-CV01"
                        title="Tổng hợp công việc theo phòng ban"
                        desc="Bảng thống kê số lượng công việc chia theo từng phòng ban: đang TH, hoàn thành, trễ hạn, tỷ lệ hoàn thành."
                        icon={<Users size={22} className="text-blue-500" />}
                        color="bg-blue-50 border-blue-100"
                        preview={[
                          ['Phòng ban', 'Tổng', 'Đang TH', 'HT', 'Trễ', 'Tỷ lệ'],
                          ...deptStats.slice(0, 3).map(d => [d.name, String(d.total), String(d.inProgress), String(d.completed), String(d.overdue), d.total > 0 ? Math.round(d.completed/d.total*100)+'%' : '0%']),
                        ]}
                        onPrint={() => handlePrintReport('task_dept')}
                      />
                      <ReportCard
                        code="BC-CV02"
                        title="Chi tiết giao việc toàn công ty"
                        desc="Danh sách chi tiết tất cả nhiệm vụ đã giao: nhân viên, phòng ban, đầu việc, hạn hoàn thành, trạng thái."
                        icon={<ListTodo size={22} className="text-violet-500" />}
                        color="bg-violet-50 border-violet-100"
                        preview={[
                          ['Nhân viên', 'Phòng ban', 'Đầu việc', 'Hạn HT', 'TT'],
                          ...assignments.slice(0, 3).map(a => {
                            const emp = EMPLOYEES.find(e => e.id === a.employeeId);
                            const task = catalog.find(c => c.id === a.catalogId);
                            return [emp?.name||'', flatDepts.find(d=>d.id===a.departmentId)?.name||'', task?.name||'', a.deadline, a.status];
                          }),
                        ]}
                        onPrint={() => handlePrintReport('task_detail')}
                      />
                    </div>
                  </div>

                  {/* Booking reports */}
                  <div>
                    <h3 className="text-xs font-bold text-black/30 uppercase tracking-widest mb-3">Quản lý đặt chỗ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ReportCard
                        code="BC-DC01"
                        title="Thống kê sử dụng phòng họp"
                        desc="Lượt đặt, số giờ sử dụng, tỷ lệ trung bình theo từng phòng họp."
                        icon={<Building2 size={22} className="text-blue-500" />}
                        color="bg-sky-50 border-sky-100"
                        preview={[
                          ['Phòng', 'Tổng', 'Đã XN', 'Chờ', 'Hủy'],
                          ...ROOM_RESOURCES.map(r => {
                            const bk = bookings.filter(b => b.resourceId === r.id);
                            return [r.name, String(bk.length), String(bk.filter(b=>b.status==='Đã xác nhận').length), String(bk.filter(b=>b.status==='Chờ duyệt').length), String(bk.filter(b=>b.status==='Đã hủy').length)];
                          }),
                        ]}
                        onPrint={() => handlePrintReport('room_stats')}
                      />
                      <ReportCard
                        code="BC-DC02"
                        title="Thống kê sử dụng xe công tác"
                        desc="Lượt đi, tỷ lệ sử dụng, mức độ phê duyệt theo từng phương tiện."
                        icon={<Car size={22} className="text-purple-500" />}
                        color="bg-purple-50 border-purple-100"
                        preview={[
                          ['Xe', 'Tổng', 'Đã XN', 'Chờ'],
                          ...VEHICLE_RESOURCES.map(v => {
                            const bk = bookings.filter(b => b.resourceId === v.id);
                            return [v.name, String(bk.length), String(bk.filter(b=>b.status==='Đã xác nhận').length), String(bk.filter(b=>b.status==='Chờ duyệt').length)];
                          }),
                        ]}
                        onPrint={() => handlePrintReport('vehicle_stats')}
                      />
                      <ReportCard
                        code="BC-DC03"
                        title="Tổng hợp chi tiết đặt chỗ"
                        desc="Danh sách đầy đủ tất cả đặt chỗ: loại TN, người đặt, thời gian, mục đích, trạng thái."
                        icon={<CalendarDays size={22} className="text-emerald-500" />}
                        color="bg-emerald-50 border-emerald-100"
                        preview={[
                          ['Loại TN', 'Tài nguyên', 'Người đặt', 'Trạng thái'],
                          ...bookings.slice(0, 3).map(b => {
                            const emp = EMPLOYEES.find(e => e.id === b.userId);
                            const res = b.resourceType === 'Phòng họp' ? ROOM_RESOURCES.find(r=>r.id===b.resourceId)?.name : VEHICLE_RESOURCES.find(v=>v.id===b.resourceId)?.name;
                            return [b.resourceType, res||'', emp?.name||'', b.status];
                          }),
                        ]}
                        onPrint={() => handlePrintReport('booking_all')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-800">Danh mục công việc</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Quản lý các đầu việc chuẩn của tổ chức</p>
                </div>
                <button
                  onClick={() => { setEditingCatalog(null); setIsAddingCatalog(true); }}
                  className="bg-[#f97316] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#ea6c0a] transition-all text-sm font-medium shadow-sm"
                >
                  <Plus size={16} />
                  Thêm công việc
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={catalogSearch}
                    onChange={e => setCatalogSearch(e.target.value)}
                    placeholder="Tìm tên hoặc mã công việc..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <select
                  value={catalogFilterCategory}
                  onChange={e => setCatalogFilterCategory(e.target.value)}
                  className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 min-w-[160px]"
                >
                  <option value="">Tất cả nhóm việc</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={catalogFilterStatus}
                  onChange={e => setCatalogFilterStatus(e.target.value)}
                  className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 min-w-[160px]"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Đang sử dụng">Đang sử dụng</option>
                  <option value="Ngừng sử dụng">Ngừng sử dụng</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-3 py-3 font-semibold w-20">Mã CV</th>
                        <th className="px-3 py-3 font-semibold">Tên công việc</th>
                        <th className="px-3 py-3 font-semibold">Mô tả ngắn</th>
                        <th className="px-3 py-3 font-semibold w-28">Nhóm việc</th>
                        <th className="px-3 py-3 font-semibold w-36">Phòng ban</th>
                        <th className="px-3 py-3 font-semibold w-32">Trạng thái</th>
                        <th className="px-3 py-3 font-semibold w-24">Ngày tạo</th>
                        <th className="px-3 py-3 font-semibold w-32">Người tạo</th>
                        <th className="px-3 py-3 font-semibold text-right w-20">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredCatalog.map((item) => {
                        const dept = flatDepts.find(d => d.id === item.departmentId);
                        return (
                          <tr key={item.id} className={cn("hover:bg-orange-50/30 transition-colors", item.status === 'Ngừng sử dụng' && 'opacity-60')}>
                            <td className="px-3 py-3">
                              <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.code}</span>
                            </td>
                            <td className="px-3 py-3 font-semibold text-gray-800">
                              <div className="truncate max-w-[160px]">{item.name}</div>
                            </td>
                            <td className="px-3 py-3 text-gray-500">
                              <div className="truncate max-w-[180px] text-xs">{item.description}</div>
                            </td>
                            <td className="px-3 py-3">
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 whitespace-nowrap">{item.category}</span>
                            </td>
                            <td className="px-3 py-3 text-gray-500 text-xs">
                              <div className="truncate max-w-[130px]">{dept?.name || <span className="italic text-gray-300">Tất cả</span>}</div>
                            </td>
                            <td className="px-3 py-3">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap",
                                item.status === 'Đang sử dụng'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : 'bg-gray-100 text-gray-400 border-gray-200'
                              )}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                              {item.createdAt ? format(parseISO(item.createdAt), 'dd/MM/yyyy') : '—'}
                            </td>
                            <td className="px-3 py-3 text-gray-500 text-xs">
                              <div className="truncate max-w-[110px]">{item.createdBy}</div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => { setEditingCatalog(item); setIsAddingCatalog(true); }}
                                  className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors"
                                  title="Sửa"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleToggleCatalogStatus(item.id)}
                                  className={cn(
                                    "p-1.5 rounded transition-colors text-xs font-medium",
                                    item.status === 'Đang sử dụng'
                                      ? 'hover:bg-red-50 text-red-400'
                                      : 'hover:bg-emerald-50 text-emerald-500'
                                  )}
                                  title={item.status === 'Đang sử dụng' ? 'Ngừng sử dụng' : 'Kích hoạt lại'}
                                >
                                  {item.status === 'Đang sử dụng' ? <X size={14} /> : <Check size={14} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredCatalog.length === 0 && (
                        <tr>
                          <td colSpan={9} className="px-4 py-12 text-center text-gray-300 italic">Không tìm thấy công việc nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50 text-xs text-gray-400">
                  Hiển thị {filteredCatalog.length} / {catalog.length} công việc
                </div>
              </div>

              {/* Add / Edit Modal */}
              {isAddingCatalog && (
                <CatalogModal
                  catalog={editingCatalog || undefined}
                  flatDepts={flatDepts}
                  onClose={() => { setIsAddingCatalog(false); setEditingCatalog(null); }}
                  onSubmit={handleAddCatalog}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'assignments' && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Giao việc & Theo dõi</h2>
                  <p className="text-black/40 mt-1">Giao việc cho nhân viên và cập nhật tiến độ</p>
                </div>
                <button 
                  onClick={() => setIsAddingAssignment(true)}
                  className="bg-[#f97316] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#ea6c0a] transition-all shadow-sm text-sm font-medium"
                >
                  <Plus size={16} />
                  Giao việc mới
                </button>
              </header>

              {/* Assignment List */}
              <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black/5 text-left text-black/40">
                        <th className="p-4 font-medium">Công việc</th>
                        <th className="p-4 font-medium">Nhân viên</th>
                        <th className="p-4 font-medium">Phòng ban</th>
                        <th className="p-4 font-medium">Hạn hoàn thành</th>
                        <th className="p-4 font-medium">Trạng thái</th>
                        <th className="p-4 font-medium text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {assignments.map((a) => {
                        const task = catalog.find(c => c.id === a.catalogId);
                        const emp = EMPLOYEES.find(e => e.id === a.employeeId);
                        const dept = DEPARTMENTS.find(function findD(d: Department): boolean {
                          if (d.id === a.departmentId) return true;
                          return d.children?.some(findD) || false;
                        });

                        return (
                          <tr key={a.id} className="hover:bg-black/[0.02] transition-colors">
                            <td className="p-4">
                              <p className="font-bold">{task?.name || 'N/A'}</p>
                              <p className="text-xs text-black/40">{task?.category}</p>
                            </td>
                            <td className="p-4 font-medium">{emp?.name || 'N/A'}</td>
                            <td className="p-4 text-black/60">{dept?.name || 'N/A'}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-black/60">
                                <Calendar size={14} />
                                {format(parseISO(a.deadline), 'dd/MM/yyyy')}
                              </div>
                            </td>
                            <td className="p-4">
                              <StatusBadge status={a.status} />
                            </td>
                            <td className="p-4 text-right">
                              <select 
                                value={a.status}
                                onChange={(e) => updateStatus(a.id, e.target.value as TaskStatus)}
                                className="text-xs bg-black/5 border-none rounded-lg py-1 px-2 focus:ring-0"
                              >
                                <option value="Đang thực hiện">Đang thực hiện</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                      {assignments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-black/20 italic">Chưa có bản ghi giao việc nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {isAddingAssignment && (
                <AddAssignmentModal 
                  catalog={catalog}
                  onClose={() => setIsAddingAssignment(false)}
                  onSubmit={handleAddAssignment}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'room_bookings' && (
            <motion.div
              key="room_bookings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Building2 size={28} className="text-blue-500" />
                    Đặt phòng họp
                  </h2>
                  <p className="text-black/40 mt-1">Quản lý lịch sử dụng phòng họp trong tòa nhà</p>
                </div>
                <button
                  onClick={() => setIsAddingRoomBooking(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Plus size={18} />
                  Đặt phòng họp
                </button>
              </header>

              {/* Room summary cards */}
              <div className="grid grid-cols-3 gap-4">
                {ROOM_RESOURCES.map(room => {
                  const roomBookings = bookings.filter(b => b.resourceId === room.id && (b.status === 'Đã xác nhận'));
                  return (
                    <div key={room.id} className="bg-white rounded-xl border border-black/5 shadow-sm p-4 flex gap-3 items-start">
                      <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                        <Building2 size={20} className="text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm">{room.name}</p>
                        <p className="text-xs text-black/40">{room.floor} · {room.capacity} chỗ</p>
                        <p className="text-xs text-black/50 mt-1 truncate">{room.availableEquipment.slice(0, 2).join(', ')}{room.availableEquipment.length > 2 ? ` +${room.availableEquipment.length - 2}` : ''}</p>
                        <p className="text-[11px] text-blue-600 font-semibold mt-1">{roomBookings.length} lịch đặt</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black/5 text-left text-black/40">
                        <th className="p-4 font-medium">Phòng họp</th>
                        <th className="p-4 font-medium">Sức chứa</th>
                        <th className="p-4 font-medium">Thời gian sử dụng</th>
                        <th className="p-4 font-medium">Thiết bị dùng</th>
                        <th className="p-4 font-medium">Người tổ chức / Tham gia</th>
                        <th className="p-4 font-medium">Trạng thái</th>
                        <th className="p-4 font-medium text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {bookings.filter(b => b.resourceType === 'Phòng họp' && b.status === 'Đã xác nhận').map((b) => {
                        const room = ROOM_RESOURCES.find(r => r.id === b.resourceId);
                        const emp = EMPLOYEES.find(e => e.id === b.userId);
                        return (
                          <tr key={b.id} className="hover:bg-black/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Building2 size={16} className="text-blue-500 flex-shrink-0" />
                                <div>
                                  <p className="font-bold">{room?.name || 'N/A'}</p>
                                  <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded">{room?.floor || ''}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 text-black/60">
                                <Users size={13} />
                                <span className="font-medium">{room?.capacity ?? '—'} người</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-black/60">
                                  <Clock size={12} />
                                  <span>{format(parseISO(b.startTime), 'HH:mm dd/MM/yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-black/40">
                                  <div className="w-3 h-[1px] bg-black/20 ml-1" />
                                  <span>{format(parseISO(b.endTime), 'HH:mm dd/MM/yyyy')}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {b.equipment && b.equipment.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {b.equipment.slice(0, 2).map(eq => (
                                    <span key={eq} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{eq}</span>
                                  ))}
                                  {b.equipment.length > 2 && <span className="text-[10px] text-black/40">+{b.equipment.length - 2}</span>}
                                </div>
                              ) : <span className="text-black/20 italic text-xs">—</span>}
                            </td>
                            <td className="p-4">
                              <p className="font-medium text-sm">{emp?.name || 'N/A'}</p>
                              {b.participants && <p className="text-xs text-black/40 mt-0.5 truncate max-w-[180px]">{b.participants}</p>}
                              {b.purpose && <p className="text-xs text-black/50 italic truncate max-w-[180px]">{b.purpose}</p>}
                            </td>
                            <td className="p-4">
                              <BookingStatusBadge status={b.status} />
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setViewingBookingDetail(b)}
                                  className="p-2 hover:bg-black/5 text-black/30 rounded-lg transition-colors"
                                  title="Xem chi tiết & lịch sử"
                                >
                                  <Eye size={16} />
                                </button>
                                {b.status !== 'Đã hủy' && b.status !== 'Từ chối' && (
                                  <>
                                    <button
                                      onClick={() => setEditingBooking(b)}
                                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                      title="Sửa"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        const reason = window.prompt('Nhập lý do hủy:');
                                        if (reason) handleCancelBooking(b.id, reason);
                                      }}
                                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                      title="Hủy"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {bookings.filter(b => b.resourceType === 'Phòng họp' && b.status === 'Đã xác nhận').length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-black/20 italic">Chưa có lịch đặt phòng họp nào được xác nhận</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {(isAddingRoomBooking || (editingBooking && editingBooking.resourceType === 'Phòng họp')) && (
                <AddRoomBookingModal
                  booking={editingBooking && editingBooking.resourceType === 'Phòng họp' ? editingBooking : undefined}
                  onClose={() => { setIsAddingRoomBooking(false); setEditingBooking(null); }}
                  onSubmit={handleBookingSubmit}
                  checkConflict={checkConflict}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'vehicle_bookings' && (
            <motion.div
              key="vehicle_bookings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Car size={28} className="text-purple-500" />
                    Đặt xe công tác
                  </h2>
                  <p className="text-black/40 mt-1">Quản lý yêu cầu và lịch sử dụng xe công tác</p>
                </div>
                <button
                  onClick={() => setIsAddingVehicleBooking(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                >
                  <Plus size={18} />
                  Đặt xe công tác
                </button>
              </header>

              {/* Vehicle summary cards */}
              <div className="grid grid-cols-3 gap-4">
                {VEHICLE_RESOURCES.map(vehicle => {
                  const vehicleBookings = bookings.filter(b => b.resourceId === vehicle.id && b.status !== 'Đã hủy' && b.status !== 'Từ chối');
                  return (
                    <div key={vehicle.id} className="bg-white rounded-xl border border-black/5 shadow-sm p-4 flex gap-3 items-start">
                      <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                        <Car size={20} className="text-purple-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm">{vehicle.name}</p>
                        <p className="text-xs text-black/40">{vehicle.vehicleType} · {vehicle.seats} chỗ · {vehicle.plateNumber}</p>
                        <p className="text-xs text-black/50 mt-1">Tài xế: {vehicle.defaultDriver}</p>
                        <p className="text-[11px] text-purple-600 font-semibold mt-1">{vehicleBookings.length} lịch đặt</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black/5 text-left text-black/40">
                        <th className="p-4 font-medium">Phương tiện</th>
                        <th className="p-4 font-medium">Hành trình</th>
                        <th className="p-4 font-medium">Thời gian đi / về</th>
                        <th className="p-4 font-medium">Người yêu cầu / Số người</th>
                        <th className="p-4 font-medium">Mục đích công tác</th>
                        <th className="p-4 font-medium">Tài xế</th>
                        <th className="p-4 font-medium">Trạng thái</th>
                        <th className="p-4 font-medium text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {bookings.filter(b => b.resourceType === 'Xe công tác' && b.status === 'Đã xác nhận').map((b) => {
                        const vehicle = VEHICLE_RESOURCES.find(v => v.id === b.resourceId);
                        const emp = EMPLOYEES.find(e => e.id === b.userId);
                        return (
                          <tr key={b.id} className="hover:bg-black/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Car size={16} className="text-purple-500 flex-shrink-0" />
                                <div>
                                  <p className="font-bold">{vehicle?.name || 'N/A'}</p>
                                  <span className="text-[10px] bg-purple-50 text-purple-600 font-semibold px-1.5 py-0.5 rounded">{vehicle?.vehicleType || ''} · {vehicle?.plateNumber || ''}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {b.departure || b.destination ? (
                                <div className="space-y-0.5">
                                  <p className="text-sm font-medium">{b.departure || '—'}</p>
                                  <div className="flex items-center gap-1 text-black/30 text-xs">
                                    <div className="w-3 h-[1px] bg-black/20" />
                                    <span>đến</span>
                                  </div>
                                  <p className="text-sm font-medium">{b.destination || '—'}</p>
                                </div>
                              ) : <span className="text-black/20 italic text-xs">—</span>}
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-black/60">
                                  <Clock size={12} />
                                  <span>{format(parseISO(b.startTime), 'HH:mm dd/MM/yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-black/40">
                                  <div className="w-3 h-[1px] bg-black/20 ml-1" />
                                  <span>{format(parseISO(b.endTime), 'HH:mm dd/MM/yyyy')}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-medium text-sm">{emp?.name || 'N/A'}</p>
                              {b.passengerCount && (
                                <div className="flex items-center gap-1 text-xs text-black/40 mt-0.5">
                                  <Users size={11} />
                                  <span>{b.passengerCount} người</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-black/60 max-w-[160px] truncate text-xs">{b.purpose}</td>
                            <td className="p-4 text-sm font-medium text-black/60">{b.driver || vehicle?.defaultDriver || '—'}</td>
                            <td className="p-4">
                              <BookingStatusBadge status={b.status} />
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setViewingBookingDetail(b)}
                                  className="p-2 hover:bg-black/5 text-black/30 rounded-lg transition-colors"
                                  title="Xem chi tiết & lịch sử"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => setEditingBooking(b)}
                                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                  title="Sửa"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = window.prompt('Nhập lý do hủy:');
                                    if (reason) handleCancelBooking(b.id, reason);
                                  }}
                                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                  title="Hủy"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {bookings.filter(b => b.resourceType === 'Xe công tác' && b.status === 'Đã xác nhận').length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-12 text-center text-black/20 italic">Chưa có lịch đặt xe nào được xác nhận</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {(isAddingVehicleBooking || (editingBooking && editingBooking.resourceType === 'Xe công tác')) && (
                <AddVehicleBookingModal
                  booking={editingBooking && editingBooking.resourceType === 'Xe công tác' ? editingBooking : undefined}
                  onClose={() => { setIsAddingVehicleBooking(false); setEditingBooking(null); }}
                  onSubmit={handleBookingSubmit}
                  checkConflict={checkConflict}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'booking_approval' && (
            <motion.div
              key="booking_approval"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <header>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <CheckSquare size={28} className="text-emerald-500" />
                  Phê duyệt đặt chỗ
                </h2>
                <p className="text-black/40 mt-1">Xem xét và phê duyệt các yêu cầu đặt phòng họp, xe công tác</p>
              </header>

              {/* Resource type outer pills */}
              <div className="flex gap-2">
                {(['Phòng họp', 'Xe công tác'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setApprovalSubTab(tab); setApprovalStatusFilter('Tất cả'); }}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all',
                      approvalSubTab === tab
                        ? tab === 'Phòng họp'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                          : 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
                        : 'bg-white text-black/50 border-black/10 hover:border-black/20 hover:text-black/70'
                    )}
                  >
                    {tab === 'Phòng họp' ? <Building2 size={15} /> : <Car size={15} />}
                    {tab}
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      approvalSubTab === tab ? 'bg-white/20 text-white' : 'bg-black/8 text-black/40'
                    )}>
                      {bookings.filter(b => b.resourceType === tab && (b.status === 'Chờ duyệt' || b.status === 'Đã xác nhận' || b.status === 'Từ chối')).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main card with status underline tabs + table */}
              <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                {(() => {
                  const base = bookings.filter(b =>
                    b.resourceType === approvalSubTab &&
                    (b.status === 'Chờ duyệt' || b.status === 'Đã xác nhận' || b.status === 'Từ chối')
                  );
                  const counts: Record<string, number> = {
                    'Tất cả': base.length,
                    'Chờ duyệt': base.filter(b => b.status === 'Chờ duyệt').length,
                    'Đã xác nhận': base.filter(b => b.status === 'Đã xác nhận').length,
                    'Từ chối': base.filter(b => b.status === 'Từ chối').length,
                  };
                  const filtered = (approvalStatusFilter === 'Tất cả' ? base : base.filter(b => b.status === approvalStatusFilter))
                    .sort((a, b_) => {
                      const order: Record<string, number> = { 'Chờ duyệt': 0, 'Đã xác nhận': 1, 'Từ chối': 2 };
                      return (order[a.status] ?? 3) - (order[b_.status] ?? 3);
                    });
                  const statusTabs: { label: string; value: 'Tất cả' | 'Chờ duyệt' | 'Đã xác nhận' | 'Từ chối' }[] = [
                    { label: 'Tất cả', value: 'Tất cả' },
                    { label: 'Chờ phê duyệt', value: 'Chờ duyệt' },
                    { label: 'Đã phê duyệt', value: 'Đã xác nhận' },
                    { label: 'Từ chối', value: 'Từ chối' },
                  ];
                  return (
                    <>
                      {/* Underline status tab bar */}
                      <div className="flex border-b border-black/8 px-2">
                        {statusTabs.map(st => (
                          <button
                            key={st.value}
                            onClick={() => setApprovalStatusFilter(st.value)}
                            className={cn(
                              'relative px-4 py-3.5 text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap',
                              approvalStatusFilter === st.value
                                ? 'text-[#1a1a2e]'
                                : 'text-black/40 hover:text-black/60'
                            )}
                          >
                            {st.label}
                            <span className={cn(
                              'text-xs rounded px-1',
                              approvalStatusFilter === st.value ? 'text-black/50 font-semibold' : 'text-black/30'
                            )}>({counts[st.value]})</span>
                            {approvalStatusFilter === st.value && (
                              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-t" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        {approvalSubTab === 'Phòng họp' ? (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-black/5 text-left text-black/40">
                                <th className="p-4 font-medium">Phòng họp</th>
                                <th className="p-4 font-medium">Thời gian</th>
                                <th className="p-4 font-medium">Thiết bị</th>
                                <th className="p-4 font-medium">Người tổ chức / Tham gia</th>
                                <th className="p-4 font-medium">Mục đích</th>
                                <th className="p-4 font-medium">Trạng thái</th>
                                <th className="p-4 font-medium text-right">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                              {filtered.map((b) => {
                                const room = ROOM_RESOURCES.find(r => r.id === b.resourceId);
                                const emp = EMPLOYEES.find(e => e.id === b.userId);
                                return (
                                  <tr key={b.id} className={cn(
                                    'hover:bg-black/[0.02] transition-colors',
                                    b.status === 'Chờ duyệt' && 'bg-amber-50/40'
                                  )}>
                                    <td className="p-4">
                                      <div className="flex items-center gap-2">
                                        <Building2 size={15} className="text-blue-500 flex-shrink-0" />
                                        <div>
                                          <p className="font-bold text-sm">{room?.name || 'N/A'}</p>
                                          <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded">{room?.floor}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-black/60">
                                          <Clock size={11} />
                                          <span className="text-xs">{format(parseISO(b.startTime), 'HH:mm dd/MM/yyyy')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-black/40">
                                          <div className="w-2.5 h-[1px] bg-black/20 ml-0.5" />
                                          <span className="text-xs">{format(parseISO(b.endTime), 'HH:mm dd/MM/yyyy')}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      {b.equipment && b.equipment.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                          {b.equipment.slice(0, 2).map(eq => (
                                            <span key={eq} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{eq}</span>
                                          ))}
                                          {b.equipment.length > 2 && <span className="text-[10px] text-black/40">+{b.equipment.length - 2}</span>}
                                        </div>
                                      ) : <span className="text-black/20 italic text-xs">—</span>}
                                    </td>
                                    <td className="p-4">
                                      <p className="font-medium text-sm">{emp?.name || 'N/A'}</p>
                                      {b.participants && <p className="text-xs text-black/40 truncate max-w-[160px]">{b.participants}</p>}
                                    </td>
                                    <td className="p-4 text-black/60 text-xs max-w-[160px] truncate">{b.purpose}</td>
                                    <td className="p-4"><BookingStatusBadge status={b.status} /></td>
                                    <td className="p-4 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button
                                          onClick={() => setViewingBookingDetail(b)}
                                          className="p-1.5 hover:bg-black/5 text-black/30 rounded-lg transition-colors"
                                          title="Xem chi tiết"
                                        >
                                          <Eye size={14} />
                                        </button>
                                        {b.status === 'Chờ duyệt' && (
                                          <>
                                            <button onClick={() => handleApproveBooking(b.id, true)}
                                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors">
                                              <Check size={13} /> Duyệt
                                            </button>
                                            <button onClick={() => handleApproveBooking(b.id, false)}
                                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">
                                              <X size={13} /> Từ chối
                                            </button>
                                          </>
                                        )}
                                        {b.status === 'Đã xác nhận' && (
                                          <button onClick={() => { const r = window.prompt('Nhập lý do hủy:'); if (r) handleCancelBooking(b.id, r); }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg text-xs font-semibold transition-colors">
                                            <X size={13} /> Hủy
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              {filtered.length === 0 && (
                                <tr><td colSpan={7} className="p-12 text-center text-black/20 italic">Không có bản ghi nào</td></tr>
                              )}
                            </tbody>
                          </table>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-black/5 text-left text-black/40">
                                <th className="p-4 font-medium">Phương tiện</th>
                                <th className="p-4 font-medium">Hành trình</th>
                                <th className="p-4 font-medium">Thời gian đi / về</th>
                                <th className="p-4 font-medium">Người yêu cầu / Số người</th>
                                <th className="p-4 font-medium">Mục đích công tác</th>
                                <th className="p-4 font-medium">Tài xế</th>
                                <th className="p-4 font-medium">Trạng thái</th>
                                <th className="p-4 font-medium text-right">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                              {filtered.map((b) => {
                                const vehicle = VEHICLE_RESOURCES.find(v => v.id === b.resourceId);
                                const emp = EMPLOYEES.find(e => e.id === b.userId);
                                return (
                                  <tr key={b.id} className={cn(
                                    'hover:bg-black/[0.02] transition-colors',
                                    b.status === 'Chờ duyệt' && 'bg-amber-50/40'
                                  )}>
                                    <td className="p-4">
                                      <div className="flex items-center gap-2">
                                        <Car size={15} className="text-purple-500 flex-shrink-0" />
                                        <div>
                                          <p className="font-bold text-sm">{vehicle?.name || 'N/A'}</p>
                                          <span className="text-[10px] bg-purple-50 text-purple-600 font-semibold px-1.5 py-0.5 rounded">{vehicle?.vehicleType} · {vehicle?.plateNumber}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      {b.departure || b.destination ? (
                                        <div className="space-y-0.5">
                                          <p className="text-xs font-medium">{b.departure || '—'}</p>
                                          <div className="flex items-center gap-1 text-black/30 text-[10px]">
                                            <div className="w-3 h-[1px] bg-black/20" /><span>đến</span>
                                          </div>
                                          <p className="text-xs font-medium">{b.destination || '—'}</p>
                                        </div>
                                      ) : <span className="text-black/20 italic text-xs">—</span>}
                                    </td>
                                    <td className="p-4">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-black/60"><Clock size={11} /><span className="text-xs">{format(parseISO(b.startTime), 'HH:mm dd/MM/yyyy')}</span></div>
                                        <div className="flex items-center gap-1.5 text-black/40"><div className="w-2.5 h-[1px] bg-black/20 ml-0.5" /><span className="text-xs">{format(parseISO(b.endTime), 'HH:mm dd/MM/yyyy')}</span></div>
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      <p className="font-medium text-sm">{emp?.name || 'N/A'}</p>
                                      {b.passengerCount && <div className="flex items-center gap-1 text-xs text-black/40 mt-0.5"><Users size={11} /><span>{b.passengerCount} người</span></div>}
                                    </td>
                                    <td className="p-4 text-black/60 text-xs max-w-[140px] truncate">{b.purpose}</td>
                                    <td className="p-4 text-sm font-medium text-black/60">{b.driver || vehicle?.defaultDriver || '—'}</td>
                                    <td className="p-4"><BookingStatusBadge status={b.status} /></td>
                                    <td className="p-4 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button
                                          onClick={() => setViewingBookingDetail(b)}
                                          className="p-1.5 hover:bg-black/5 text-black/30 rounded-lg transition-colors"
                                          title="Xem chi tiết"
                                        >
                                          <Eye size={14} />
                                        </button>
                                        {b.status === 'Chờ duyệt' && (
                                          <>
                                            <button onClick={() => handleApproveBooking(b.id, true)}
                                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors">
                                              <Check size={13} /> Duyệt
                                            </button>
                                            <button onClick={() => handleApproveBooking(b.id, false)}
                                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">
                                              <X size={13} /> Từ chối
                                            </button>
                                          </>
                                        )}
                                        {b.status === 'Đã xác nhận' && (
                                          <button onClick={() => { const r = window.prompt('Nhập lý do hủy:'); if (r) handleCancelBooking(b.id, r); }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg text-xs font-semibold transition-colors">
                                            <X size={13} /> Hủy
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              {filtered.length === 0 && (
                                <tr><td colSpan={8} className="p-12 text-center text-black/20 italic">Không có bản ghi nào</td></tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {activeTab === 'booking_logs' && (
            <motion.div
              key="booking_logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <header>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <History size={28} className="text-slate-500" />
                  Nhật ký đặt chỗ
                </h2>
                <p className="text-black/40 mt-1">Tra cứu toàn bộ lịch sử thao tác, thay đổi và hủy lịch</p>
              </header>

              {/* Toolbar */}
              <div className="bg-white rounded-xl border border-black/5 p-3 flex flex-wrap gap-2 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    value={logSearch}
                    onChange={e => setLogSearch(e.target.value)}
                    placeholder="Tìm người TH, chi tiết, mã booking..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-black/8 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <select value={logTypeFilter} onChange={e => setLogTypeFilter(e.target.value)}
                  className="py-2 px-3 text-sm border border-black/8 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 bg-white">
                  <option value="">Tất cả loại TN</option>
                  <option value="Phòng họp">Phòng họp</option>
                  <option value="Xe công tác">Xe công tác</option>
                </select>
                <select value={logActionFilter} onChange={e => setLogActionFilter(e.target.value)}
                  className="py-2 px-3 text-sm border border-black/8 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 bg-white">
                  <option value="">Tất cả hành động</option>
                  {['Tạo mới','Xác nhận','Từ chối','Đổi thời gian','Đổi tài nguyên','Hủy lịch','Sửa thông tin','Gửi xác nhận','Gửi nhắc lịch','Hệ thống hủy','Hệ thống hoàn thành'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <input type="date" value={logDateFrom} onChange={e => setLogDateFrom(e.target.value)}
                  className="py-2 px-3 text-sm border border-black/8 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10" />
                <span className="text-black/20 text-xs">–</span>
                <input type="date" value={logDateTo} onChange={e => setLogDateTo(e.target.value)}
                  className="py-2 px-3 text-sm border border-black/8 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10" />
                {(logSearch || logTypeFilter || logActionFilter || logDateFrom || logDateTo) && (
                  <button
                    onClick={() => { setLogSearch(''); setLogTypeFilter(''); setLogActionFilter(''); setLogDateFrom(''); setLogDateTo(''); }}
                    className="px-3 py-2 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>

              {(() => {
                const filteredLogs = bookingLogs.filter(log => {
                  const rType = log.resourceType || bookings.find(b => b.id === log.bookingId)?.resourceType;
                  if (logSearch) {
                    const q = logSearch.toLowerCase();
                    if (!log.details.toLowerCase().includes(q) && !log.performedBy.toLowerCase().includes(q) && !log.bookingId.toLowerCase().includes(q) && !(log.reason || '').toLowerCase().includes(q)) return false;
                  }
                  if (logTypeFilter && rType !== logTypeFilter) return false;
                  if (logActionFilter && log.action !== logActionFilter) return false;
                  if (logDateFrom && log.timestamp.slice(0, 10) < logDateFrom) return false;
                  if (logDateTo && log.timestamp.slice(0, 10) > logDateTo) return false;
                  return true;
                });
                return (
                  <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-black/5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-black/60">{filteredLogs.length} bản ghi</span>
                      <span className="text-xs text-black/30">Sắp xếp theo thời gian mới nhất</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-black/5 text-left text-black/40">
                            <th className="p-4 font-medium whitespace-nowrap">Thời gian</th>
                            <th className="p-4 font-medium">Mã booking</th>
                            <th className="p-4 font-medium">Loại TN</th>
                            <th className="p-4 font-medium">Tài nguyên</th>
                            <th className="p-4 font-medium">Người TH</th>
                            <th className="p-4 font-medium">Hành động</th>
                            <th className="p-4 font-medium">Giá trị cũ</th>
                            <th className="p-4 font-medium">Giá trị mới</th>
                            <th className="p-4 font-medium">Lý do / Chi tiết</th>
                            <th className="p-4 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                          {filteredLogs.map(log => {
                            const booking = bookings.find(b => b.id === log.bookingId);
                            const rType = log.resourceType || booking?.resourceType;
                            const resId = log.resourceId || booking?.resourceId;
                            const resourceName = rType === 'Phòng họp'
                              ? ROOM_RESOURCES.find(r => r.id === resId)?.name
                              : VEHICLE_RESOURCES.find(v => v.id === resId)?.name;
                            return (
                              <tr key={log.id} className="hover:bg-black/[0.02] transition-colors">
                                <td className="p-4 text-black/60 text-xs whitespace-nowrap">
                                  {format(parseISO(log.timestamp), 'HH:mm dd/MM/yyyy')}
                                </td>
                                <td className="p-4">
                                  <span className="font-mono text-xs bg-black/5 px-1.5 py-0.5 rounded text-black/50">#{log.bookingId}</span>
                                </td>
                                <td className="p-4">
                                  {rType && (
                                    <span className={cn(
                                      'text-[10px] font-bold px-1.5 py-0.5 rounded',
                                      rType === 'Phòng họp' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                    )}>{rType}</span>
                                  )}
                                </td>
                                <td className="p-4 text-sm text-black/70">{resourceName || '—'}</td>
                                <td className="p-4">
                                  <p className="font-medium text-sm">{log.performedBy}</p>
                                  <span className={cn(
                                    'text-[10px] px-1 py-0.5 rounded',
                                    log.actor === 'system' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'
                                  )}>{log.actor === 'system' ? 'Hệ thống' : 'Người dùng'}</span>
                                </td>
                                <td className="p-4"><LogActionBadge action={log.action} /></td>
                                <td className="p-4 text-xs text-black/40 max-w-[130px]">
                                  <span className="truncate block" title={log.oldValue}>{log.oldValue || '—'}</span>
                                </td>
                                <td className="p-4 text-xs text-black/70 max-w-[130px]">
                                  <span className="truncate block" title={log.newValue}>{log.newValue || '—'}</span>
                                </td>
                                <td className="p-4 text-xs text-black/60 max-w-[200px]">
                                  <span className="truncate block" title={log.reason || log.details}>{log.reason || log.details}</span>
                                </td>
                                <td className="p-4">
                                  {booking && (
                                    <button
                                      onClick={() => setViewingBookingDetail(booking)}
                                      className="p-1.5 hover:bg-black/5 text-black/30 hover:text-black/60 rounded transition-colors"
                                      title="Xem chi tiết booking"
                                    >
                                      <Eye size={14} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {filteredLogs.length === 0 && (
                            <tr><td colSpan={10} className="p-12 text-center text-black/20 italic">Không có bản ghi nào</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        </main>
      </div>
      {viewingBookingDetail && (
        <AnimatePresence>
          <BookingDetailModal
            booking={viewingBookingDetail}
            allLogs={bookingLogs}
            onClose={() => setViewingBookingDetail(null)}
            onEdit={(b) => { setEditingBooking(b); setViewingBookingDetail(null); }}
            onCancel={handleCancelBooking}
            onApprove={handleApproveBooking}
          />
        </AnimatePresence>
      )}
    </div>
  );
}

// --- Subcomponents ---

function LogActionBadge({ action }: { action: string }) {
  const colorMap: Record<string, string> = {
    'Tạo mới':             'bg-blue-50 text-blue-600',
    'Xác nhận':            'bg-emerald-50 text-emerald-600',
    'Từ chối':             'bg-red-50 text-red-500',
    'Đổi thời gian':       'bg-amber-50 text-amber-600',
    'Đổi tài nguyên':      'bg-orange-50 text-orange-600',
    'Đổi người dùng':      'bg-violet-50 text-violet-600',
    'Hủy lịch':            'bg-red-50 text-red-600',
    'Sửa thông tin':       'bg-sky-50 text-sky-600',
    'Gửi xác nhận':        'bg-teal-50 text-teal-600',
    'Gửi nhắc lịch':       'bg-teal-50 text-teal-500',
    'Hệ thống hủy':        'bg-gray-100 text-gray-500',
    'Hệ thống hoàn thành': 'bg-green-50 text-green-600',
  };
  return (
    <span className={cn(
      'px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap',
      colorMap[action] || 'bg-black/5 text-black/50'
    )}>
      {action}
    </span>
  );
}

function BookingDetailModal({
  booking, allLogs, onClose, onEdit, onCancel, onApprove,
}: {
  booking: Booking;
  allLogs: BookingLog[];
  onClose: () => void;
  onEdit: (b: Booking) => void;
  onCancel: (id: string, reason: string) => void;
  onApprove?: (id: string, approve: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const history = [...allLogs.filter(l => l.bookingId === booking.id)].sort(
    (a, b) => a.timestamp.localeCompare(b.timestamp)
  );
  const room = ROOM_RESOURCES.find(r => r.id === booking.resourceId);
  const vehicle = VEHICLE_RESOURCES.find(v => v.id === booking.resourceId);
  const emp = EMPLOYEES.find(e => e.id === booking.userId);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-black/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              {booking.resourceType === 'Phòng họp'
                ? <Building2 size={18} className="text-blue-500" />
                : <Car size={18} className="text-purple-500" />}
              <h3 className="text-lg font-bold">{booking.resourceType === 'Phòng họp' ? (room?.name || 'N/A') : (vehicle?.name || 'N/A')}</h3>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-black/40 font-mono">#{booking.id} · Tạo lúc {format(parseISO(booking.createdAt), 'HH:mm dd/MM/yyyy')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/30">
            <X size={18} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-black/8 px-5">
          {([
            { id: 'info', label: 'Thông tin đặt chỗ' },
            { id: 'history', label: `Lịch sử thay đổi (${history.length})` },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'relative py-3 px-3 mr-2 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === t.id ? 'text-black' : 'text-black/40 hover:text-black/60'
              )}
            >
              {t.label}
              {activeTab === t.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-t" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="bg-black/[0.02] rounded-xl p-4 space-y-3">
                <h4 className="text-[11px] font-semibold text-black/40 uppercase tracking-wider">Tài nguyên</h4>
                {booking.resourceType === 'Phòng họp' && room ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-black/40 text-xs">Phòng</p><p className="font-semibold">{room.name}</p></div>
                    <div><p className="text-black/40 text-xs">Tầng</p><p className="font-semibold">{room.floor}</p></div>
                    <div><p className="text-black/40 text-xs">Sức chứa</p><p className="font-semibold">{room.capacity} người</p></div>
                    <div><p className="text-black/40 text-xs">Tham gia</p><p className="font-semibold">{booking.participants || '—'}</p></div>
                    {booking.equipment && booking.equipment.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-black/40 text-xs mb-1">Thiết bị yêu cầu</p>
                        <div className="flex flex-wrap gap-1">
                          {booking.equipment.map(eq => <span key={eq} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{eq}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : vehicle ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-black/40 text-xs">Xe</p><p className="font-semibold">{vehicle.name}</p></div>
                    <div><p className="text-black/40 text-xs">Biển số</p><p className="font-semibold font-mono">{vehicle.plateNumber}</p></div>
                    <div><p className="text-black/40 text-xs">Tài xế</p><p className="font-semibold">{booking.driver || vehicle.defaultDriver}</p></div>
                    <div><p className="text-black/40 text-xs">Số hành khách</p><p className="font-semibold">{booking.passengerCount || '—'}</p></div>
                    <div><p className="text-black/40 text-xs">Điểm đi</p><p className="font-semibold">{booking.departure || '—'}</p></div>
                    <div><p className="text-black/40 text-xs">Điểm đến</p><p className="font-semibold">{booking.destination || '—'}</p></div>
                  </div>
                ) : null}
              </div>

              <div className="bg-black/[0.02] rounded-xl p-4 space-y-3">
                <h4 className="text-[11px] font-semibold text-black/40 uppercase tracking-wider">Thông tin lịch</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-black/40 text-xs">Bắt đầu</p><p className="font-semibold">{format(parseISO(booking.startTime), 'HH:mm, dd/MM/yyyy')}</p></div>
                  <div><p className="text-black/40 text-xs">Kết thúc</p><p className="font-semibold">{format(parseISO(booking.endTime), 'HH:mm, dd/MM/yyyy')}</p></div>
                  <div><p className="text-black/40 text-xs">Người đặt</p><p className="font-semibold">{emp?.name || '—'}</p></div>
                  <div><p className="text-black/40 text-xs">Tạo lúc</p><p className="font-semibold">{format(parseISO(booking.createdAt), 'HH:mm dd/MM/yyyy')}</p></div>
                  <div className="col-span-2"><p className="text-black/40 text-xs">Mục đích</p><p className="font-medium">{booking.purpose}</p></div>
                  {booking.cancelReason && (
                    <div className="col-span-2">
                      <p className="text-black/40 text-xs">Lý do hủy / từ chối</p>
                      <p className="font-medium text-red-500">{booking.cancelReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {history.length === 0 ? (
                <p className="text-center text-black/20 italic py-10">Chưa có lịch sử thao tác</p>
              ) : (
                <div>
                  {history.map((log, idx) => (
                    <div key={log.id} className="flex gap-4">
                      <div className="flex flex-col items-center pt-0.5">
                        <div className={cn(
                          'w-2.5 h-2.5 rounded-full flex-shrink-0',
                          log.action === 'Hủy lịch' || log.action === 'Từ chối' ? 'bg-red-400' :
                          log.action === 'Xác nhận' || log.action === 'Gửi xác nhận' ? 'bg-emerald-500' :
                          log.action === 'Tạo mới' ? 'bg-blue-500' :
                          log.actor === 'system' ? 'bg-slate-300' : 'bg-orange-400'
                        )} />
                        {idx < history.length - 1 && <div className="w-[1.5px] flex-1 bg-black/8 my-1" />}
                      </div>
                      <div className="pb-5 flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-0.5">
                          <span className="text-[11px] text-black/40">{format(parseISO(log.timestamp), 'HH:mm  dd/MM/yyyy')}</span>
                          <LogActionBadge action={log.action} />
                        </div>
                        <p className="text-sm text-black/80">
                          <span className="font-semibold">{log.performedBy}</span>
                          {' — '}{log.details}
                        </p>
                        {(log.oldValue || log.newValue) && (
                          <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs">
                            {log.oldValue && <span className="bg-red-50 text-red-500 line-through px-2 py-0.5 rounded">{log.oldValue}</span>}
                            {log.oldValue && log.newValue && <span className="text-black/30">→</span>}
                            {log.newValue && <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded">{log.newValue}</span>}
                          </div>
                        )}
                        {log.reason && (
                          <p className="mt-1 text-xs text-black/40 italic">Lý do: {log.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {(booking.status === 'Chờ duyệt' || booking.status === 'Đã xác nhận') && (
          <div className="p-4 border-t border-black/5 flex justify-end gap-2 flex-wrap">
            {booking.status === 'Chờ duyệt' && onApprove && (
              <>
                <button onClick={() => { onApprove(booking.id, false); onClose(); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                  <X size={14} /> Từ chối
                </button>
                <button onClick={() => { onApprove(booking.id, true); onClose(); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors">
                  <Check size={14} /> Duyệt
                </button>
              </>
            )}
            <button onClick={() => { onEdit(booking); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2 border border-black/10 hover:bg-black/5 text-black/60 rounded-xl text-sm font-semibold transition-colors">
              <Edit2 size={14} /> Chỉnh sửa
            </button>
            {booking.status === 'Đã xác nhận' && (
              <button onClick={() => { const r = window.prompt('Nhập lý do hủy:'); if (r) { onCancel(booking.id, r); onClose(); } }}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-500 rounded-xl text-sm font-semibold transition-colors">
                <X size={14} /> Hủy lịch
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}



function SideNavItem({ active, onClick, icon, label, expanded, sub }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, expanded: boolean, sub?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      className={cn(
        "w-full flex items-center transition-all duration-200 group relative",
        expanded ? `py-2 gap-3 rounded-lg ${sub ? 'pl-8 pr-3 ml-0' : 'px-4 mx-2'}` : "justify-center py-3 w-full",
        active
          ? "text-white bg-white/10"
          : "text-white/40 hover:text-white/70 hover:bg-white/5"
      )}
    >
      {active && !sub && (
        <div className="absolute left-0 w-0.5 h-5 bg-[#f97316] rounded-r" />
      )}
      {active && sub && expanded && (
        <div className="absolute left-[1.4rem] w-0.5 h-4 bg-[#f97316] rounded" />
      )}
      <span className={active ? "text-white" : ""}>{icon}</span>
      {expanded && <span className={cn("text-sm truncate", sub ? "font-normal" : "font-medium")}>{label}</span>}
    </button>
  );
}

function SideNavGroup({ label, icon, expanded, open, onToggle, active, children }: {
  label: string,
  icon: React.ReactNode,
  expanded: boolean,
  open: boolean,
  onToggle: () => void,
  active: boolean,
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Group header */}
      <button
        onClick={onToggle}
        title={!expanded ? label : undefined}
        className={cn(
          "w-full flex items-center transition-all duration-200 relative",
          expanded ? "px-4 py-2.5 gap-3" : "justify-center py-3",
          active ? "text-white" : "text-white/40 hover:text-white/70"
        )}
      >
        {active && (
          <div className="absolute left-0 w-0.5 h-5 bg-[#f97316] rounded-r" />
        )}
        <span className={active ? "text-white" : ""}>{icon}</span>
        {expanded && (
          <>
            <span className="text-sm font-medium truncate flex-1 text-left">{label}</span>
            <ChevronDown
              size={14}
              className={cn("transition-transform duration-200 flex-shrink-0", open ? "rotate-0" : "-rotate-90")}
            />
          </>
        )}
      </button>
      {/* Sub-items: show when open (expanded sidebar) or always show as icons (collapsed sidebar) */}
      {(open || !expanded) && (
        <div className={cn(expanded ? "ml-0" : "flex flex-col")}>
          {children}
        </div>
      )}
    </div>
  );
}

function TopbarIcon({ icon, active }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={cn(
      "w-7 h-7 flex items-center justify-center rounded transition-colors",
      active ? "text-gray-700 bg-gray-100" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
    )}>
      {icon}
    </button>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active 
          ? "bg-black text-white shadow-md shadow-black/10" 
          : "text-black/60 hover:bg-black/5 hover:text-black"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
    </button>
  );
}

function StatCard({ label, value, icon, trend }: { label: string, value: number, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-black/5 rounded-lg">{icon}</div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <p className="text-black/40 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
    </div>
  );
}

function ReportCard({
  code, title, desc, icon, color, preview, onPrint,
}: {
  code: string; title: string; desc: string;
  icon: React.ReactNode; color: string;
  preview: string[][]; onPrint: () => void;
}) {
  const [headers, ...rows] = preview;
  return (
    <div className={cn('flex flex-col rounded-2xl border p-5 bg-white gap-4', color)}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white shadow-sm border border-black/5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-black/30 tracking-widest uppercase">{code}</p>
          <p className="font-semibold text-sm leading-tight mt-0.5">{title}</p>
          <p className="text-xs text-black/40 mt-1 line-clamp-2">{desc}</p>
        </div>
      </div>
      {headers && (
        <div className="overflow-hidden rounded-lg border border-black/8 bg-white">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-black/4">
                {headers.map((h, i) => <th key={i} className="px-2 py-1.5 text-left font-semibold text-black/50 truncate max-w-[80px]">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-t border-black/5">
                  {row.map((cell, ci) => <td key={ci} className="px-2 py-1.5 text-black/70 truncate max-w-[80px]">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={onPrint}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-black/80 transition-colors mt-auto">
        <Printer size={13} /> In báo cáo
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    'Đang thực hiện': 'bg-blue-50 text-blue-600 border-blue-100',
    'Hoàn thành': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Trễ hạn': 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold border", styles[status])}>
      {status}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const styles = {
    'Chờ duyệt': 'bg-amber-50 text-amber-600 border-amber-100',
    'Đã xác nhận': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Từ chối': 'bg-red-50 text-red-600 border-red-100',
    'Đã hủy': 'bg-black/5 text-black/40 border-black/5',
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold border", styles[status])}>
      {status}
    </span>
  );
}

function CatalogModal({ catalog, flatDepts, onClose, onSubmit }: {
  catalog?: TaskCatalog,
  flatDepts: { id: string; name: string }[],
  onClose: () => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
}) {
  const isEdit = !!catalog;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Modal header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{isEdit ? 'Sửa công việc' : 'Thêm công việc mới'}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Tên công việc */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tên công việc <span className="text-red-500">*</span></label>
            <input
              required
              name="name"
              defaultValue={catalog?.name}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              placeholder="VD: Lập báo cáo tháng..."
            />
          </div>

          {/* Nhóm + Phòng ban - 2 cột */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nhóm công việc <span className="text-red-500">*</span></label>
              <select
                name="category"
                defaultValue={catalog?.category || CATEGORIES[0]}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phòng ban áp dụng</label>
              <select
                name="departmentId"
                defaultValue={catalog?.departmentId || ''}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="">Tất cả phòng ban</option>
                {flatDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Mô tả công việc</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={catalog?.description}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
              placeholder="Chi tiết nội dung công việc..."
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Trạng thái sử dụng</label>
            <div className="flex gap-3">
              {(['Đang sử dụng', 'Ngừng sử dụng'] as const).map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    defaultChecked={(catalog?.status ?? 'Đang sử dụng') === s}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-gray-700">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-[#f97316] hover:bg-[#ea6c0a] transition-colors"
            >
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode, onClose: () => void, title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Plus className="rotate-45" size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function AddRoomBookingModal({ booking, onClose, onSubmit, checkConflict }: {
  booking?: Booking,
  onClose: () => void,
  onSubmit: (data: Partial<Booking>) => void,
  checkConflict: (resourceId: string, start: string, end: string, excludeId?: string) => boolean
}) {
  const [resourceId, setResourceId] = useState<string>(booking?.resourceId || '');
  const [userId, setUserId] = useState<string>(booking?.userId || '');
  const [startTime, setStartTime] = useState<string>(booking?.startTime ? booking.startTime.slice(0, 16) : '');
  const [endTime, setEndTime] = useState<string>(booking?.endTime ? booking.endTime.slice(0, 16) : '');
  const [purpose, setPurpose] = useState<string>(booking?.purpose || '');
  const [participants, setParticipants] = useState<string>(booking?.participants || '');
  const [equipment, setEquipment] = useState<string[]>(booking?.equipment || []);
  const [error, setError] = useState<string | null>(null);

  const selectedRoom = ROOM_RESOURCES.find(r => r.id === resourceId);

  const toggleEquipment = (item: string) => {
    setEquipment(prev => prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!resourceId || !userId || !startTime || !endTime || !purpose) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (isBefore(parseISO(endTime), parseISO(startTime))) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }
    if (checkConflict(resourceId, startTime, endTime, booking?.id)) {
      setError('Phòng họp đã bị đặt trong khoảng thời gian này. Vui lòng chọn thời gian khác.');
      return;
    }
    onSubmit({
      resourceId,
      resourceType: 'Phòng họp',
      userId,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      purpose,
      participants,
      equipment,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-blue-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{booking ? 'Sửa lịch đặt phòng họp' : 'Đặt phòng họp'}</h3>
              <p className="text-sm text-black/40">Điền thông tin để đặt phòng họp</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full">
            <Plus className="rotate-45" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Row 1: Room + User */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Phòng họp <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={resourceId}
                onChange={e => { setResourceId(e.target.value); setEquipment([]); }}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">-- Chọn phòng họp --</option>
                {ROOM_RESOURCES.map(r => (
                  <option key={r.id} value={r.id}>{r.name} — {r.floor} — {r.capacity} chỗ</option>
                ))}
              </select>
              {selectedRoom && (
                <p className="text-[11px] text-blue-600 mt-1">Sức chứa tối đa: {selectedRoom.capacity} người</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Người tổ chức <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={userId}
                onChange={e => setUserId(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">-- Chọn người tổ chức --</option>
                {EMPLOYEES.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Start + End time */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Thời gian bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="datetime-local"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Thời gian kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="datetime-local"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Row 3: Purpose + Participants */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Mục đích họp <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-200"
                placeholder="VD: Họp review dự án Q1..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">Người tham gia</label>
              <input
                value={participants}
                onChange={e => setParticipants(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-200"
                placeholder="VD: 5 người, Phòng Kỹ thuật..."
              />
            </div>
          </div>

          {/* Equipment checkboxes */}
          {selectedRoom && selectedRoom.availableEquipment.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">Thiết bị cần dùng</label>
              <div className="flex flex-wrap gap-2">
                {selectedRoom.availableEquipment.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleEquipment(item)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm border transition-all",
                      equipment.includes(item)
                        ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                        : "bg-white text-black/60 border-black/10 hover:border-blue-300"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-2xl font-bold hover:bg-black/5 transition-colors">Hủy bỏ</button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all"
            >
              {booking ? 'Cập nhật lịch đặt' : 'Xác nhận đặt phòng'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AddVehicleBookingModal({ booking, onClose, onSubmit, checkConflict }: {
  booking?: Booking,
  onClose: () => void,
  onSubmit: (data: Partial<Booking>) => void,
  checkConflict: (resourceId: string, start: string, end: string, excludeId?: string) => boolean
}) {
  const [resourceId, setResourceId] = useState<string>(booking?.resourceId || '');
  const [userId, setUserId] = useState<string>(booking?.userId || '');
  const [startTime, setStartTime] = useState<string>(booking?.startTime ? booking.startTime.slice(0, 16) : '');
  const [endTime, setEndTime] = useState<string>(booking?.endTime ? booking.endTime.slice(0, 16) : '');
  const [purpose, setPurpose] = useState<string>(booking?.purpose || '');
  const [departure, setDeparture] = useState<string>(booking?.departure || '');
  const [destination, setDestination] = useState<string>(booking?.destination || '');
  const [passengerCount, setPassengerCount] = useState<number>(booking?.passengerCount || 1);
  const [driver, setDriver] = useState<string>(booking?.driver || '');
  const [error, setError] = useState<string | null>(null);

  const selectedVehicle = VEHICLE_RESOURCES.find(v => v.id === resourceId);

  // Auto-fill driver when vehicle changes
  const handleVehicleChange = (id: string) => {
    setResourceId(id);
    const v = VEHICLE_RESOURCES.find(v => v.id === id);
    if (v && !booking?.driver) setDriver(v.defaultDriver);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!resourceId || !userId || !startTime || !endTime || !purpose || !departure || !destination) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (isBefore(parseISO(endTime), parseISO(startTime))) {
      setError('Thời gian về phải sau thời gian đi');
      return;
    }
    if (selectedVehicle && passengerCount > selectedVehicle.seats) {
      setError(`Số người vượt quá sức chứa của xe (tối đa ${selectedVehicle.seats} người)`);
      return;
    }
    if (checkConflict(resourceId, startTime, endTime, booking?.id)) {
      setError('Xe đã được đặt trong khoảng thời gian này. Vui lòng chọn xe hoặc thời gian khác.');
      return;
    }
    onSubmit({
      resourceId,
      resourceType: 'Xe công tác',
      userId,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      purpose,
      departure,
      destination,
      passengerCount,
      driver,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-purple-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-xl">
              <Car size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{booking ? 'Sửa yêu cầu đặt xe' : 'Đặt xe công tác'}</h3>
              <p className="text-sm text-black/40">Yêu cầu sẽ chờ phê duyệt trước khi xác nhận</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full">
            <Plus className="rotate-45" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Row 1: Vehicle + Requester */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Phương tiện <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={resourceId}
                onChange={e => handleVehicleChange(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
              >
                <option value="">-- Chọn xe --</option>
                {VEHICLE_RESOURCES.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.vehicleType}, {v.seats} chỗ, {v.plateNumber})</option>
                ))}
              </select>
              {selectedVehicle && (
                <p className="text-[11px] text-purple-600 mt-1">Tài xế mặc định: {selectedVehicle.defaultDriver}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Người yêu cầu <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={userId}
                onChange={e => setUserId(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
              >
                <option value="">-- Chọn nhân viên --</option>
                {EMPLOYEES.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Departure + Destination */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Điểm đi <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={departure}
                onChange={e => setDeparture(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
                placeholder="VD: Văn phòng Hà Nội"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Điểm đến <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
                placeholder="VD: Khách hàng tại Cầu Giấy"
              />
            </div>
          </div>

          {/* Row 3: Start + End time */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Thời gian đi <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="datetime-local"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Thời gian về <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="datetime-local"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          {/* Row 4: Passengers + Driver */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                Số người đi {selectedVehicle && <span className="text-black/30 normal-case font-normal">(tối đa {selectedVehicle.seats})</span>}
              </label>
              <input
                type="number"
                min={1}
                max={selectedVehicle?.seats || 99}
                value={passengerCount}
                onChange={e => setPassengerCount(Number(e.target.value))}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">Tài xế / Điều phối</label>
              <input
                value={driver}
                onChange={e => setDriver(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
                placeholder="Tên tài xế..."
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
              Mục đích công tác <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-purple-200"
              placeholder="VD: Gặp khách hàng, ký hợp đồng dự án A..."
            />
          </div>

          {/* Approval notice */}
          <div className="p-3 bg-amber-50 rounded-xl flex items-center gap-3 text-sm text-amber-700">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
            <span>Yêu cầu đặt xe sẽ ở trạng thái <strong>Chờ duyệt</strong> cho đến khi được phê duyệt</span>
          </div>

          <div className="pt-2 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-2xl font-bold hover:bg-black/5 transition-colors">Hủy bỏ</button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-3.5 rounded-2xl font-bold hover:bg-purple-700 transition-all"
            >
              {booking ? 'Cập nhật yêu cầu' : 'Gửi yêu cầu đặt xe'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AddAssignmentModal({ catalog, onClose, onSubmit }: { 
  catalog: TaskCatalog[], 
  onClose: () => void, 
  onSubmit: (e: React.FormEvent<HTMLFormElement>, deptId: string, empId: string, catalogId: string) => void 
}) {
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<string>('');

  const filteredEmployees = EMPLOYEES.filter(e => e.departmentId === selectedDept);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex h-[600px] overflow-hidden"
      >
        {/* Left: Org Tree */}
        <div className="w-1/3 border-r border-black/5 p-6 overflow-y-auto bg-black/[0.01]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black/40 mb-4">1. Chọn phòng ban</h3>
          <OrgTree onSelect={setSelectedDept} selectedId={selectedDept} />
        </div>

        {/* Right: Form */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Giao việc mới</h3>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full">
              <Plus className="rotate-45" size={20} />
            </button>
          </div>

          <form onSubmit={(e) => onSubmit(e, selectedDept, selectedEmp, selectedTask)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">2. Chọn nhân viên</label>
                <select 
                  required 
                  value={selectedEmp}
                  onChange={(e) => setSelectedEmp(e.target.value)}
                  className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-black/10"
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {filteredEmployees.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                {selectedDept && filteredEmployees.length === 0 && (
                  <p className="text-[10px] text-red-500 mt-1 italic">Phòng ban này chưa có nhân viên</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">3. Chọn công việc</label>
                <select 
                  required 
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full bg-black/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-black/10"
                >
                  <option value="">-- Chọn công việc --</option>
                  {catalog.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {(() => {
                  const task = catalog.find(c => c.id === selectedTask);
                  if (!task) return null;
                  return (
                    <div className="mt-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{task.code}</span>
                        <span className="text-[10px] text-black/30">·</span>
                        <span className="text-[10px] text-black/50">{task.category}</span>
                      </div>
                      <p className="text-xs text-black/60 leading-relaxed">
                        {task.description || <span className="italic text-black/30">Chưa có mô tả</span>}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">4. Hạn hoàn thành</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                <input 
                  required 
                  type="date" 
                  name="deadline"
                  className="w-full bg-black/5 border-none rounded-xl p-3 pl-12 focus:ring-2 focus:ring-black/10" 
                />
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold hover:bg-black/5 transition-colors">Hủy bỏ</button>
              <button 
                type="submit" 
                disabled={!selectedDept || !selectedEmp || !selectedTask}
                className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Xác nhận giao việc
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
