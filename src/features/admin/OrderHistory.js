import React, { useEffect, useState, useMemo } from "react";
import { Table, Badge, Button, Form, Row, Col, Card } from "react-bootstrap";
import { getOrders, getOrderItemsAll, getAllTables, getBuffets } from "../../api/qrOrderApi";

export default function OrderHistory({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [buffets, setBuffets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [o, oi, tb, bf] = await Promise.all([
        getOrders(),
        getOrderItemsAll(),
        getAllTables(),
        getBuffets(1) // Assuming restaurantId 1 for now, or fetch all if API supports it
      ]);
      setOrders(o || []);
      setOrderItems(oi || []);
      setTables(tb || []);
      setBuffets(bf || []);
    } catch (e) {
      setError(e.message || "Lỗi tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const tableById = useMemo(() => {
    return tables.reduce((acc, t) => {
      acc[t.id] = t;
      return acc;
    }, {});
  }, [tables]);

  const buffetById = useMemo(() => {
    return buffets.reduce((acc, b) => {
      acc[b.id] = b;
      return acc;
    }, {});
  }, [buffets]);

  const sortedOrders = useMemo(() => {
    let result = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filterDate) {
      result = result.filter(
        (o) => new Date(o.createdAt).toLocaleDateString("en-CA") === filterDate
      );
    }
    return result;
  }, [orders, filterDate]);

  const renderOrderItems = (orderId) => {
    const items = orderItems.filter((i) => String(i.orderId) === String(orderId));
    if (!items.length) return <div className="text-muted fst-italic p-3">Chưa có món nào.</div>;

    return (
      <Table size="sm" striped bordered className="mt-2 mb-0 bg-white shadow-sm">
        <thead>
          <tr className="table-secondary">
            <th>Tên món</th>
            <th className="text-center">Số lượng</th>
            <th>Trạng thái bếp</th>
            <th className="text-end">Đơn giá</th>
            <th className="text-end">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.name}</td>
              <td className="text-center fw-bold">{it.quantity}</td>
              <td>
                <Badge
                  bg={
                    it.status === "served"
                      ? "success"
                      : it.status === "preparing"
                      ? "info"
                      : "warning"
                  }
                >
                  {it.status}
                </Badge>
              </td>
              <td className="text-end">{Number(it.unitPrice).toLocaleString()}đ</td>
              <td className="text-end text-danger fw-bold">{Number(it.lineTotal).toLocaleString()}đ</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className={onBack ? "py-4 container" : ""}>
      {onBack ? (
        <div className="mb-4 pb-2 border-bottom">
          <h2 className="fw-bold mb-0">Lịch sử Đơn hàng</h2>
        </div>
      ) : (
        <h3 className="fw-bold mb-4">Lịch sử & Theo dõi Đơn hàng</h3>
      )}
      
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Body className="bg-light p-3 rounded-4">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold small text-muted">Lọc theo ngày:</Form.Label>
                <Form.Control
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={8} className="text-end">
               <div className="mt-4">
                 <strong>Tổng số đơn: </strong> <Badge bg="dark" className="fs-6">{sortedOrders.length}</Badge>
               </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Table responsive hover className="align-middle border shadow-sm rounded-4 overflow-hidden">
        <thead className="table-dark">
          <tr>
            <th className="py-3">Mã Đơn</th>
            <th className="py-3">Bàn</th>
            <th className="py-3">Khách</th>
            <th className="py-3">Gói Buffet</th>
            <th className="py-3">Thời gian Bắt đầu</th>
            <th className="py-3">T/G Kết thúc (Ước tính)</th>
            <th className="py-3">Trạng thái Bếp</th>
            <th className="py-3">Thanh toán</th>
            <th className="py-3 text-end">Tổng tiền</th>
            <th className="py-3 text-center">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((o) => {
            const tableStr = tableById[o.tableId]?.tableNumber || o.tableId;
            const buffetInfo = buffetById[o.buffetId];
            const startDt = new Date(o.createdAt);
            
            // Calculate end time using buffet duration (or fallback to 90 min)
            const durationMins = buffetInfo ? Number(buffetInfo.duration) : 90;
            const estEndDt = new Date(startDt.getTime() + durationMins * 60000); 
            
            const isExpanded = expandedOrderId === o.id;

            return (
              <React.Fragment key={o.id}>
                <tr>
                  <td className="fw-bold text-danger">#{o.id}</td>
                  <td className="fw-bold">Bàn {tableStr}</td>
                  <td>{o.guestCount || 1} người</td>
                  <td>
                    {buffetInfo ? (
                      <Badge bg="primary" className="fw-normal">{buffetInfo.name}</Badge>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{startDt.toLocaleTimeString("vi-VN")} - {startDt.toLocaleDateString("vi-VN")}</td>
                  <td className="text-danger fw-bold">{estEndDt.toLocaleTimeString("vi-VN")} <small className="text-muted">(+{durationMins}p)</small></td>
                  <td>
                    <Badge bg={o.status === "served" ? "success" : o.status === "pending" ? "warning" : "info"}>
                      {o.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={o.status === "paid" ? "success" : "danger"} className="px-3 py-1 rounded-pill">
                      {o.status === "paid" ? "Đã thanh toán" : "Chưa TT"}
                    </Badge>
                  </td>
                  <td className="text-end fw-bold">{Number(o.grandTotal).toLocaleString()}đ</td>
                  <td className="text-center">
                    <Button
                      variant={isExpanded ? "secondary" : "outline-primary"}
                      size="sm"
                      onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                    >
                      {isExpanded ? "Đóng" : "Xem món"}
                    </Button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={10} className="bg-light p-3">
                      <div className="fw-bold mb-2">Chi tiết món ăn:</div>
                      {renderOrderItems(o.id)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
          {sortedOrders.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center py-4 text-muted">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
