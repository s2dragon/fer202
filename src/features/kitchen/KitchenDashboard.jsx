import React, { useEffect, useMemo, useState } from "react";
import { Container, Button, Form, Row, Col, Card, Badge } from "react-bootstrap";
import {
  getAllTables,
  getOrders,
  getOrderItemsAll,
  patchOrder,
  patchOrderItem,
} from "../../api/qrOrderApi";

const STATUS_FLOW = ["pending", "preparing", "served"];

export default function KitchenDashboard({ onBack }) {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [filterTableId, setFilterTableId] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [tablesRes, ordersRes, orderItemsRes] = await Promise.all([
        getAllTables(),
        getOrders(),
        getOrderItemsAll(),
      ]);

      setTables(tablesRes || []);
      setOrders(ordersRes || []);
      setOrderItems(orderItemsRes || []);
    } catch (e) {
      setError(e?.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 3000);
    return () => clearInterval(timer);
  }, []);

  const tableById = useMemo(() => {
    return tables.reduce((acc, t) => {
      acc[t.id] = t;
      return acc;
    }, {});
  }, [tables]);

  const visibleItems = useMemo(() => {
    const allowed = STATUS_FLOW;
    const byStatus = (item) => (filterStatus === "all" ? true : item.status === filterStatus);

    const mapWithOrder = orderItems
      .map((item) => {
        const order = orders.find((o) => String(o.id) === String(item.orderId));
        if (!order) return null;
        if (filterTableId && String(order.tableId) !== String(filterTableId)) return null;
        return { ...item, order, table: tableById[String(order.tableId)] };
      })
      .filter(Boolean)
      .filter((item) => allowed.includes(item.status) && byStatus(item));

    return mapWithOrder.sort((a, b) => {
      return STATUS_FLOW.indexOf(a.status) - STATUS_FLOW.indexOf(b.status) || (a.orderId > b.orderId ? 1 : -1);
    });
  }, [orderItems, orders, tableById, filterTableId, filterStatus]);

  const changeItemStatus = async (item) => {
    const currentIndex = STATUS_FLOW.indexOf(item.status);
    const nextStatus = STATUS_FLOW[Math.min(currentIndex + 1, STATUS_FLOW.length - 1)];

    try {
      const patchedItem = await patchOrderItem(item.id, {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
      setOrderItems((prev) => prev.map((x) => (String(x.id) === String(item.id) ? patchedItem : x)));

      if (nextStatus === "served") {
        const orderItemsOfOrder = orderItems
          .map((x) => (String(x.id) === String(item.id) ? patchedItem : x))
          .filter((x) => String(x.orderId) === String(item.orderId));

        const allServed = orderItemsOfOrder.every((x) => x.status === "served");
        if (allServed) {
          const patchedOrder = await patchOrder(item.orderId, {
            status: "served",
            updatedAt: new Date().toISOString(),
          });
          setOrders((prev) => prev.map((o) => (String(o.id) === String(patchedOrder.id) ? patchedOrder : o)));
        }
      }
    } catch (e) {
      alert("Cập nhật trạng thái lỗi: " + (e.message || e));
    }
  };

  return (
    <Container fluid className="py-4" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-0">Kitchen Dashboard</h2>
        <Button variant="dark" onClick={onBack}>
          Về khách
        </Button>
      </div>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-4 bg-light p-3 rounded-4 shadow-sm">
        <div className="d-flex align-items-center gap-2">
          <strong>Polling:</strong>
          <span className="text-secondary small">
            {loading ? "Đang tải..." : `Đã có ${visibleItems.length} mục`}
          </span>
        </div>
        <Button variant="outline-dark" size="sm" className="fw-bold rounded-pill" onClick={loadData} disabled={loading}>
          Làm mới ngay
        </Button>
      </div>

      {error && <div className="alert alert-danger shadow-sm rounded-4">{error}</div>}

      <div className="d-flex flex-wrap gap-3 mb-4">
        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="mb-0 fw-bold">Bàn:</Form.Label>
          <Form.Select 
            value={filterTableId} 
            onChange={(e) => setFilterTableId(e.target.value)} 
            className="shadow-sm border-0 bg-white"
            style={{ minWidth: '150px' }}
          >
            <option value="">Tất cả</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.tableNumber}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="mb-0 fw-bold">Trạng thái:</Form.Label>
          <Form.Select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="shadow-sm border-0 bg-white"
            style={{ minWidth: '150px' }}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="served">Served</option>
          </Form.Select>
        </Form.Group>
      </div>

      {visibleItems.length === 0 && <div className="text-muted fst-italic">Không có món phù hợp</div>}

      <Row className="g-3">
        {visibleItems.map((item) => {
          const canAdvance = item.status !== "served";
          const next = item.status === "pending" ? "preparing" : item.status === "preparing" ? "served" : "served";

          let badgeColor = "warning";
          if (item.status === "preparing") badgeColor = "info";
          if (item.status === "served") badgeColor = "success";

          return (
            <Col xs={12} sm={6} md={4} lg={3} key={`${item.id}-${item.orderId}`}>
              <Card className="shadow-sm border-0 h-100 rounded-4">
                <Card.Body className="d-flex flex-column p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                    <Card.Title className="fs-6 fw-bold mb-0">
                      {item.name} <span className="text-danger">x{item.quantity}</span>
                    </Card.Title>
                    <Badge bg={badgeColor} className="text-uppercase rounded-pill py-1 px-2" style={{ fontSize: '10px' }}>
                      {item.status}
                    </Badge>
                  </div>

                  <div className="text-secondary small mt-2 flex-grow-1">
                    <div><strong>Order #{item.orderId}</strong> / Bàn {item.table?.tableNumber ?? item.order?.tableId}</div>
                    <div><span className="text-muted">Order status:</span> {item.order?.status || "-"}</div>
                    {item.order?.note && (
                      <div className="mt-1 p-2 bg-light rounded text-danger fst-italic">
                        Note: {item.order.note}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-top d-flex flex-column gap-2">
                    <Button 
                      variant={canAdvance ? "dark" : "outline-secondary"} 
                      size="sm" 
                      className="w-100 fw-bold" 
                      onClick={() => changeItemStatus(item)} 
                      disabled={!canAdvance || loading}
                    >
                      {canAdvance ? `Chuyển sang ${next}` : "Hoàn thành"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}