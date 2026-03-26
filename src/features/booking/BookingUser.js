import React, { useState, useEffect } from "react";
import { createBooking, getBookings, getTables } from "../../api/bookingApi";
import { Form, Button, Card, Badge, Row, Col, Container } from "react-bootstrap";

export default function BookingUser({ restaurantId = 1, onBack }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [tables, setTables] = useState([]);
  
  const [myBookings, setMyBookings] = useState([]);
  const [viewHistoryPhone, setViewHistoryPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load tables for selection
    getTables(restaurantId).then(data => {
      setTables(data || []);
    }).catch(e => console.error(e));
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !phone || !guestCount || !bookingDate || !bookingTime || !selectedTableId) {
      return alert("Vui lòng điền đầy đủ thông tin và chọn bàn!");
    }

    const table = tables.find(t => String(t.id) === String(selectedTableId));
    if (table && guestCount > table.capacity) {
      return alert(`Số khách lưu ý không được vượt quá sức chứa của bàn là ${table.capacity} người!`);
    }
    
    if (loading) return;
    setLoading(true);

    try {
      const allBookings = await getBookings(restaurantId);
      const reqDateTime = new Date(`${bookingDate}T${bookingTime}`);
      
      // Check overlaps for the specific table
      // Fixed 2 hours usage
      const overlappingBookings = allBookings.filter(b => {
        if (b.status === "rejected") return false;
        if (String(b.tableId) !== String(selectedTableId)) return false;

        const bStartTime = new Date(b.bookingTime);
        const bEndTime = new Date(bStartTime.getTime() + 2 * 3600 * 1000); // +2 hours

        const reqEndTime = new Date(reqDateTime.getTime() + 2 * 3600 * 1000); // 2 hours

        // Overlap condition: Not (reqEndTime <= bStartTime OR reqStartTime >= bEndTime)
        // Which translates to:
        return (reqDateTime < bEndTime && reqEndTime > bStartTime);
      });

      if (overlappingBookings.length > 0) {
        setLoading(false);
        const conflict = overlappingBookings[0];
        const confStart = new Date(conflict.bookingTime);
        const confEnd = new Date(confStart.getTime() + 2 * 3600 * 1000);
        
        const timeFmt = { hour: '2-digit', minute: '2-digit' };
        return alert(`Bàn này đã được đặt từ ${confStart.toLocaleTimeString('vi-VN', timeFmt)} đến ${confEnd.toLocaleTimeString('vi-VN', timeFmt)}.\nVui lòng chọn giờ sau ${confEnd.toLocaleTimeString('vi-VN', timeFmt)} hoặc chọn bàn khác!`);
      }
      
      // Check if same phone number already has a pending/approved booking around this time (within 2h)
      const isDuplicate = allBookings.some(b => {
          if (b.phone === phone && b.status !== "rejected") {
             const bTime = new Date(b.bookingTime);
             const diffHours = Math.abs(reqDateTime - bTime) / 36e5;
             return diffHours < 2;
          }
          return false;
      });
      
      if (isDuplicate) {
          setLoading(false);
          return alert("Bạn đã có một lịch đặt bàn trong khung giờ này rồi!");
      }

      const newBooking = {
        restaurantId,
        customerName,
        phone,
        guestCount: Number(guestCount),
        tableId: Number(selectedTableId),
        bookingTime: reqDateTime.toISOString(),
        status: "pending"
      };

      await createBooking(newBooking);
      alert("Đặt bàn thành công! Vui lòng chờ nhà hàng xác nhận.");
      
      // clear form
      setCustomerName("");
      setPhone("");
      setGuestCount(2);
      setBookingDate("");
      setBookingTime("");
      setSelectedTableId("");
      
      if (onBack) onBack();
      
    } catch (error) {
       alert("Lỗi khi đặt bàn: " + error.message);
    } finally {
       setLoading(false);
    }
  };

  const loadHistory = async () => {
      if (!viewHistoryPhone) return alert("Vui lòng nhập SĐT!");
      try {
          const allB = await getBookings(restaurantId);
          const history = allB.filter(b => b.phone === viewHistoryPhone);
          setMyBookings(history);
          if (history.length === 0) alert("Không tìm thấy lịch sử đặt bàn cho SĐT này.");
      } catch(e) {
          alert("Lỗi: " + e.message);
      }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '700px' }}>
      {onBack && (
        <Button variant="outline-dark" size="sm" className="mb-4 rounded-pill fw-bold" onClick={onBack}>
          &larr; Quay lại
        </Button>
      )}

      <h2 className="mb-4 fw-bold">Đặt Bàn Online</h2>
      <Card className="shadow-sm border-0 rounded-4 mb-5">
        <Card.Body className="p-4 bg-light rounded-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small text-muted">Tên khách hàng</Form.Label>
                  <Form.Control
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small text-muted">Số điện thoại</Form.Label>
                  <Form.Control
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="SĐT"
                    type="tel"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small text-muted">Chọn Bàn Đặt</Form.Label>
                  <Form.Select 
                    value={selectedTableId}
                    onChange={(e) => setSelectedTableId(e.target.value)}
                  >
                    <option value="">-- Chọn bàn --</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>Bàn {t.tableNumber} (Sức chứa: {t.capacity} người)</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small text-muted">Số người thực tế</Form.Label>
                  <Form.Control
                    value={guestCount}
                    onChange={(e) =>
                      setGuestCount(e.target.value ? Number(e.target.value.replace(/[^0-9]/g, "")) : "")
                    }
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small text-muted">Ngày (Sử dụng trong 2 tiếng)</Form.Label>
                  <Form.Control
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    type="date"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold small text-muted">Giờ</Form.Label>
                  <Form.Control
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    type="time"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="danger"
              type="submit"
              disabled={loading}
              className="w-100 fw-bold py-2 mt-4 rounded-3"
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt bàn"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <hr className="my-4 text-muted" />

      <h4 className="fw-bold mb-3">Tra cứu lịch sử đặt bàn</h4>
      <div className="d-flex gap-2 mb-4">
        <Form.Control
          value={viewHistoryPhone}
          onChange={(e) => setViewHistoryPhone(e.target.value)}
          placeholder="Nhập SĐT để tra cứu..."
          className="shadow-sm"
        />
        <Button variant="dark" className="fw-bold px-4 text-nowrap" onClick={loadHistory}>
          Tra cứu
        </Button>
      </div>

      <div className="d-flex flex-column gap-3">
        {myBookings.map((b) => {
          let badgeColor = "warning"; // pending
          let statusText = "Chờ duyệt";
          if (b.status === "approved") {
            badgeColor = "success";
            statusText = "Đã duyệt";
          } else if (b.status === "rejected") {
            badgeColor = "danger";
            statusText = "Từ chối";
          }
          
          const tTable = tables.find(t => String(t.id) === String(b.tableId));
          const tblDisplay = tTable ? `Bàn ${tTable.tableNumber}` : "(Chưa có bàn)";

          return (
            <Card key={b.id} className="shadow-sm border-0 rounded-4">
              <Card.Body className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <div className="fw-bold text-dark mb-1">
                    {new Date(b.bookingTime).toLocaleString("vi-VN")}
                  </div>
                  <div className="text-secondary small">
                    Khách: {b.customerName} - {b.guestCount} người - <span className="text-danger fw-bold">{tblDisplay}</span>
                  </div>
                </div>
                <div>
                  <Badge bg={badgeColor} className="px-3 py-2 rounded-pill shadow-sm">
                    {statusText}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
