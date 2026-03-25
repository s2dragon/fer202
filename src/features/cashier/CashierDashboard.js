import React, { useEffect, useState } from "react";
import { getTablesWithOrders, getOrderItemsForCheckout, checkoutOrder, resetTable } from "../../api/cashierApi";
import { getBookings } from "../../api/bookingApi";
import InvoiceModal from "./InvoiceModal";
import { Container, Button, Row, Col, Card, Badge } from "react-bootstrap";

export default function CashierDashboard({ restaurantId = 1, onBack }) {
  const [tables, setTables] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [buffets, setBuffets] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderItemsForInvoice, setOrderItemsForInvoice] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);

  // Since getBookings isn't exported from cashierApi yet, we might need to import it from bookingApi.
  // Wait, let's just make sure getBookings is imported correctly from bookingApi. 
  // actually, we can import it directly inside the file since it's just a file editing.
  // I will replace `import { ... } from "../../api/cashierApi";` and add `import { getBookings } from "../../api/bookingApi";`
  
  const loadData = async () => {
    try {
      const { tables, activeOrders, buffets } = await getTablesWithOrders(restaurantId);
      setTables(tables);
      setActiveOrders(activeOrders);
      setBuffets(buffets);

      // Fetch bookings to know when tables are reserved
      const bookings = await getBookings(restaurantId);
      setUpcomingBookings(bookings || []);
    } catch (e) {
      alert("Lỗi tải dữ liệu thu ngân: " + e.message);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckoutClick = async (order, table) => {
    try {
      const items = await getOrderItemsForCheckout(order.id);
      setSelectedOrder(order);
      setSelectedTable(table);
      setOrderItemsForInvoice(items);
      setShowInvoice(true);
    } catch (e) {
      alert("Lỗi tải chi tiết đơn: " + e.message);
    }
  };

  const handleConfirmPaid = async (grandTotal) => {
    try {
      const tableOrders = activeOrders.filter(o => String(o.tableId) === String(selectedTable.id));
      for (const o of tableOrders) {
        await checkoutOrder(o.id, grandTotal);
      }
      await resetTable(selectedTable.id);
      alert("Đã thanh toán thành công!");
      setShowInvoice(false);
      loadData(); // refresh
    } catch (e) {
      alert("Lỗi thanh toán: " + e.message);
    }
  };

  const getTableAvailabilityMsg = (tableId) => {
    const now = new Date();
    const todayStr = now.toDateString();

    const todaysBookings = upcomingBookings
      .filter(b => b.status === "approved" || b.status === "pending")
      .filter(b => String(b.tableId) === String(tableId))
      .map(b => new Date(b.bookingTime))
      .filter(date => date.toDateString() === todayStr)
      .sort((a, b) => a - b);

    for (const bTime of todaysBookings) {
       const bEndTime = new Date(bTime.getTime() + 2 * 3600 * 1000);
       // If current time is within a booked slot, but table is empty (isOccupied = false comes from caller)
       if (now >= bTime && now < bEndTime) {
          return "Đang chờ khách (Đã đặt trước)";
       }
       // First future booking today
       if (bTime > now) {
          const timeFmt = { hour: '2-digit', minute: '2-digit' };
          return `Trống đến ${bTime.toLocaleTimeString('vi-VN', timeFmt)}`;
       }
    }

    return "Trống (Cả ngày hôm nay)";
  };

  return (
    <Container className="py-4" style={{ maxWidth: "1000px" }}>
      {showInvoice && (
        <InvoiceModal 
           order={selectedOrder} 
           table={selectedTable} 
           orderItems={orderItemsForInvoice} 
           buffets={buffets}
           onClose={() => setShowInvoice(false)}
           onConfirmPaid={handleConfirmPaid}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-0">Thu Ngân (Cashier)</h2>
        {onBack && <Button variant="outline-dark" size="sm" onClick={onBack}>Quay lại</Button>}
      </div>

      <Row className="g-4">
        {tables.map(table => {
          // Find all orders for this table, take the latest one
          const tableOrders = activeOrders.filter(o => String(o.tableId) === String(table.id));
          const order = tableOrders.length > 0 ? tableOrders[tableOrders.length - 1] : null;
          const isOccupied = !!order;

          return (
            <Col xs={12} sm={6} md={4} lg={3} key={table.id}>
              <Card className="h-100 shadow-sm border-0 rounded-4" style={{ borderTop: `5px solid ${isOccupied ? '#dc3545' : '#198754'}` }}>
                <Card.Body className="d-flex flex-column p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-bold fs-5 mb-0">Bàn {table.tableNumber}</Card.Title>
                    <Badge bg={isOccupied ? 'danger' : 'success'} className="rounded-pill">
                      {isOccupied ? "Đang phục vụ" : "Trống"}
                    </Badge>
                  </div>
                  
                  {isOccupied ? (
                    <>
                      <div className="text-secondary small mb-3 flex-grow-1">
                        <div><strong className="text-dark">Khách:</strong> {order.guestCount} người</div>
                        <div><strong className="text-dark">Trạng thái:</strong> {order.status}</div>
                        <div><strong className="text-dark">Cập nhật:</strong> {new Date(order.updatedAt).toLocaleTimeString()}</div>
                      </div>
                      <Button variant="primary" className="w-100 fw-bold rounded-3 mt-auto" onClick={() => handleCheckoutClick(order, table)}>
                        Tính tiền / Thanh toán
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-secondary small mb-3 flex-grow-1 mt-2">
                        <strong className="text-success"><i className="bi bi-clock-history"></i> Hiện tại bàn trống</strong>
                      </div>
                      <div className="text-center rounded-3 bg-light py-2 text-danger fw-bold small mt-auto border border-danger border-opacity-25">
                        {getTableAvailabilityMsg(table.id)}
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
