import React, { useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "../../api/bookingApi";
import { Container, Table, Badge, Button, Card } from "react-bootstrap";

export default function BookingStaff({ restaurantId = 1, onBack }) {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const data = await getBookings(restaurantId);
      // sort by time closest to now, or just time desc/asc
      data.sort((a, b) => new Date(a.bookingTime) - new Date(b.bookingTime));
      setBookings(data);
    } catch (e) {
      alert("Lỗi tải danh sách: " + e.message);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      await loadBookings();
    } catch (e) {
      alert("Lỗi cập nhật: " + e.message);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-0">Quản lý Đặt Bàn</h2>
        {onBack && <Button variant="outline-dark" size="sm" onClick={onBack}>Đóng / Back</Button>}
      </div>

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        {bookings.length === 0 ? (
          <Card.Body className="text-center py-5 text-muted">
            Chưa có đặt bàn nào.
          </Card.Body>
        ) : (
          <Table responsive hover className="mb-0 border-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4 border-0 text-muted small text-uppercase">Thời gian</th>
                <th className="py-3 px-4 border-0 text-muted small text-uppercase">Khách hàng</th>
                <th className="py-3 px-4 border-0 text-muted small text-uppercase">SĐT</th>
                <th className="py-3 px-4 border-0 text-muted small text-uppercase text-center">Số người</th>
                <th className="py-3 px-4 border-0 text-muted small text-uppercase text-center">Trạng thái</th>
                <th className="py-3 px-4 border-0 text-muted small text-uppercase text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                let badgeColor = "warning";
                let statusText = "Chờ duyệt";
                if (b.status === "approved") {
                  badgeColor = "success";
                  statusText = "Đã duyệt";
                } else if (b.status === "rejected") {
                  badgeColor = "danger";
                  statusText = "Từ chối";
                }

                return (
                  <tr key={b.id} className="border-bottom">
                    <td className="py-3 px-4 fw-medium text-nowrap">
                      {new Date(b.bookingTime).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 px-4 fw-bold text-dark">{b.customerName}</td>
                    <td className="py-3 px-4 text-secondary">{b.phone}</td>
                    <td className="py-3 px-4 text-center fw-bold">{b.guestCount}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge bg={badgeColor} className={`px-3 py-2 rounded-pill ${badgeColor === 'warning' ? 'text-dark' : ''}`}>
                        {statusText}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-end">
                      {b.status === "pending" && (
                        <div className="d-flex justify-content-end gap-2">
                          <Button variant="outline-success" size="sm" className="fw-bold px-3 rounded-pill" onClick={() => handleStatusChange(b.id, "approved")}>
                            Duyệt
                          </Button>
                          <Button variant="outline-danger" size="sm" className="fw-bold px-3 rounded-pill" onClick={() => handleStatusChange(b.id, "rejected")}>
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}
